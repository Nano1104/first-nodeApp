const passport = require('passport');
/* const local = require('passport-local');
const LocalStrategy = local.Strategy;  */
///JWT
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const { cookieExtractor } = require("../utils/jwt.js");
const { KEY_TOKEN } = require("./config.js");
///GITHUB
const GitHubStrategy = require('passport-github2');
const { CLIENT_ID, CLIENT_SECRET } = require('./config.js');    // importamos la varibales de entorno para github
const userModel = require("../models/userModel.js");


const ROLES = ["user", "admin", "premium"]

const initializePassport = () => {      //Estrategia por si se quiere usar github para autenticacion de terceros
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
                    role: "user"
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

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await userModel.findById({ _id: id })
        done(null, user)
    })
}

module.exports = { initializePassport }