pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'pasindu2001'
        BACKEND_IMAGE      = "${DOCKERHUB_USERNAME}/medicare-backend"
        FRONTEND_IMAGE     = "${DOCKERHUB_USERNAME}/medicare-frontend"
        EC2_USER           = 'ubuntu'
        EC2_IP             = ''   // ← we'll fill this in Phase 4 after Terraform creates EC2
    }

    stages {

        // ── Stage 1: Pull latest code ──────────────────────────────
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        // ── Stage 2: Build Docker images ───────────────────────────
        stage('Build Images') {
            steps {
                echo 'Building Docker images...'

                // Build backend image
                sh "docker build -t ${BACKEND_IMAGE}:latest ./backend"

                // Build frontend image (production Nginx build)
                sh "docker build -t ${FRONTEND_IMAGE}:latest ./frontend"
            }
        }

        // ── Stage 3: Push images to Docker Hub ─────────────────────
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

        // ── Stage 4: Provision infrastructure with Terraform ───────
        stage('Terraform Apply') {
            steps {
                echo 'Provisioning AWS EC2 with Terraform...'
                dir('terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        // ── Stage 5: Deploy containers with Ansible ─────────────────
        stage('Ansible Deploy') {
            steps {
                echo 'Deploying containers to EC2 with Ansible...'
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ansible-playbook -i ansible/inventory.ini \
                            ansible/deploy.yml \
                            --private-key ~/.ssh/ec2-key.pem \
                            -u ubuntu
                    '''
                }
            }
        }
    }

    // ── Post-pipeline notifications ─────────────────────────────────
    post {
        success {
            echo '✅ Pipeline succeeded! App is deployed and live.'
        }
        failure {
            echo '❌ Pipeline failed. Check the stage logs above.'
        }
    }
}