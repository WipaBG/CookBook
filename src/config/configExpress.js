const { session } = require("../middlewares/session");

const cookieParser = require("cookie-parser");
const express = require('express');

const secret = 'cookie secret'

function configExpress(app){
    app.use(cookieParser(secret));
    app.use(session())

    app.use('/styles', express.static('styles'));
    app.use(express.urlencoded({extended:true}))


}
module.exports = {
    configExpress,
}