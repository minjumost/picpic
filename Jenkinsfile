pipeline {
  environment {
    registryCredential = "docker"
  }

  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins-build: app-build
spec:
  containers:
    - name: gradle
      image: gradle:8.5-jdk17
      command: ["cat"]
      tty: true
    - name: kaniko
      image: gcr.io/kaniko-project/executor:v1.5.1-debug
      imagePullPolicy: IfNotPresent
      command: ["/busybox/cat"]
      tty: true
      volumeMounts:
        - name: jenkins-docker-cfg
          mountPath: /kaniko/.docker
  volumes:
    - name: jenkins-docker-cfg
      projected:
        sources:
          - secret:
              name: docker-credentials
              items:
                - key: .dockerconfigjson
                  path: config.json
"""
    }
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Inject Environment Files') {
      steps {
        container('gradle') {
          withCredentials([
            file(credentialsId: '.env', variable: 'ENV_FILE'),
            file(credentialsId: 'application-yml', variable: 'APP_YML'),
            file(credentialsId: 'application-test-yml', variable: 'APP_TEST_YML')
          ]) {
            sh '''
              echo "📄 .env 파일 주입"
              cp $ENV_FILE client/.env

              echo "📄 application.yml 파일 주입"
              cp $APP_YML server/src/main/resources/application.yml
              cp $APP_TEST_YML server/src/test/resources/application-test.yml

              cat server/src/main/resources/application.yml
            '''
          }
        }
      }
    }

    stage('Build Backend Jar') {
      steps {
        container('gradle') {
          dir('server') {
            sh '''
              echo "🔧 gradlew 실행"
              chmod +x gradlew
              ./gradlew build --no-daemon
            '''
          }
        }
      }
    }

    stage('Build & Push FE + BE') {
      steps {
        container('kaniko') {
          script {
            def beTag = "be-1.0-${BUILD_NUMBER}"
            def feTag = "fe-1.0-${BUILD_NUMBER}"

            sh """
              echo "📦 Backend 이미지 빌드 시작"
              /kaniko/executor \
                --context server \
                --dockerfile server/Dockerfile \
                --destination docker.io/minipia/minipia:${beTag} \
                --insecure \
                --skip-tls-verify \
                --cleanup \
                --verbosity debug \
                --force

              echo "📦 Frontend 이미지 빌드 시작"
              /kaniko/executor \
                --context client \
                --dockerfile client/Dockerfile \
                --destination docker.io/minipia/minipia:${feTag} \
                --insecure \
                --skip-tls-verify \
                --cleanup \
                --verbosity debug \
                --force
            """
          }
        }
      }
    }

    stage('Kubernetes 배포') {
      steps {
        withKubeConfig([credentialsId: 'kube-config']) {
          script {
            def beTag = "be-1.0-${BUILD_NUMBER}"
            def feTag = "fe-1.0-${BUILD_NUMBER}"

            sh """
              echo "🔍 kubectl 다운로드"
              curl -LO "https://dl.k8s.io/release/\$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
              chmod +x kubectl

              echo "🚀 백엔드 배포"
              ./kubectl set image deployment/backend-deployment backend=docker.io/minipia/minipia:${beTag} -n default

              echo "🚀 프론트엔드 배포"
              ./kubectl set image deployment/frontend-deployment frontend=docker.io/minipia/minipia:${feTag} -n default
            """
          }
        }
      }
    }
  }
}
