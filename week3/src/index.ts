import createError from 'http-errors';
import express from 'express';
import * as mongoose from "./config/mongoose";
import app from './config/express';
import config from "./config/vars";
import bodyParser  from 'body-parser';

mongoose.connect();

console.log("PROCESS.ENV.PORT : ", config.port);

app.listen(config.port || 3000, async () => {
  console.log('server on!')
});

module.exports = app;
