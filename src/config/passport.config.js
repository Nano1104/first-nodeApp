const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2');
const { isValidPassword, createHash } = require('../utils/encrypt.js');
const userModel = require("../dao/models/userModel.js");

const { CLIENT_ID, CLIENT_SECRET } = require('./config.js');    // importamos la varibales de entorno

const LocalStrategy = local.Strategy; 

const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/session/github/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    phone: ' ',
                    email: profile._json.email ?? '',
                    passport: '',
                    role: "usuario"
                }

                let result = await userModel.create(newUser)
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (err) {
            done(err);
        }
    }));

    passport.use('register', new LocalStrategy( {passReqToCallback: true, usernameField: 'email'}, async(req, email, password, done) => {
        const { first_name, last_name, age, phone } = req.body;
        try {
            const user = await userModel.findOne({ email: email });
            if (user) return done(null, false)

            const newUser = {
                first_name,
                last_name,
                age,
                email,
                phone,
                password: createHash(password), // Corrected the field name to 'password'
            };

            if(email === 'adminCoder@code.com' && password === 'adminCoder3r123') {        //valida si el email y el pswrd son del admin
                newUser.role = "admin"
            } else {                                                                       //sino establece que es un usuario
                newUser.role = "usuario"
            }

            
            let result = await userModel.create(newUser);
            return done(null, result);
        } catch (err) {
            return done(`Error registering user ${err}`)
        }
    }))

    passport.use('login', new LocalStrategy( {usernameField: 'email'}, async(username, password, done) => {
        try {
            const user = await userModel.findOne({email: username})
            if(!user) return done(null, false)
            if(!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (err) {
            return done(`Error login ${err}`)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findById({ _id: id })
        done(null, user)
    })
}

module.exports = { initializePassport }