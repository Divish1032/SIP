const GoogleStrategy = require('passport-google-oauth20');
const passport =require('passport');
const User = require('./models/student');

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
            clientID: "124430605126-7ulur1p71dkg0hf6ldn5macb58phpau5.apps.googleusercontent.com",
            clientSecret: "opEEllaBpcP5neIXhpx0PzWp",
            callbackURL: "https://student-internship-portal.herokuapp.com/auth/google/callback"
        },
        (token, refreshToken, profile, done) => {
            User.findOne({googleid : profile.id}).then((currentUser) => {
                if(currentUser){
                    console.log('already user' + currentUser);
                    done(null, currentUser);
                }
                else{
                    new User ({
                        name : profile.name.givenName,
                        googleid : profile.id,
                        emailid : profile._json.email,
                        branch : profile.name.familyName,
                        phone : null,
                        profile : profile._json.picture,
                        job_applied : []
                    }).save().then((newUser) => {
                        console.log('new user cerated' + newUser);
                        done(null, newUser);
                    })
                }
            })
            
        }));
};