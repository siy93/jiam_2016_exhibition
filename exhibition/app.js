//set up =======================================================================
var express          = require('express');
var app              = express();
var session          = require('express-session');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var logger	     = require('morgan');
var routes 	     = require('./routes/routes');
var path      	     = require('path');		

app.use(logger('dev'));
app.engine('html',require('ejs').renderFile);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//set up express application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(__dirname+ '/public'));

require('./routes/routes.js')(app);

app.use('/',routes);

app.use(function(req,res,next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if(app.get('env') === 'development'){
	app.use(function(err,req,res,next){
		res.status(err.status || 500);
		res.render('error',{
			message: err.massage,
			error: err
		});
	});
}

app.use(function(err,req,res,next){
	res.status(err.status||500);
	res.render('error',{
		message:err.message,
		error:{}
	});
});

module.exports = app;
