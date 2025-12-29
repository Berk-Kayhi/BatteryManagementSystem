# 🔋 Battery Management System (BMS) Dashboard

![Status](https://img.shields.io/badge/Status-Active_Development-success)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Stack](https://img.shields.io/badge/Full_Stack-MERN_%2B_Python-orange)

A comprehensive full-stack application designed for real-time monitoring, analysis, and management of electric vehicle battery systems. This project leverages a **microservices architecture** to ingest sensor data, provide AI-driven State of Charge (SOC) predictions, and visualize system health through a modern web interface.

## 🚀 Key Features

- **Real-Time Monitoring**: Live tracking of critical battery metrics (Voltage, Current, Power, SOH, SOC) via **MQTT** and **WebSockets**.
- **AI-Powered Predictions**: Integrated Machine Learning microservice for predicting Battery State of Charge (SOC) based on live sensor inputs.
- **Interactive Visualization**:
  - **Network Map**: Geospatial representation of the sensor/battery network.
  - **Dashboard**: Dynamic gauges and charts for instant status updates.
- **Historical Analytics**: Comprehensive logs and charts to analyze past performance trends and degradation.
- **System Health**: Centralized view of system connectivity and node status.
- **Secure Access**: Role-based user authentication system (Login/Register).

## 🛠 Technology Stack

### Backend & Infrastructure

- **Node.js & Express**: Core API gateway handling data processing and client communication.
- **Python (FastAPI)**: Dedicated microservice for AI/ML inference calculations.
- **PostgreSQL**: Relational database for persistent storage of sensor logs and user data.
- **MQTT (Eclipse Mosquitto)**: Lightweight messaging protocol for high-frequency sensor data ingestion.
- **Socket.IO**: Real-time bidirectional event-based communication for frontend updates.
- **Docker**: Container orchestration ensuring consistent deployment across environments.

### Frontend

- **React (Vite)**: High-performance UI library.
- **TypeScript**: Ensuring strict type safety and code maintainability.
- **Tailwind CSS**: Utility-first framework for responsive design.
- **Recharts**: Data visualization library for rendering complex battery charts.
- **Leaflet**: Interactive maps for tracking mobile battery units.

## 📂 Project Structure

```bash
├── 📁 backend         # Node.js API Gateway, Database ORM, and MQTT Handler
├── 📁 frontend        # React application source code (Vite + TypeScript)
├── 📁 data-publisher  # Python script simulating IoT sensor nodes via MQTT
├── 📁 fake-ai         # Python FastAPI service for SOC prediction simulation
├── 📁 mosquitto       # MQTT Broker configuration
└── 📁 csv-data        # NASA PCoE battery datasets used for simulation
```

## ⚡ Getting Started

### Prerequisites

- **Docker & Docker Compose** (for backend services)
- **Node.js & npm** (for running the frontend locally)

### Installation & Running

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/mqzesh34/BatteryManagementSystem.git
    cd BatteryManagementSystem
    ```

2.  **Start Backend Services (Docker)**
    This command spins up the Database, Backend API, MQTT Broker, AI Service, and Data Publisher.

    ```bash
    docker-compose up --build -d
    ```

3.  **Start Frontend Application**
    Open a new terminal window and navigate to the frontend directory.

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the Dashboard**
    Open your browser and navigate to:
    `http://localhost:5173`

## 📖 Usage Guide

1.  **Authentication**: Create an account on the Register page or log in with existing credentials.
2.  **Network Map**: View the geographical or logical layout of your battery sensors.
3.  **Sensors**: Monitor live incoming data streams from connected battery units.
4.  **Predictions**: Compare real-time sensor SOC readings with AI-generated predictions to detect anomalies.
5.  **History**: select date ranges to view historical performance data.

## 🔧 Architecture Overview

1.  **Data Ingestion**: The `data-publisher` reads sensor data from CSV and publishes it to the `mosquitto` MQTT broker.
2.  **Processing**: The `backend` subscribes to MQTT topics, receives data, and forwards it to the frontend via Socket.IO.
3.  **Analysis**: The `backend` sends data to the `fake-ai` service to get SOC predictions.
4.  **Storage**: All sensor readings and predictions are archived in `PostgreSQL`.
5.  **Visualization**: The `frontend` fetches live streams and historical data to render charts and maps.

## 📸 System Visuals

Here are the system diagrams and architectural overviews:

![System Architecture 1](assets/Battery%20Management%20System.jpg)
![System Architecture 2](assets/Battery%20Management%20System%202.jpg)
![System Architecture 3](assets/Battery%20Management%20System%203.jpg)
![System Architecture 4](assets/Battery%20Management%20System%204.jpg)
![System Architecture 5](assets/Battery%20Management%20System%205.jpg)
![System Architecture 6](assets/Battery%20Management%20System%206.jpg)
