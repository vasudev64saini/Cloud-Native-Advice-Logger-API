# Daily Advice Logger API 

A lightweight, backend-only RESTful API built with **Node.js** and **Express**. This project allows authenticated users to generate random pieces of life advice (via an external API) and save them to a personal database with custom notes.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** SQLite (via Sequelize ORM)
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **External API:** [Advice Slip JSON API](https://api.adviceslip.com/) (using Axios)

## Features
* **User Authentication:** Secure registration and login using hashed passwords and JWT.
* **Protected Routes:** Middleware to ensure only authorized users can access their data.
* **External API Integration:** Automatically fetches random advice on POST requests.
* **CRUD Operations:** Users can create, read, and delete their saved advice logs.

## How to Run Locally

1. Clone the repository and run `npm install`.
2. Run `node server.js` to start the server (runs on port 3000).
3. The SQLite database file will automatically generate on the first run.
4. Use Postman or ThunderClient to interact with the API endpoints.