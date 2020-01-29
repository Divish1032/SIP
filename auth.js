const GoogleStrategy = require('passport-google-oauth20');
const passport =require('passport');
const User = require('./models/student');
const keys =require('./models/keys');
var request=require('request');
module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    }); 
    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            done(null, user);
        });
        
    });  
    passport.use(new GoogleStrategy({
            clientID: process.env.CLIENT_ID || keys.google.clientID ,
            clientSecret: process.env.CLIENT_SECRET || keys.google.clientSecret,
            callbackURL: process.env.CALLBACK_URL || keys.google.callbackURL
        },
        (token, refreshToken, profile, done) => {
            request.get('https://api.mlab.com/api/1/databases/esummit/collections/users?f={%22email%22:1,%20%22_id%22:0}&apiKey=bBu-CE3KYMZThp1b8Caik1nV4CAF3Nlx', function(err2, res2, body){
                if(err2){
                    res.send(err2)
                }
                else{
                    var flag = 0;
                    body = JSON.parse(body)
                    body.forEach(x=>{
                        if(profile._json.email == x.email){
                            flag = 1;
                            User.findOne({googleid : profile.id}).then((currentUser) => {
                                if(currentUser){
                                    console.log('already user' + currentUser);
                                    done(null, currentUser);
                                }
                                else{
                                    new User ({
                                        username : profile.name.givenName,
                                        googleid : profile.id,
                                        email : profile._json.email,
                                        branch : null,
                                        college : null,
                                        city : null,
                                        year : null,
                                        phone : null,
                                        profile : profile._json.picture,
                                        resume_link : null
                                    }).save().then((newUser) => {
                                        console.log('new user cerated' + newUser);
                                        done(null, newUser);
                                    });
                                }
                            })
                        }
                    });
                    if(flag == 0){
                        done(null, null);
                    }
                }
            });
        })
    )
}