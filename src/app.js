const compression = require("compression");
const expess = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = expess();
require("dotenv").config;

// init middlewares
app.use(morgan("dev"));
// morgan("combined")
// morgan("common")
// morgan("short")
// morgan("tiny")
app.use(helmet());
app.use(compression());
app.use(expess.json());
app.use(
  expess.urlencoded({
    extended: true,
  })
);

// init db

require("./dbs/init.mongodb");
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()
// init routers
app.use("/", require("./routes"));

// app.get('/', (req, res, next) =>{
//     const strCompress = "Hello word"
//     return res.status(200).json({
//         message: 'Welcome',
//         // metadata: strCompress.repeat(10000)
//     })
// })

// handling error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});


app.use((error, req, res, next) => {
    console.log('app.useapp.useapp.use',error.status, error)
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status:'error',
        code: statusCode,
        message: error.message || 'Internal Server'
    })
});

module.exports = app;
