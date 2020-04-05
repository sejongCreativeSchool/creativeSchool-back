import express from "express";
import bodyParser from "body-parser";
import config from "./vars";
import routes from "../api/routes";
import logger from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose'
import * as error from "./error";
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import '../passport/kakao-login'
import '../passport/local-signin';
import '../passport/local-signup';
import '../passport/naver-login';

var flash = require('connect-flash');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("trust proxy", 1);
// view engine setup

app.set('jwt-secret', config.secret);

app.use(
  session({
    secret: "asadlfkj!@#!@#dfgasdg",
    resave: false,
    saveUninitialized: false,
    store : require('mongoose-session')(mongoose),
    cookie: {
      domain : '.tngobooks.com',
      secure : false,
      maxAge: 86400 * 1000 // 24 hours in milliseconds
    }
  })
);

const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:8080', 'http://www.tngobooks.com:8080', 'http://www.tngobooks.com:3001', 'http://www.tngobooks.com', 'http://tngobooks.com'],
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(express.static("public"));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    console.log('시리얼라이즈! : ', user);
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    console.log('deserializeUser');
    done(null, user);
});

app.use("/v1", routes);

app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

export default app;
