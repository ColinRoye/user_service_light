const debug = require("./src/debug");
const env = require("./src/env");
require('./src/schema.js');

const express = require('express')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
var cors = require('cors');
var mongoose = require('mongoose');

let mongoUrl = env.mongoUrl;


mongoose.connect( mongoUrl,
    { useNewUrlParser: true });
     mongoose.set('debug', true);


const app = express()
const args = process.argv;
var port = 3000




//optional port setting
if(args.includes("-p")){
     port = args[args.indexOf("-p")+1];
}

app.use(bodyParser());


app.use(cookieParser());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// require('./src/schema');
app.use(require('./src/routes'));




app.listen(port, () => console.log(`Example app listening on port ${port}!`))
