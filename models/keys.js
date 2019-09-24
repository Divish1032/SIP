module.exports = {
    google: {
        clientID : '124430605126-7ulur1p71dkg0hf6ldn5macb58phpau5.apps.googleusercontent.com',
        clientSecret : 'opEEllaBpcP5neIXhpx0PzWp',
        callbackURL : 'http://student-internship-portal.herokuapp.com/auth/google/callback'
    },
    admin : {
        email : 'ecell@itbhu.ac.in',
        password : 'ECELL_IITBHU#1',
        mongoDB : 'mongodb://ecell:ecell007@ds215988.mlab.com:15988/student_internship_portal'
    }
}
// 'http://student-internship-portal.herokuapp.com'
// 'http://studentinternship-portal.com:8000/auth/google/callback'

/* google: {
    clientID : '124430605126-7ulur1p71dkg0hf6ldn5macb58phpau5.apps.googleusercontent.com',
    clientSecret : 'opEEllaBpcP5neIXhpx0PzWp',
    callbackURL : 'http://student-internship-portal.herokuapp.com/auth/google/callback'
},
admin : {
    email : process.env.EMAILID_KEY,
    mongoDB : 'mongodb://ecell:ecell007@ds215988.mlab.com:15988/student_internship_portal' */