import { config } from '../config/index.js';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { UserDao } from "../dao/index.js";
import { BCRYPT_VALIDATION } from '../utils/index.js';

const init = () => {

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserDao.getById(id)
        done(null, user)
    })

    passport.use("login", new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    }, async (req, email, password, done) => {
        try {
            UserDao.getOne({ email }, (error, user) => {

                if (error) return done(null, false)
                if (!user) {
                    console.log(`Password or user not valid`);
                    return done(null, false)
                }
                if (!BCRYPT_VALIDATION.isValidPassword(user, password)) {
                    console.log(`Password or user not valid`);
                    return done(null, false)
                }
                return done(null, user)
            })

            const newUser = {
                email: req.body.email,
                password: BCRYPT_VALIDATION.hashPassword(password)
            }

            UserDao.save(newUser, (error, newUser) => {
                if (error) {
                    console.log(`We have a problem, we can't save newUser - ERROR ${error}`);
                    return done(null, false)
                }

                console.log(`New user registered succesful - USER: ${newUser}`);
                return done(null, true)
            })

        } catch (error) {
            console.log(`error from middlewares/passportAuth - LocalStrategy`)
            done(error)
        }
    }))

    passport.use('github', new GithubStrategy({
        clientID: config.PASSPORT.GITHUB.GITHUB_CLIENT_ID,
        clientSecret: config.PASSPORT.GITHUB.GITHUB_CLIENT_SECRET,
        callbackURL: config.PASSPORT.GITHUB.GITHUB_CLIENT_CALLBACK_URL,
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // fs.writeFileSync('./data.json', JSON.stringify(profile, null, 3))

            const githubEmail = profile.emails?.[0].value

            if (!githubEmail) return done(null, false)

            const user = await UserDao.getOne({ email: githubEmail })

            if (user) {
                const userResponse = {
                    id: user._id,
                    email: user.email,
                    cart: user.cart
                }

                return done(null, userResponse)
            }

            const newUser = {
                email: githubEmail,
                name: profile._json.name,
                lastname: "--",

            }

            const createUser = await UserDao.save(newUser)

            const userResponse = {
                id: createUser._id,
                email: createUser.email,
                cart: createUser.cart
            }

            done(null, userResponse)

        } catch (error) {
            console.log(`error from middlewares/passportAuth - GithubStrategy`)
            done(error)
        }

    }
    ))
}

export const PassportAuth = {
    init,
}