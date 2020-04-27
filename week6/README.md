## DB 도메인 정의와 SSL인증

1. DB 도메인 정의
2. SSL 인증
3. 프록시 서버 개발

### 1. DB 도메인 정의

|논리명|물리명|데이터형|설명|
|------|---|---|---|
회원아이디|		id|		String|		가입한 회원들의 고유아이디|		
비밀번호|		password|		String|		가입한 회원들의 비밀번호	|	
이름		|name		|String|		가입한 회원들의 이름		|
전화번호	|	phone|		String|		가입한 회원들의 전화번호		|
분류		|classify|		String|		Needer와 Helper를 구분	|	
채팅 리스트| 	chatList|		Array[ObjectID]	|	유저가 진행중인 채팅 목록|		
심부름 리스트|	errandList|		Array[ObjectID]	|	진행중인 심부름 목록		|
토큰		|access_token|		String|		소셜로그인 진행시 필요한 토큰		|
가입날짜	|	created_At|		Date	|	데이터 생성 시간 (한국 표준시)		|
수정 날짜	|	updated_At|		Date|		데이터 수정 시간 (한국 표준시)		|

### 2. SSL 인증

**SSL 인증서란?**

SSL 인증서는 클라이언트와 서버간의 통신을 제3자가 보증해주는 전자화된 문서임.

![img](https://media.vlpt.us/post-images/minholee_93/ef9b9790-22e8-11ea-b744-67a9c7414bce/image.png)

크롬 기준으로 SSL 인증이된 사이트는 HTTPS로 접속했을때 왼쪽 상단에 자물쇠 표시가 잠금 형태로 뜨며, 클릭시에 해당인증서를 볼 수 있음.

창의학기제 도메인의 인증서는 AWS Certificate Manager를 통해 발급받아 사용할 예정임.

![img](https://media.vlpt.us/post-images/minholee_93/d23cb660-22e9-11ea-9bff-35d4be1ea7da/image.png)

AWS Route53 Hostzone 으로 들어가서 해당도메인을 등록해서 EC2에서 할당받은 고정아이피와 도메인을 연결해줌

![img](https://media.vlpt.us/post-images/minholee_93/f6b98860-22e9-11ea-9bff-35d4be1ea7da/image.png)

등록후에 AWS Certificate Manage 에 접속하여 새 인증서를 발급받아 줍니다.

![img](https://media.vlpt.us/post-images/minholee_93/e902fc00-22ea-11ea-a931-9df1f37fabff/image.png)

이번에 사용할 서브도메인은 

```
https://api.booreum.com
```
```
https://admin.booreum.com
```
```
https://www.booreum.com
```

위의 3개의 도메인을 사용할 예정임

인증서를 발급받은 후에는 EC2에 로드벨런서를 적용해줍니다.

![ㅇㅇ](https://media.vlpt.us/post-images/minholee_93/c956f680-22eb-11ea-bb3b-d1369ba18e7b/image.png)

EC2 보안그룹은 아래와 같이 설정함

![ㅇㅇ](https://media.vlpt.us/post-images/minholee_93/e73153d0-22eb-11ea-bafc-0b37e51ff8fa/image.png)

![dd](https://media.vlpt.us/post-images/minholee_93/37946600-22ec-11ea-bb3b-d1369ba18e7b/image.png)

로드벨런서까지 완료하면 EC2 - ELB - Route53 + SSL 인증이 완료됩니다.

### 3. 프록시 서버 개발

이번 프로젝트는 Development 서버로 Node서버를 올리고 Ngnix 를 이용해서 프록시 서버 형태로 구축할 예정임.

![아](https://media.vlpt.us/post-images/jeff0720/91343f60-eb33-11e8-b115-5df0fc60ff3a/ngnix.png)

위 사진은 Ngnix의 원리를 설명한 내용임. 

Ngnix의 프록시 설정을 통해서 기존에 포트로 분리되어있는것을 서브도메인으로 분리가능함

기존에 HTTP를 이용한다면 사용자에게 보여지는 URI가 아니면 사실 포트로 통신해도 상관없지만

HTTPS로 변경했기때문에 포트를 이용한 URI 통신이 불가능함

그래서 웹서버를 이용해서 포트를 서브도메인으로 변경해주는 작업이 필요함

![ㅇ](https://media.vlpt.us/post-images/jeff0720/4ef034d0-eb31-11e8-bcd1-a3c7c763095c/-2018-11-18-7.02.32.png)

Nginx 를 처음 설치하면 나오는 화면임

![ㅇ](https://media.vlpt.us/post-images/jeff0720/3aeea290-eb32-11e8-b115-5df0fc60ff3a/-2018-11-18-8.58.05.png)

위와 같은 방식으로 80번포트로 오는 요청을 proxy_pass를 통해서 넘겨줄 수 있음.











