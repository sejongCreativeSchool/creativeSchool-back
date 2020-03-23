# creativeSchool-back

## 1.NodeJS 란 무엇인가?

1. NodeJS의 개념
2. Express 프레임워크
3. 라우터와 미들웨어
4. MongDB 와 Mongoose를 이용한 CRUD

### 1. NodeJS의 개념
NodeJS 는 자바스크립트 런타임이다.
쉽게 말해서 자바스크립트를 컴파일할 수 있는 환경을 제공하며 백앤드 프로그래밍을 하기에 편하다.

Node JS 자체 모듈인 http를  통해서 아래와 같이 간단한 서버를 제작할 수 있다.
```typescript
import http from 'http';

http.createServer((req, res) => {
   res.writeHead(200, {'Content-Type': 'text/plain'});
   res.end("Hello World\n");
}).listen(3000); // 3000번 포트로 실행하게 된다.
```

### 2. Express 프레임워크
하지만 자체모듈을 사용하기에는 여러가지 제약이 많은 http 모듈과는 달리  Express 라는 웹 프레임워크를 사용하면 좀더 여러가지 기능들을

구현할 수 있다.

아래와같이 좀더 간편한 제작이 가능해진다.

```typescript
import express from "express";

const app = express();

app.listen(3000, async () => {
  console.log('server on!')
});
```
기본적으로 express를 활용하여 간단한 라우팅 구현이 가능하다.

아래 코드는 루트 uri로 접근했을때 Hello World! 를 반환하는 예제이다.
```typescript
...
app.get('/', async(req, res) => {
  res.send('Hello World!');
});
```

### 3. Express의 미들웨어와 라우터
또한 express는 미들웨어라는 강력한 기능을 가지고있는데
아래의 코드를 실행하게되면 콘솔에 차례대로 

> middleWare!

> Hello World! 

이렇게 찍히게 된다.

next 함수는 다음으로 넘겨주는 역할을 한다.

```typescript

import express, { Request, Response } from 'express'
const app = express();

const middleWare = function (req : Request, res : Response, next : any) {
  console.log('middleWare!');
  next();
};

app.use(middleWare);

app.get('/', function (req : Request, res : Response) {
  res.send('Hello World!');
});

app.listen(3000);
```
express.Router 를 이용하면 모듈식 라우팅도 가능하다.

```typescript
// server.js

import post from './post';

...
app.use('/post', post);
// post.js
import express from 'express';
const router = express.Router();

router.get('/', async(req, res, next) => {
   conlose.log("router!");
});

export default router;
```
### 4. MongDB 와 Mongoose를 이용한 CRUD

Mongoose란 MongoDB 와 NodeJS 를 연결해주는 MongoDB의 ODM이다.

아래와 같이 연결을 해준다.

```typescript
import mongoose from "mongoose";

mongoose.connect('mongo.uri', { keepAlive: true });
```

원래 MongoDB는 Nosql 이라서 스키마와 RDB를 지원하지않지만 Mongoose를 활용하면 스키마와 릴레이션을 활용할 수 있다.

```typescript
// Model/Post.ts
import mongoose, { Schema } from "mongoose";

export interface PostModel extends mongoose.Document {
  title: string;
  content : string;
}

const PostSchema: Schema<PostModel> = new Schema({
    title: String,
    content: String,
}, { timestamps: true } );

export default  mongoose.model('user', PostSchema);
```

timestamps는 자동으로 createAt 과 updateAt 을 생성해준다.
또한 스키마에 메소드를 추가할 수 있다. 

스키마를 작성했으면 라우트에서 불러와서 사용해 주도록하자. 

작성된 스키마로 CRUD를 구현해보도록 하자.

CRUD는 Create, Read, Update, Delete의 약자로 웹의 가장 기본적인 기능이다.

```typescript
// api/routes/post.ts

import express from "express";
import Post from "../../models/Post";

const router = express.Router();

// 추가기능
router.post('/', async(req, res, next)=>{
    try{
        const post = await new Post(req.body).save();
        res.send({status:200, data:post});
    }catch( error ){ 
        next(error);
    }
});

// 전체 불러오기
router.get('/', async(req,res, next) =>{

    try{ 
      const posts = await Post.find({});
      res.send({status:200, data:posts})
    }
    catch(error){
        next(error);
    }
});

// 특정한 다큐먼트 불러오기
router.get('/:id', async(req,res, next) =>{
    try{
        await Post.findOne({_id: req.params.id}, (err, post) => {
            if (err) {
                return res.status(500).json({error: err});
            }
            if ( !post ) {
                return res.status(404).json({error: 'post not found!'});
            }
            res.send({success : true, data : post});
        });
        
    }catch(error){
        next(error);
    }
});

// 특정한 다큐먼트 수정하기
router.put('/:id', async(req, res, next) =>{
    try{
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id },
            { $set : req.body}
        );
        res.send({ success: true, data: post });
    }catch(error){
        next(error);
    }
})

// 특정한 다큐먼트 지우기
router.delete('/:id', async(req, res, next) => {
    try{
        await Post.findOneAndRemove({ _id: req.params.id });
        res.send({ success: true, data: "okay" });
    }catch(error){
        next(error);
    }
});

export default router;
```
