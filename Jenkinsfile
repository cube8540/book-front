pipeline {
    agent any
    stages {
        stage('Setup profile') {
            steps {
                sh 'cp ${CONFIG_LOCATION}/*.conf .'
                sh 'cp ${CONFIG_LOCATION}/.env.* .'
            }
        }
        stage('Node build') {
            steps {
                sh 'npm install'
            }
            steps {
                sh 'npm run build-${ACTIVE_PROFILE}'
                script {
                    buildVersion = sh(script: 'node -e "console.log(require(\'./package.json\').version);"', returnStdout: true)
                }
            }
        }
        stage('Docker build') {
            steps {
                script {
                    echo "buildVersion=${buildVersion}"
                    app = docker.build("book-front:${buildVersion}", "-t book-front:latest --build-arg V_VERSION=${buildVersion} --build-arg V_PROFILE=$ACTIVE_PROFILE .")
                }
            }
        }
    }
}