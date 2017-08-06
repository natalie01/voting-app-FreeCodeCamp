const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL,{useMongoClient:true});
let db = mongoose.connection;


// Check connection
db.once('open', function(){
console.log('Connected to MongoDB');
});
// Check for DB errors
db.on('error', function(err){
console.log(err);
});

// Init App

const app = express();

// Bring in Models

let Poll = require('./models/poll');

// Load View Engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
	secret: 'bloodfiredeath',
	resave: true,
	saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
	var namespace = param.split('.')
	, root = namespace.shift()
	, formParam = root;
	while(namespace.length) {
	formParam += '[' + namespace.shift() + ']';
	}
	return {
	param : formParam,
	msg : msg,
	value : value
	};
}
}));

// Passport Config

require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
next();
});

// Home Route
app.get('/', function(req, res){

Poll.find({}, function(err,polls){
	if(err){
	console.log(err);
	} else {
	res.render('index', {
	polls: polls,
    title:'All Polls'
	});
	}
	});
});

// Route Files
let polls = require('./routes/polls');
let users = require('./routes/users');

app.use('/polls', polls);
app.use('/users', users);

// Start Server
app.listen(3000, function(){
console.log('Server started on port 3000...');
});const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL,{useMongoClient:true});
let db = mongoose.connection;


// Check connection
db.once('open', function(){
console.log('Connected to MongoDB');
});
// Check for DB errors
db.on('error', function(err){
console.log(err);
});

// Init App

const app = express();

// Bring in Models

let Poll = require('./models/poll');

// Load View Engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
	secret: 'bloodfiredeath',
	resave: true,
	saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
	var namespace = param.split('.')
	, root = namespace.shift()
	, formParam = root;
	while(namespace.length) {
	formParam += '[' + namespace.shift() + ']';
	}
	return {
	param : formParam,
	msg : msg,
	value : value
	};
}
}));

// Passport Config

require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
next();
});

// Home Route
app.get('/', function(req, res){

Poll.find({}, function(err,polls){
	if(err){
	console.log(err);
	} else {
	res.render('index', {
	polls: polls,
    title:'All Polls'
	});
	}
	});
});

// Route Files
let polls = require('./routes/polls');
let users = require('./routes/users');

app.use('/polls', polls);
app.use('/users', users);

// Start Server
app.listen(3000, function(){
console.log('Server started on port 3000...');
});
