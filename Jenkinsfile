pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'pasindu2001'
        BACKEND_IMAGE      = "${DOCKERHUB_USERNAME}/medicare-backend"
        FRONTEND_IMAGE     = "${DOCKERHUB_USERNAME}/medicare-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                echo 'Building Docker images...'
                sh "docker build -t ${BACKEND_IMAGE}:latest ./backend"
                sh "docker build -t ${FRONTEND_IMAGE}:latest ./frontend"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                echo 'Provisioning AWS EC2 with Terraform...'
                withCredentials([
                    string(credentialsId: 'aws-access-key-id',     variable: 'AWS_ACCESS_KEY'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_KEY')
                ]) {
                    dir('terraform') {
                        sh 'terraform init'
                        sh '''
                            terraform apply -auto-approve \
                                -var="aws_access_key=$AWS_ACCESS_KEY" \
                                -var="aws_secret_key=$AWS_SECRET_KEY"
                        '''
                        // Capture the EC2 IP output from Terraform
                        script {
                            env.EC2_IP = sh(
                                script: 'terraform output -raw ec2_public_ip',
                                returnStdout: true
                            ).trim()
                        }
                    }
                }
                echo "EC2 instance is at: ${env.EC2_IP}"
            }
        }

        stage('Ansible Deploy') {
            steps {
                echo "Deploying to EC2 at ${env.EC2_IP}..."
                // Write the real EC2 IP into Ansible inventory
                sh """
                    sed -i 's/ansible_host=[0-9.]*/ansible_host=${env.EC2_IP}/' ansible/inventory.ini
                """
                // Copy the SSH key into Jenkins home
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ec2-ssh-key',
                        keyFileVariable: 'SSH_KEY'
                    ),
                    string(credentialsId: 'aws-secret-access-key', variable: 'MONGO_URI')
                ]) {
                    sh """
                        # Disable strict host checking so Ansible doesn't hang
                        export ANSIBLE_HOST_KEY_CHECKING=False
                        export MONGO_URI='${env.MONGO_URI}'

                        ansible-playbook ansible/deploy.yml \
                            -i ansible/inventory.ini \
                            --private-key $SSH_KEY \
                            -u ubuntu
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline succeeded! App is live at http://${env.EC2_IP}"
        }
        failure {
            echo '❌ Pipeline failed. Check the stage logs above.'
        }
    }
}