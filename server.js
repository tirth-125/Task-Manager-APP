const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

// env path
dotenv.config({path : './config.env'});

// Mongoose connection
mongoose.connect(process.env.CONN_STR, { useNewUrlParser: true }).then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.log("Something went wrong", err);
})



// server listening
app.listen(process.env.PORT, (req, res) => {
    console.log(`Server listen on ${process.env.PORT}`);
});