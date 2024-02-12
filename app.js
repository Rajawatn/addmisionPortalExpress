const express = require("express");
// console.log(express)
const app = express();
const port = 4000;
const web = require("./route/web");
const connectDb = require('./db/connectdb')

// connect flash and session//
const session = require('express-session')
const flash = require('connect-flash')
const cookieparser = require('cookie-parser')
const fileUpload = require('express-fileupload')

// for files//
// import { v2 as cloudinary } from 'cloudinary';



//file upload//
app.use(fileUpload({ useTempFiles: true }));

// token get//
app.use(cookieparser());


//connect db
connectDb()

//for designing purpose//
app.set("view engine", "ejs");


// html css link public//
app.use(express.static('public'))


// parse application/x-www-form-urlencoded  "to covert the data in object form"
app.use(express.urlencoded({ extended: false }))


//message//
app.use(session({
    secret: 'secret',
    cookie: { maxage: 6000 },
    resave: false,
    saveUninitialized: false,

}))

//flash msg//
app.use(flash());

//route load//
app.use("/", web);

app.listen(port, () => console.log("server is start local host:4000"));
