## AWS에 서버를 실제로 배포해보기

1. AWS EC2 (Elastic Beanstalk)
2. 리눅스에 NodeJS 세팅
3. AWS Route53 
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

