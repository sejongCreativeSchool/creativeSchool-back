## AWS에 서버를 실제로 배포해보기

1. AWS EC2 (Elastic Beanstalk)
2. 리눅스에 NodeJS 세팅
3. AWS Route53 를 통한 도메인 연결
4. AWS Dynamodb 
5. Docker

### 1. AWS EC2 (Elastic Beanstalk)

지금까지는 로컬 환경에서 테스트 해봤다면 이번에는 실제로 AWS에 배포해서 웹서버를 구축하여 로컬환경이 아니라 다른 기기에서도 서버를 확인 할 수 있도록 해봅시다.

![AWS](https://media.vlpt.us/post-images/jdm1219/5e15fb40-98cc-11e9-a4a8-6f520035a6ca/%EC%A3%BC%EC%84%9D-2019-06-27-200652.png)

아무거나 선택해도 상관없지만 결제할 의향이 없다면 프리티어 사용가능이 붙어있는것을 선택하는 것이 좋습니다.

Ubuntu 18.04 LTS를 선택해주도록합니다.

![AWS](https://media.vlpt.us/post-images/jdm1219/d6402870-98cc-11e9-a4a8-6f520035a6ca/%EC%A3%BC%EC%84%9D-2019-06-27-200725.png)

사이즈는 t2.micro 를 제외하고는 비용이 청구됩니다.
하지만 t2.micro는 nodeJS 서버 한개정도밖에 돌리지못합니다.

![아웃바운드](https://media.vlpt.us/post-images/jdm1219/6acbce90-98cd-11e9-8b22-59a6de8b1d90/%EC%A3%BC%EC%84%9D-2019-06-27-201041.png)

인바운드란? 서버 내부로 들어오는 모든 아이피, 패킷, 프로토콜등을 의미합니다. 서버 내부로 접속할 수 있는 아이디를 특정할 수 있고 서버에 요청 할 수 있는 요소들을 한정 할 수 있습니다.
그와 반대로 아웃바운드란, 서버에서 클라이언트로 내보내주는 모든 아이피, 패킷, 프로토콜, 정책등을 의미합니다. 요청값을 받을 수 있는 클라이언트 아이피 등을 한정할 수 있습니다.

현재는 개발단계이기 때문에 인바운드는 SSH 포트인 22번포트, 아웃바운드는 HTTP, HTTPS, 사용자 설정 TCP로 3000, 8080 번을 허용해주도록 합니다.

```0.0.0.0/0, ::/0``` 은 모든 아이피에 대해 허용한다는 의미입니다.

모든 설정을 마무리하면 [인스턴스 이름].pem 파일을 제공합니다. PEM 파일은 ssh로 서버로 접속할 때 필요한 키페어입니다.

서버를 실행하고 EC2 퍼블릭아이피를 확인하고 

PEM파일이 존재하는 위치에서 cmd 창을 실행시켜서 
```ssh -i "[PEM 파일 이름].pem" ubuntu@[퍼블릭 아이피]```
를 실행시켜줍니다.

```cmd
The authenticity of host 'xx.x.xxx.xxx (xx.x.xxx.xxx)' can't be established.

ECDSA key fingerprint is xxx.

Are you sure you want to continue connecting (yes/no)? yes

Warning: Permanently added 'xx.x.xxx.xxx' (ECDSA) to the list of known hosts.

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

Permissions 0644 for 'xxx.pem' are too open.

It is required that your private key files are NOT accessible by others.

This private key will be ignored.

bad permissions: ignore key: xxx.pem

Permission denied (publickey).
```

그대로 접속하려고 하면 위와같은 애러가 발생하게된다. PEM 파일에 너무 많은 권한이 부여되서 뜨는 오류인데
```chmod 400 xxx.pem``` 를 통해서 PEM 파일의 권한을 조정해주도록한다.

다시 접속을 시도하면 정상적으로 서버에 접속 할 수 있다.

### 2. 리눅스에 NodeJS 서버 세팅

처음 서버를 실행하게 되면 서버 세팅을 위해

```sudo apt-get install git```를 실행하여서 깃을 먼저 설치해줍니다.

깃 설치가 완료되면 NodeJS를 설치해야하는데 노드는 현재 수많은 버전이 나와있습니다. 프로젝트별로 요구하는 노드의 버전은 천차만별이고, 로컬저장소와 노드 버전이 맞지않으면
프로젝트 세팅에 어려움이 있을 수 있습니다.

그래서 노드 버전관리 시스템인 NVM을 이용해줍니다.
아래 명령어로 NVM을 설치해줍니다.

```cmd
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

이후에 bashrc를 통해서 업데이트 해줍니다.
```
source ~/.bashrc
```

아래명령어를 입력했을 때 버전이 출력되면 정상적으로 설치가 완료된 것 입니다.
```
nvm --version
> 0.33.1
```

NVM 설치가 완료되면 NodeJS를 설치해줍니다.

```
nvm install 12.14.1
```

npm과 node가 동시에 설치되었는지 확인해줍니다.

### 3. AWS Route53 를 통한 도메인 연결

위에서 테스트할때 접속했던 퍼블릭 호스트 IP는 인스턴스를 종료했다가 다시 시작하게 되면 변경된다. 이를 유동 IP라고 한다.
우리는 ```http://booreum.com```에 우리의 서버를 연결시킬 것이기 때문에 아이피가 계속 바뀌면 그때마다 연결해줘야하기 때문에 번거롭다.

그래서 우리는 고정 IP를 할당받아서 Route53에 연결해야한다.

여기서 __DNS(Domain Name System)__ 란?
도메인 이름을 네트워크 주소로 바꾸거나 그 반대의 변환을 수행할 수 있도록 하기 위한 시스템입니다. 즉, DNS 서비스는 도메인에 연결된 IP 주소를 알려줍니다.

우리는 www.naver.com에 접속하게 되면 아래와 같은 단계가 실행됩니다.

1. 도메인(naver.com)이 가지고 있는 네임서버에 접속
2. 네임서버에 접속한 도메인(naver.com)과 연결된 IP 정보를 확인
3. 네임서버에서 도메인(naver.com)과 연결된 IP를 전달
4. 네임서버에서 전달한 서버의 IP 주소로 접속
5. 서버의 IP로 연결된 브라우저에 서버의 내용을 출력

먼저 AWS Route53로 접속하여서 Create Host Zone 으로 영역을 생성해줍니다.

생성이후에 도메인을 구매한 홈페이지에 가서 Host Zone에 있는 네임서버를 복사해서 넣어줍니다.

![이미지](https://media.vlpt.us/post-images/minholee_93/a0ccfde0-1bde-11ea-ae9a-2fcf3a6c99dd/image.png)

네임 서버를 설정 한 후에는 다시 Route53으로 돌아와서 A레코드를 도메인으로 생성해준 뒤에 할당받은 정적 IP를 적어주면 정상적으로 연결이됩니다.

### 4. AWS Dynamodb

이번 프로젝트는 NoSQL인 MongoDB를 이용할 예정이지만 AWS에서 제공하는 대표적인 NoSQL인 Dynamodb도 알아보기로 했다.

![SQL](https://i.imgur.com/LpVilxZ.png)

NoSQL과 RDBMS의 가장 큰 차이점은 속성에 대한 자유도 이다. 하지만 모든 것이 속성이 자유로운 것이지 스키마가 자유로운 것이 아니므로 설계에있어서 주의해야한다.

[참고 자료 : (RDBMS와 NoSQL)](https://dzone.com/articles/sql-vs-nosql)

DynamoDB는 기본키가 존재하는 NoSQL이며, MongoDB에 비해서 key와 indexing 이 매우 중요합니다.

클러스터링, 백업정책, 성능상향, 다중리젼 등을 지원하며 AWS가 서포트 해주기때문에 장애를 해결 못할 확률이 희박합니다.

하지만 REST API를 구축하기 위해서 필수인 ORM을 지원하지않아서 쿼리코드를 관리하는 전략을 따로 생성해줘야합니다.

가장 큰 단점으로는 러닝커브가 너무 깊습니다.

### 5. Docker를 통해서 배포하기

이번 파트에서 가장 어려운 파트입니다. Docker 는 그 편의성에 반해서 사용해볼 상황이 나오지않으면 학습만으로는 어려운 점이 많습니다.

먼저 Docker란 컨테이너 기반의 오픈소스 가상화 플랫폼입니다.

 VMware나 VirtualBox는 가상 OS위에 올리는 것이지만 이는 OS를 자체적으로 가지고 있기 때문에 OS를 가상머신 이미지에 포함해야 하고, 배포이미지의 용량이 커지게 된다는 단점이 있습니다.
 
 이를 해결하기 위해서 Docker의 컨테이너는 프로세스를 격리시켜 동작시킵니다.

!(도커)[https://t1.daumcdn.net/cfile/tistory/025F133A51002AA21A]







