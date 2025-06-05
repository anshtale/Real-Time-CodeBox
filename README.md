<p align="center">
  <h2 align="center">Cloud IDE System Design.</h2>
</p>

![System-Design-CodeSync](https://github.com/user-attachments/assets/879369f2-e862-48b2-a5e1-a5e1a81d3074)

<p align="center">
  <img src="[https://github.com/user-attachments/assets/5ad3b0cc-bb0a-48a4-9757-4d9ecab377bd](https://github.com/user-attachments/assets/879369f2-e862-48b2-a5e1-a5e1a81d3074)"></img>
</p>

<p align="center">
  <h2 align="center">Collaborative Code Editor System Design.</h2>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/c7b227df-743b-4823-8495-a968cb3e039d"></img>
</p>

<p align="center">
  <h2 align="center">🚀 Collaborative IDE & Cloud Code Execution (Real-Time CodeBox)</h2>
</p>
<p align="center">
  Real-Time CodeBox is an innovative platform designed for seamless real-time code collaboration and cloud-based development. It provides a fully functional integrated development environment (IDE) accessible directly from your browser, coupled with secure, isolated code execution capabilities.
  
</p>

## 💻 Tech Stack
### Frontend Technologies
- **React**: For building the frontend

- **Recoil**: For state management

### Backend Technologies
-   **Node.js**: A JavaScript runtime powering the backend services (Websocket Server, Express Server, Worker) for high-performance, scalable network applications.
-   **Express.js**: A minimal and flexible Node.js web application framework, used for building the RESTful API of the Express Server.
-   **WebSocket (ws library)**: A Node.js WebSocket library enabling real-time, bidirectional communication between the frontend and backend for collaborative features.
-   **Redis Queue**: A robust, performant, queueing system built on Redis, used for managing code submission tasks and ensuring reliable processing by the Worker service.
-   **Redis Pub/Sub**: A messaging paradigm used for real-time updates and communication between different backend services, such as notifying the WebSocket server when a worker has finished executing code.

### Infrastructure & Deployment

-   **Docker**: A platform for developing, shipping, and running applications in containers, used by the Worker service to create isolated execution environments and for consistent deployment of other services.
-   **AWS EC2**: Amazon Elastic Compute Cloud, providing scalable computing capacity, used to host the WebSocket server.
-   **AWS ECS**: Amazon Elastic Container Service, a highly scalable container orchestration service, used to deploy and manage the Express Server and Worker services.
  
## ✨ Features

-   **Real-time Collaborative Coding** 🤝: Work together on code with multiple users simultaneously. See changes instantly as they happen, fostering efficient teamwork and pair programming.
-   **Cloud-Based Integrated Development Environment (IDE)** ☁️💻: Access your development environment from anywhere, anytime. Enjoy a rich coding experience directly in your web browser, eliminating the need for local setup.
-   **Secure Cloud Code Execution** 🔒🐳: Execute your code snippets and programs in isolated Docker containers. This ensures a safe, consistent, and sandboxed environment for running untrusted code without impacting the main system.

## 🏗️ Architecture and Deployment

Real-Time CodeBox is built as a modular system, with each component deployed on cloud services optimized for its function. While the project is structured as a monorepo for development efficiency, each service operates independently in production.

-   **`frontend`**: The user-facing application, built with React.js, providing the interactive collaborative IDE.
    -   **Hosting**: Vercel

-   **`express-server`**: The robust backend API server, handling problem submission to redis-queue.
    -   **Hosting**: AWS ECS (Elastic Container Service)

-   **`websocket-server`**: A dedicated, high-performance server responsible for managing all real-time WebSocket connections, ensuring instant code synchronization and communication between collaborators.
    -   **Hosting**: EC2 Instance

-   **`worker`**: The powerhouse for code execution. This service receives code, executes it within isolated Docker environments, and returns the results.
    -   **Hosting**: AWS ECS (Elastic Container Service)


