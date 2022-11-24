const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./routeHandler/todHandler');

// express app initialization
const app = express();
app.use (express.json());

// database connection
mongoose
    .connect('mongodb://localhost/todo', { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
     })
    .then(() => console.log('connection successful'))
    .catch(err => console.log(err))

// application route
app.use('/todo', todoHandler);

// default error handler
function errorHandler(err, req, res, next) {
    if(req.headerSent ) {
        return next(err);
    }
    res.status(500).json({error: err});
}



app.listen(3000, () => {
    console.log("app is listening at port 3000");
});