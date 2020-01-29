const GoogleStrategy = require('passport-google-oauth20');
const passport =require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/student');
const keys =require('./models/keys');
var request=require('request');
var bcrypt = require('bcryptjs');

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
                                        username : x.first_name + " " + x.last_name,
                                        googleid : profile.id,
                                        email : profile._json.email,
                                        password : x.password,
                                        branch : null,
                                        college : null,
                                        city : x.city,
                                        year : null,
                                        phone : x.phone,
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
    );

    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
          request.get('https://api.mlab.com/api/1/databases/esummit/collections/users?apiKey=bBu-CE3KYMZThp1b8Caik1nV4CAF3Nlx', function(err2, res2, body){
            if(err2){
                res.send(err2)
            }
            else{
                var flag = 0;
                body = JSON.parse(body);
                var len= body.length;
                var i=0;
                body.forEach(x=>{
                    if(email == x.email){
                        userES = x;
                        flag = 1;
                        User.findOne({email : email}).then((currentUser) => {
                            bcrypt.compare(password, x.password, (err, isMatch) => {
                                if (err){console.log(err)};
                                if (isMatch) {
                                    if(currentUser){
                                        return done(null, currentUser);
                                    }
                                    else{
                                        bcrypt.genSalt(10, (err, salt) => {
                                            bcrypt.hash(password, salt, (err, hash) => {
                                              if (err) throw err;
                                              password = hash;
                                              new User ({
                                                username : x.first_name + " " + x.last_name,
                                                googleid : null,
                                                email : email,
                                                password : password,
                                                branch : null,
                                                college : null,
                                                city : x.city,
                                                year : null,
                                                phone : x.phone,
                                                profile : null,
                                                resume_link : null
                                                }).save().then((newUser) => {
                                                    console.log('new user cerated' + newUser);
                                                    done(null, newUser);
                                                });
                                            });
                                        }); 
                                    }
                                } 
                                else {
                                  return done(null, false, { message: 'Password Incorrect' });
                                }
                            });
                        })
                    }
                    if(i == len - 1 && flag == 0){
                        done(null, null, { message: 'Email Id does not exist on E-Summit20' });
                    }
                    i++;
                });
                
            }
          });
        })
      );
}

