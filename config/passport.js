var LocalStrategy =  require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');

//var configAuth =  require('../config/auth');

var bcrypt = require('bcryptjs');

var facebookAuthclientID = process.env.facebookAuthclientID;
var facebookAuthclientSecret = process.env.facebookAuthclientSecret;
var facebookAuthcallbackURL = process.env.facebookAuthcallbackURL;

var twitterAuthconsumerKey=process.env.twitterAuthconsumerKey;
var twitterAuthconsumerSecret=process.env.twitterAuthconsumerSecret;
var twitterAuthcallbackUrl=process.env.twitterAuthcallbackUrl;

module.exports =  function(passport){
	// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
  },
  function(username, password, done) {

    User.findOne({ 'local.name': username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
	 console.log('no user found');
        return done(null, false, { message: 'No user found.' });
      }
     bcrypt.compare(password, user.local.password, function(err, isMatch){

	if(err) throw err;
	if(isMatch){
	return done(null, user);
	} else {
	return done(null, false, {message: 'Wrong password'});
	}
	});
    });
  }
));



//facebook ----------------------------------------------------------------------------
passport.use(new FacebookStrategy({  
    clientID: facebookAuthclientID,
    clientSecret: facebookAuthclientSecret,
    callbackURL: facebookAuthcallbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'facebook.id': profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

//twitter
passport.use(new TwitterStrategy({  
    consumerKey: twitterAuthconsumerKey,
    consumerSecret: twitterAuthconsumerSecret,
    callbackURL: twitterAuthcallbackUrl,
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'twitter.id': profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.twitter.id          = profile.id;
          newUser.twitter.token       = token;
          newUser.twitter.username    = profile.username;
          newUser.twitter.displayName = profile.displayName;
          newUser.save(function(err) {
            if (err)
             throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

	passport.serializeUser(function(user, done) {
	done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
	done(err, user);
	});
	});

}

var LocalStrategy =  require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');

//var configAuth =  require('../config/auth');

var bcrypt = require('bcryptjs');

var facebookAuthclientID = process.env.facebookAuthclientID;
var facebookAuthclientSecret = process.env.facebookAuthclientSecret;
var facebookAuthcallbackURL = process.env.facebookAuthcallbackURL;

var twitterAuthconsumerKey=process.env.twitterAuthconsumerKey;
var twitterAuthconsumerSecret=process.env.twitterAuthconsumerSecret;
var twitterAuthcallbackUrl=process.env.twitterAuthcallbackUrl;

module.exports =  function(passport){
	// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password'
  },
  function(username, password, done) {

    User.findOne({ 'local.name': username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
	 console.log('no user found');
        return done(null, false, { message: 'No user found.' });
      }
     bcrypt.compare(password, user.local.password, function(err, isMatch){

	if(err) throw err;
	if(isMatch){
	return done(null, user);
	} else {
	return done(null, false, {message: 'Wrong password'});
	}
	});
    });
  }
));



//facebook ----------------------------------------------------------------------------
passport.use(new FacebookStrategy({  
    clientID: facebookAuthclientID,
    clientSecret: facebookAuthclientSecret,
    callbackURL: facebookAuthcallbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'facebook.id': profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = token;
          newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

//twitter
passport.use(new TwitterStrategy({  
    consumerKey: twitterAuthconsumerKey,
    consumerSecret: twitterAuthconsumerSecret,
    callbackURL: twitterAuthcallbackUrl,
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'twitter.id': profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.twitter.id          = profile.id;
          newUser.twitter.token       = token;
          newUser.twitter.username    = profile.username;
          newUser.twitter.displayName = profile.displayName;
          newUser.save(function(err) {
            if (err)
             throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

	passport.serializeUser(function(user, done) {
	done(null, user.id);
	});
	passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
	done(err, user);
	});
	});

}


