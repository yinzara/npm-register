const {OAuth2Client} = require('google-auth-library');
const config = require('../config')

const googleConfig = {
  clientId: config.auth.oauth.clientID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: '<GOOGLE_CLIENT_SECRET>', // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: 'https://your-website.com/google-auth' // this must match your google api settings
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}




const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const passport = require('passport')

function initializePassport (passport) {
  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((user, done) => {
    done(null, user)
  })
  passport.use(new GoogleStrategy({
    clientID: config.auth.oauth.clientID,
    clientSecret: config.auth.oauth.clientSecret,
    callbackURL: config.auth.oauth.callbackURL
  }, (token, refreshToken, profile, done) => {
    return done(null, {
      profile: profile,
      token: token
    })
  }))
}

initializePassport(passport)

class Auth {
  async authenticate (user) {
    return passport.authenticate('google', {}, (err, resp) => {
      if (err) {
        throw err
      }

      return resp
    })
  }

  async findByToken (token) {
    passport.
  }
}

module.exports = Auth
