const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());
app.set('etag', false);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(bodyParser.json());



// if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
// }


// create connection to database
// const db = mysql.createPool({
//   host: "4ae.h.filess.io",
//   user: "db_supplyload",
//   password: "5477b9691bba43db2325cb866a9151039247a2ae",
//   database: "db_supplyload"
// });

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'db'
});

// connect to database
db.getConnection((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});
global.db = db;


require('./routes/login')(app);
require('./routes/order')(app);


const PORT = process.env.PORT || 5001;
app.listen(PORT);
