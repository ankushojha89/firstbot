//config files
const {config,connect} = require('./config/serverconfig');

const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const exphbs=require('express-handlebars');

// Project root
process.env.PROJECT_ROOT=__dirname;

// routes file
var web=require('./routes/index');
var admin=require('./routes/admin');
var bot=require('./routes/botapi');

const app = express();

app.set('port', process.env.PORT||config.server.port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

  // public folder
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.use('/', web);
app.use('/admin', admin);
app.use('/botapi', bot);



// Connect to Mongo on start
connect(function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    // start web server
app.listen(app.get('port'),()=>{
  console.log(`Server start listening at port ${app.get('port')}`);
});



  }
})

// app.listen(app.get('port'), function () {
//   console.log(`App listening on port ${app.get('port')}!`);
// });
