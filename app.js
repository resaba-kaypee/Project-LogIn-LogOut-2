const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 5000;

// DB config
const db = require('./config/keys').mongoURI;

// passport config
require('./config/passport')(passport);

// connect to db
mongoose.connect(db, {useNewUrlParser: true})
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// bodyparser
app.use(express.urlencoded({ extended:false }));

// session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash
app.use(flash());

// set global var
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// routes
app.use('/', require('./controllers/routes'))
app.use('/users', require('./controllers/users'))
app.use(express.static('./public'));

app.listen(PORT, ()=>{
console.log('Server started listening on port: ' + PORT);
})

