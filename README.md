Dockerized Node.js API on AWS ☁️🐳

A DevOps-focused project demonstrating the containerization and cloud deployment of a Node.js REST API. This project showcases practical experience with Docker image optimization, Linux system administration, and AWS EC2 infrastructure.

🏗️ Infrastructure & Tech Stack

Containerization: Docker (Optimized Alpine Linux base images)
Cloud Provider: AWS (Elastic Compute Cloud - EC2)
Networking: AWS Security Groups (Port mapping & Inbound routing)
OS / Environment: Ubuntu Linux
Application Layer: Node.js, Express, SQLite, JWT Authentication
🚀 DevOps Implementation Details

1. Docker Optimization

The application is containerized using a multi-layer Dockerfile. To reduce the attack surface and optimize deployment speed, the image utilizes node:18-alpine. This reduced the final image footprint to ~66MB, ensuring rapid artifact pushing and pulling.

2. Cloud Deployment (AWS EC2)

The container is hosted on an AWS EC2 instance running Ubuntu.

Security: Configured AWS Security Groups to restrict traffic, only allowing inbound HTTP traffic on specific application ports (e.g., Port 8000) and SSH (Port 22) for secure administrative access.
Port Mapping: Utilized Docker's network isolation to map the host EC2 port 8000 to the internal container port 3000.
⚙️ How to Deploy

To replicate this deployment on any Linux server:

Clone the repository:
    git clone [https://github.com/gitaagamjain/dockerized-node-api-aws.git](https://github.com/gitaagamjain/dockerized-node-api-aws.git)
    cd dockerized-node-api-aws
