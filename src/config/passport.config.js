const passport = require('passport');
///LOCAL
const local = require('passport-local');
const LocalStrategy = local.Strategy; 
///JWT
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const { cookieExtractor } = require("../utils/jwt.js");
const { KEY_TOKEN } = require("./config.js");
///GITHUB
const GitHubStrategy = require('passport-github2');
const userModel = require("../models/userModel.js");

const { CLIENT_ID, CLIENT_SECRET } = require('./config.js');    // importamos la varibales de entorno para github
const ROLES = ["public", "user", "admin", "developer"]

const initializePassport = () => {
    ////////////////////////////////////// GITHUB STRATEGY
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
                    email: profile._json.email ?? ' ',
                    passport: ' ',
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

    ////////////////////////////////////// JWT STRATEGY
    passport.use('jwt', new JWTStrategy({
            /* jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), */
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: KEY_TOKEN
        },
        async (jwtPayload, done) => {
            try {
                if(ROLES.includes(jwtPayload.user.roles)) return done(null, jwtPayload)
                return done(null, jwtPayload)
            } catch (err) {
                return done(err)
            }
        }
    ))

    ////////////////////////////////////// REGISTER STRATEGY
    /* passport.use('register', new LocalStrategy( {passReqToCallback: true, usernameField: 'email'}, async(req, email, password, done) => {
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
                password: createHash(password),  
            };
    
            if(email === 'adminCoder@code.com' && password === 'adminCoder3r123') {
                newUser.role = "admin"
            } else {
                newUser.role = "usuario"
            }
    
            let result = await userModel.create(newUser);
            return done(null, result);              // Devuelve el nuevo usuario directamente
        } catch (err) {
            return done(err)
        }
    })) */

    ////////////////////////////////////// LOGIN STRATEGY
    /* passport.use('login', new LocalStrategy( {usernameField: 'email'}, async(username, password, done) => {
        try {
            const user = await userModel.findOne({email: username})
            if(!user) return done(null, false)
            if(!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (err) {
            return done(`Error login ${err}`)
        }
    })) */

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findById({ _id: id })
        done(null, user)
    })
}

module.exports = { initializePassport }