# BrainBytes AI Tutoring Platform

![CI Status](https://github.com/FelicityS1/DevOps_G5/actions/workflows/ci.yml/badge.svg)

![Docker Build Status](https://github.com/FelicityS1/DevOps_G5/actions/workflows/build.yml/badge.svg)

![BrainBytes CI/CD](https://github.com/FelicityS1/DevOps_G5/actions/workflows/main.yml/badge.svg)

BrainBytes AI Tutor
Project Overview

BrainBytes AI Tutor is a multi-container educational web application that uses AI to help students learn different subjects such as Math, Science, History, Programming, and English. The system uses Docker Compose to manage frontend, backend, and MongoDB services.

Features
AI-powered tutoring system
Subject filtering
User profile management
Learning dashboard
MongoDB database integration
Sentiment detection
Question type detection
Multi-container Docker architecture

Technologies Used
Frontend
Next.js
React
Axios
Backend
Node.js
Express.js
MongoDB
Mongoose
AI Integration
Groq API
Llama 3.1 8B Instant
DevOps
Docker
Docker Compose

How to Run the Application
Step 1 — Clone the Repository
git clone https://github.com/FelicityS1/DevOps_G5.git

Step 2 — Navigate to the Project
cd brainbytes-multi-container

Step 3 — Configure Environment Variables
Create a .env file inside the backend folder:
GROQ_API_KEY=your_api_key
PORT=3000

Step 4 — Run Docker Compose
docker compose up --build

Application URLs
Service	URL
Frontend	http://localhost:3001

Backend API	http://localhost:3000

MongoDB	mongodb://localhost:27017

API Documentation
User Endpoints
Create User

POST /api/users

Get All Users

GET /api/users

Get User By ID

GET /api/users/:id

Update User

PUT /api/users/:id

Delete User

DELETE /api/users/:id

Learning Material Endpoints
Create Material

POST /api/materials

Get All Materials

GET /api/materials

Filter Materials By Subject

GET /api/materials/subject/:subject

Message Endpoints
Get Messages

GET /api/messages

Send Message

POST /api/messages

Database Schema Design
User Schema
Field	Type
name	String
email	String
preferredSubjects	Array
Learning Material Schema
Field	Type
subject	String
topic	String
content	String
Message Schema
Field	Type
text	String
isUser	Boolean
createdAt	Date
AI Enhancements

The AI component was enhanced using:

Subject detection
Question type detection
Sentiment analysis
Expanded educational categories
Prompt engineering

The system can identify:

Definition questions
Explanation questions
Example requests
Frustrated or confused users

The AI responds with supportive and beginner-friendly explanations.

Docker Architecture

The system uses a multi-container setup consisting of:

Frontend container
Backend container
MongoDB container

Docker Compose is used to manage communication between services.

Authors
Gilianne Rose C. Baguio
Abigail Fay Ramos
Felicity Diana Sario
Mayumi Tugade