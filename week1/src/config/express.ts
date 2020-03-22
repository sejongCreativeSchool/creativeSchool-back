import express from "express";
import bodyParser from "body-parser";
import config from "./vars";
import routes from "../api/routes";
import logger from 'morgan';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('ERROR!');
  
  // render the error page
  res.status(err.status || 500);
});

app.use("/v1", routes);

export default app;
