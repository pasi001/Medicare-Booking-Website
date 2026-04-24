terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# Firewall rules — what traffic is allowed in/out
resource "aws_security_group" "medicare_sg" {
  name        = "medicare-sg"
  description = "Allow web and SSH traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 instance — t3.micro = free tier
resource "aws_instance" "medicare_server" {
  ami                    = "ami-0c7217cdde317cfec"  # Ubuntu 22.04 LTS (us-east-1)
  instance_type          = "t3.micro"
  key_name               = "medicare-key"
  vpc_security_group_ids = [aws_security_group.medicare_sg.id]

  tags = {
    Name = "medicare-server"
  }

  # Wait for EC2 to be fully ready before Ansible connects
  provisioner "local-exec" {
    command = "echo 'EC2 is ready at ${self.public_ip}'"
  }
}

# This IP is what Ansible will use to connect
output "ec2_public_ip" {
  value = aws_instance.medicare_server.public_ip
}