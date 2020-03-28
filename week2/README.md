## NodeJS 의 설계방법과 크롤러

1. 3계층 설계방식
2. Service 계층
3. 의존성 주입 (Dependency Injection)
4. 설정 및 시크릿 파일 (Configurations and secrets)
5. 라우트 자동분리
6. 크롤러 개발

### 1. 3계층 설계방식

관심사 분리 원칙(principle of separation of concerns)를 적용하기 위해 비지니스 로직을 node.js의 API Routes와 분리해줍니다.

![3계층설계](https://media.vlpt.us/post-images/hopsprings2/5779d780-3c04-11ea-9a23-b1d44635859c/serverlayers.jpg)

비즈니스 로직을 controller에 바로 넣었을 때 일어나는 현상

```typescript
route.post('/', async (req, res, next) => {

  // UserDTO를 검증하는 로직
  const userDTO = req.body;
  const isUserValid = validators.user(userDTO)
  if(!isUserValid) {
    return res.status(400).end();
  }

  // 수많은 비즈니스 로직들...
  const userRecord = await UserModel.create(userDTO);
  delete userRecord.password;
  delete userRecord.salt;
  const companyRecord = await CompanyModel.create(userRecord);
  const companyDashboard = await CompanyDashboard.create(userRecord, companyRecord);
  
  // 최적화 실패의 전형적인 예시
  // 클라이언트에게 데이터를 전송
  res.json({ user: userRecord, company: companyRecord });

  // 전송 후에도 코드가 지속됨
  const salaryRecord = await SalaryModel.create(userRecord, companyRecord);
  eventTracker.track('user_signup',userRecord,companyRecord,salaryRecord);
  intercom.createUser(userRecord);
  gaAnalytics.event('user_signup',userRecord);
  await EmailService.startSignupSequence(userRecord)
});
```

### 2. Service 계층 도입

Service 계층이란 SOLID 원칙을 node.js에 적용한 것입니다.
이는 분명한 목적이 있는 클래스들의 집합이며 이 레이어에서는 DB에 직접 접근하는 코드가 존재하면 안됩니다.

아래 코드는 서비스 로직을 Route에서 분리한 예제입니다.

```typescript
route.post('/', 
  validators.userSignup, // this middleware take care of validation
  async (req, res, next) => {
    // The actual responsability of the route layer.
    const userDTO = req.body;

    // Call to service layer.
    // Abstraction on how to access the data layer and the business logic.
    const { user, company } = await UserService.Signup(userDTO);

    // Return a response to client.
    return res.json({ user, company });
  });
```

```typescript
import UserModel from '../models/user';
import CompanyModel from '../models/company';

export default class UserService() {

  async Signup(user) {
    const userRecord = await UserModel.create(user);
    const companyRecord = await CompanyModel.create(userRecord); // needs userRecord to have the database id 
    const salaryRecord = await SalaryModel.create(userRecord, companyRecord); // depends on user and company to be created
    
    ...whatever
    
    await EmailService.startSignupSequence(userRecord)

    ...do more stuff

    return { user: userRecord, company: companyRecord };
  }
}
```

사실 간단한 CRUD 에서는 Service 계층 도입의 필요성을 잘 못느낄 수 도있는데,
위의 예시와 같이 회원가입과 동시에 이메일 전송이라던지, 카톡알림을 보내는 부가기능이 있다면 이를 router 에서 처리하는것은 매우 번거롭습니다.

### 3.의존성 주입

의존성 주입(D.I), 또는 제어 역전(IoC)은 코드를 구조화하는데 많이 사용하는 패턴인데요, 생성자를 통해 클래스와 함수의 의존성을 전달해주는 방식입니다.
이를 통해 ‘호환 가능한 의존성(compatible dependency)'을 주입함으로써 유연하게 코드를 유지할 수 있습니다. 이는 service에 대한 유닛 테스트를 작성하거나, 
다른 context에서 코드를 사용할 때 도움이 됩니다.

아래는 의존성 주입없이 Service 코드를 작성한 것 입니다.

```typescript
import UserModel from '../models/user';
import CompanyModel from '../models/company';
import SalaryModel from '../models/salary';  
class UserService {
  constructor(){}
  Sigup(){
    // Caling UserMode, CompanyModel, etc
    ...
  }
}
```
예를들어 기존의 코드로 DB를 다루는 로직이 안정적으로 작동하는지 테스트하려면 실제로 디비에 값을 넣어봐야하지만 
의존성 주입을 이용한다면 실제로 데이터베이스에 영향을 끼치지 않고 안전하게 테스트를 진행할 수 있습니다. 
이와같은 상황은 개발단계에서는 잘 와닿지않을지 모르지만 실제로 서비스하고 있는 로직의 DB를 다룰때는 유용하게 작용합니다.

```typescript
 export default class UserService {
  constructor(userModel, companyModel, salaryModel){
    this.userModel = userModel;
    this.companyModel = companyModel;
    this.salaryModel = salaryModel;
  }
  getMyUser(userId){
    // models available throug 'this'
    const user = this.userModel.findById(userId);
    return user;
  }
}
```
```typescript
import UserService from '../services/user';
import UserModel from '../models/user';
import CompanyModel from '../models/company';
const salaryModelMock = {
  calculateNetSalary(){
    return 42;
  }
}
const userServiceInstance = new UserService(userModel, companyModel, salaryModelMock);
const user = await userServiceInstance.getMyUser('12346');
```
### 4. 설정 및 시크릿 파일

 node.js에서 API Key와 데이터베이스 연결과 관련된 설정들을 저장하는 가장 좋은 방법은 dotenv를 사용하는 것입니다.
 
 만약 .env을 그대로 git에 commit한다면  API key가 노출되어 서비스에 치명적인 보안 약점이 됩니다.
 dotenv를 사용하면 PROCESS.env 에 접근하여 설정값을 안전하게 받아올 수 있습니다. 이에 추가적으로
 "/config/var.ts" 를 생성하여 env 정보를 저장하면 **코드 구조화**가 가능해지고 **자동완성**이 가능합니다.
 
 ```typescript
 import path from "path";

require("dotenv-safe").config({
  allowEmptyValues: true,
  path: path.join(__dirname, "../../.env"),
  sample: path.join(__dirname, "../../.env.example")
});

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  secret : 'SeCrEtKeYfOrHaShInG',
  import : {
    api : process.env.IMPORT_KEY,
    secret : process.env.IMPORT_SECRET
  },
  mongo: {
    uri:
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI
  }
 }
 ```
 
 ### 5.라우트 자동 분리
 
 보통 api/routes 파일을 넣고 router.use 로 하나하나 가져와야하는데 아래의 코드를 index.ts 에 작성하면 파일이름으로 자동 라우트를 진행한다.
 
 ```typescript
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const indexJs = path.basename(__filename);

router.get("/status", (req, res) => res.send("OK!"));
// console.log(fs.readdirSync(__dirname), indexJs);

fs.readdirSync(__dirname)
  .filter(file => file.indexOf(".") !== 0 && file !== indexJs && file.slice(-3) === ".js")
  .forEach(routeFile => {
      router.use(`/${routeFile.split(".")[0]}`, require(`./${routeFile}`).default)
});

export default router;
 ```
 
 ### 6. Pupeteer 와 Cheerio 를 이용한 크롤러 개발
 
  Pupeteer 와 Cheerio 는 NodeJS에서 이용할 수 있는 크롤러지만 큰 차이점이 있다.
  
  Pupeteer는 Headless 브라우저를 이용해서 브라우저로 접근해서 정보를 받아오지만
  Cheerio는 사이트의 태그를 바탕으로 정보를 긁어온다.
  
  이러한 특성때문에 Cheerio는 가볍지만 정적인 사이트만 접근할 수 있고
  Pupeteer는 무겁지만 동적인 사이트도 얼마든지 크롤링 가능하다.
  
  cheerio 를 이용해서 네이버 실시간 검색어 긁어오는 코드
  ```typescript
  import { load } from 'cheerio';

  export const extract = (html: string) => {
    if (html === '') return [];
    const $ = load(html);
    const crawledRealtimeKeywords = $(
      '.ah_roll_area.PM_CL_realtimeKeyword_rolling ul > li span.ah_k',
    );
    const keywords: string[] = $(crawledRealtimeKeywords)
      .map(
        (i, ele): string => {
          return $(ele).text();
        },
      )
      .get();
    return keywords;
  };
  ```
  pupeteer 를 이용해서 에브리타임에 접근해 로그인 후 시간표를 받아오는 코드
  ```typescript
  import puppeteer from 'puppeteer';

  export const extract = (async (userid : string, userpw : string) => {
      const browser = await puppeteer.launch({
          headless : false
      });
      const page = await browser.newPage();
      const blockResource = [
      ];
      await page.setRequestInterception(true);

      page.on('request', req => {
          // 리소스 유형
          const resource = req.resourceType(); 
          if (blockResource.indexOf(resource) !== -1) {
            req.abort();  // 리소스 막기
          } else {
            req.continue(); // 리소스 허용하기
          }
      });

      await page.goto('https://everytime.kr/login');

      await page.evaluate((id, pw) => {
          (<HTMLInputElement>document.querySelector('input[name="userid"]')).value = id;
          (<HTMLInputElement>document.querySelector('input[name="password"]')).value = pw;
      }, userid, userpw);

      await page.click('input[type="submit"]');


      await page.waitFor(500);

      await page.goto('https://everytime.kr/timetable/2019/2');
      await page.waitFor(500);

      const  positions = await page.evaluate(()=>{
          return Array.from(document.querySelectorAll('.subject span'), x => x.innerHTML)
      });
      const subjects = await page.evaluate(()=>{
          return Array.from(document.querySelectorAll('.subject h3'), x => x.innerHTML)
      });
      const data = [ subjects, positions]
      return data;
  });
  ```
 
 
