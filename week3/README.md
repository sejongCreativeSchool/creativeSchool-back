## 책관리 서버 개발하기

1. 데이터 베이스 모델 작성
2. express config 세팅
3. api 파일 작성
4. passport를 이용한 소셜로그인 연동

### 실제로 개발한 서버

>[Live demo](https://tngobooks.com:3000/)

### 1. 데이터 베이스 모델 작성

데이터 베이스는 Mongoose를 사용하기로함.
Book, Publisher, User, History, Payment 등 많은 모델파일들이 있지만 대표적으로 하나만 설명하기로 함

```ts
// model/book.ts

export interface BookModel extends mongoose.Document {
    name : string;
    hash : string;
    active : boolean;
    codes : [{
        code : string;
        url : string;
        active : boolean;
        price : number;
        type : String;
        desc : String;
    }];
    user: [UserModel]
    historys : [HistoryModel],
    publisher : [PublisherModel]
}

const BookSchema: Schema<BookModel> = new Schema({
    name : { type: String, required : true },
    hash : { type: String },
    active : { type : Boolean, default : true},
    user : [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required : true }],
    historys : [{ type: mongoose.Schema.Types.ObjectId, ref: 'history'}],
    publisher : { type: mongoose.Schema.Types.ObjectId, ref: 'publisher'},
    codes : [{
        code : { type: String },
        url : { type: String },
        active : { type : Boolean, default : true },
        price : {type : Number, default : 0},
        desc : {type : String},
        type : {type : String},
    }]
},{ timestamps: true } );
```

mongoose.Document 를 상속받은 BookModel interface파일을 정의한 뒤 
BookSchema의 타입으로 지정해줍니다. 스키마의 타입을 지정해줌.

MongoDB는 NoSQL 데이터베이스 이기때문에 SQL처럼 join 기능이 없음 관계형 디비를 구현하기 힘듦. 그래서 Mongoose의 populate기능을 이용해 주어야함.

```ts
[{ type: mongoose.Schema.Types.ObjectId, ref: 'history'}]
```
이런식으로 정의해주고 모델에서 불러올때 .populate('history') 를 해주면 history를 참조해서 그 모델의 디비까지 한꺼번에 불러올 수 있음

### 2. express config 세팅

express router 부분의 애러를 try catch로 잡기때문에 라우트 마다 일일히 애러처리를 해주는 것은 매우 비효율적임
그래서 미들웨어의 특성을 이용하여 next(); 로 넘긴 뒤 뒤에서 한꺼번에 처리해주는 애러 처리 코드를 작성함

```ts

// config/error.ts
import config from "./vars";
import httpStatus from "http-status";

class ExtendableError extends Error {
    private errors: any;
    private status: any;
    private isPublic: boolean;
    private isOperational: boolean;
  
    constructor({ message, errors, status, isPublic, stack }) {
      super(message);
      this.name = this.constructor.name;
      this.message = message;
      this.errors = errors;
      this.status = status;
      this.isPublic = isPublic;
      this.isOperational = true;
      this.stack = stack;
      // Error.captureStackTrace(this, this.constructor.name);
    }
}
export class APIError extends ExtendableError {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */
    constructor({ message, errors = undefined, stack = undefined, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false }) {
      super({
        message,
        errors,
        status,
        isPublic,
        stack
      });
    }
}

export const converter = (err, req , res , next ) => {
    let convertedError = err;
  
    if (!(err instanceof APIError)) {
      convertedError = new APIError({
        message: err.message,
        status: err.status,
        stack: err.stack
      });
    }
  
    return handler(convertedError, req, res);
  };
  
export const handler = (err, req, res, next?: () => void) => {
    console.log(err);
    const response = {
      code: err.status,
      message: err.message || httpStatus[err.status],
      errors: err.errors,
      stack: err.stack
    };
  
    if (config.env !== "development") {
      delete response.stack;
    }
  
    res.status(err.status);
    res.json(response);
};

export const notFound = (req, res, next) => {
    const err = new APIError({
      message: "Not found",
      status: httpStatus.NOT_FOUND
    });
    return handler(err, req, res);
};
```
코드를 작성한 뒤 use route 하는 부분 뒤에 차례로 작성해줌

```ts
app.use("/v1", routes);

app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);
```

### 3. api 파일 작성

이번에도 많은 api 파일이 있기때문에 대표적으로 book.ts 파일만 소개

```ts
import express from "express";
import Book from "../../models/Book";

router.get('/', async(req,res, next) =>{
   
    try{ 
      const books = await Book.find({});
      res.send({status:200, data:books})
    }
    catch(error){
        next(error);
    }
});
```
위에 코드는 book 다큐먼트에 담긴 모든 데이터를 불러오는 코드 파일 이름으로 라우팅 했기때문에
book/ 을 호출 했을 시 실행됨

```ts
router.get('/:hash', async(req,res, next) =>{
    try{
        const book = await Book.findOne({hash: req.params.hash}
        res.send({success : true, data : book});
    }catch(error){
        next(error);
    }
});
```
위 코드는 /:hash 로 호출 했을때 해당 hash 를 가지는 데이터 하나를 선별해서 출력해주는 코드임

참고로 ```?name=john``` 이 query이고 ```/john``` 이 params

### 4. passport를 이용한 소셜로그인 연동

passport 란?
passport 는 인증 절차를 로직을 편하게 작업할 수 있게 도와주는 Node.js 미들웨어임

좀더 자세한 사항은 http://www.passportjs.org/docs/downloads/html/

passport를 자유자재로 사용하려면 Strategy를 알아야함

Strategy란 passport의 인증방식으로 다양한 소셜로그인을 passport로 처리할 수 있도록 도와준다

```ts
const kakaoKey = {
    clientID: "***",
    clientSecret: "***",
    callbackURL: `${config.server.uri}/v1/auth/kakao/callback`
};  
passport.use(
    "kakao-login",
    new KakaoStrategy(kakaoKey, async(accessToken, refreshToken, profile, done) => {
      
      const data = {
        user_id : profile.id,
        username : profile.username
      }
      let user = await User.findOne({user_id : data.user_id});
      if ( !user ){
        try{
          console.log('New User!');
          let newUser = new User(data) as UserModel;
          newUser.hash = await getHashCode('user')
          await newUser.save();
          return done(null, newUser)
        }catch(e){
          return done('error!')
        }
      }
      else {
        console.log('Old User!');
      }
      return done(null, user)
    })
);
  
```
위 코드는 kakako-passport 의 Strategy를 이용해서 회원가입을 받고 이미 데이터베이스에 저장된 정보라면 자동으로 로그인을 시켜주는 코드이다.









