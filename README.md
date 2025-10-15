# 🎥 Livestream App

A full-stack application for managing real-time overlays on livestreams. Built with React (Vite), Flask, MongoDB, and FFmpeg.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Real-time Video Streaming**: RTSP to HLS conversion using FFmpeg
- **Dynamic Overlays**: Add text and image overlays on live video
- **Drag & Drop Interface**: Intuitive overlay positioning and resizing
- **CRUD Operations**: Full overlay management (Create, Read, Update, Delete)
- **MongoDB Storage**: Persistent overlay configurations
- **Responsive Design**: Works on desktop and mobile devices

---

## 🛠 Tech Stack

### Frontend
- **React** with Vite
- **Video.js** for HLS playback
- **Axios** for API calls
- **CSS3** for styling

### Backend
- **Flask** (Python)
- **FFmpeg** for stream processing
- **MongoDB** for data storage
- **Docker** for containerization

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **Docker** and **Docker Compose**
- **FFmpeg** (installed globally or in your PATH)
- **Git**

---

## ⚙️ Installation

### ⚙️ 0️⃣ Install FFmpeg (Required for Streaming)

FFmpeg is **required** to convert RTSP streams into HLS segments.

#### 🪟 **Windows**

Run in **PowerShell (Administrator)**:
```powershell
choco install ffmpeg -y
```

**If you don't have Chocolatey installed:**
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Then install FFmpeg:
```powershell
choco install ffmpeg -y
```

**Verify installation:**
```bash
ffmpeg -version
```

---

#### 🍎 **macOS**
```bash
brew install ffmpeg
```

**Verify installation:**
```bash
ffmpeg -version
```

---

#### 🐧 **Linux (Debian/Ubuntu)**
```bash
sudo apt update
sudo apt install ffmpeg -y
```

**Verify installation:**
```bash
ffmpeg -version
```

---

> ✅ If `ffmpeg -version` shows output, you're ready to proceed!

---

### 1️⃣ Clone or Download the Project
```bash
git clone https://github.com/SambhramGhosh/livestream-app.git
cd livestream-app
```

Or if downloaded as ZIP:
- Extract it and open the folder in your terminal or VS Code

---

### 🐳 2️⃣ Start MongoDB (Docker)

Move into the backend folder and run:
```bash
cd backend
docker-compose up -d
```

**What this does:**
- Pulls a MongoDB image
- Starts a MongoDB container on port `27017`

**If you face errors:**
```bash
docker ps                     # Check running containers
docker stop   # Stop conflicting ones
docker-compose down -v        # Remove old volumes
docker container prune        # Cleanup stopped containers
docker-compose up -d          # Run again
```

---

### 🔧 3️⃣ Configure Backend Environment

Inside `backend/`, create a `.env` file:
```bash

MONGO_URI=mongodb://root:example@localhost:27017
MONGO_DB=livestream-mongo
OVERLAYS_COLLECTION=overlays


# Where HLS files will be written
STREAM_OUTPUT_DIR=./static/stream
HLS_PLAYLIST=live.m3u8


# RTSP URL
RTSP_URL=rtsp://rtspstream:2cfdF7q6qy4iz2B0-zgcZ@zephyr.rtsp.stream/movie


# ffmpeg binary if not on PATH
FFMPEG_BIN=ffmpeg


# Flask port
PORT=5000
```

> 🧠 **Tip**: If that RTSP feed doesn't work, replace it with:
> ```bash
> RTSP_URL=rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov
> ```

**Install Python dependencies:**
```bash
pip install -r requirements.txt
```

---

### ▶️ 4️⃣ Run Stream Generator

This converts the RTSP stream into HLS files (`.m3u8` + `.ts`) that Flask can serve.

In the same `backend/` folder, run:
```bash
python stream_runner.py
```

**If you see errors like:**
```
Failed to resolve hostname zephyr.rtsp.stream
```

→ The stream source may be unreachable. Try replacing the `RTSP_URL` in your `.env` with a valid one.

Once FFmpeg starts generating segments, **open another terminal** and start the Flask backend.

---

### 🚀 5️⃣ Run Flask Backend
```bash
python app.py
```

- **Flask API** runs at: `http://localhost:5000`
- **HLS stream** served at: `http://localhost:5000/stream/live.m3u8`

> ⚠️ Make sure your MongoDB container is running before this step.

---

### 💻 6️⃣ Configure front-end

Go to the front-end folder:
```bash
cd ../front-end
```

Create a `.env` file:
```bash
VITE_API_URL=http://localhost:5000
VITE_HLS_PATH=/stream/live.m3u8
```

**Install dependencies:**
```bash
npm install
```

**Run the React app:**
```bash
npm run dev
```

front-end will run at: `http://localhost:5173`

---

## 🧩 API Documentation

### Overlay CRUD Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/overlays/` | List all overlays |
| `POST` | `/api/overlays/` | Create overlay |
| `GET` | `/api/overlays/:id` | Get overlay by ID |
| `PUT` | `/api/overlays/:id` | Update overlay |
| `DELETE` | `/api/overlays/:id` | Delete overlay |

### Example Request (Create Overlay)
```bash
POST http://localhost:5000/api/overlays/
Content-Type: application/json

{
  "type": "text",
  "content": "Welcome to the stream!",
  "position": {
    "x": 100,
    "y": 50
  },
  "style": {
    "fontSize": "24px",
    "color": "#ffffff"
  }
}
```

---

## 🧠 Usage Guide

1. Open `http://localhost:5173` in your browser
2. Click **Play** to start the livestream
3. Open the **Overlay Manager** sidebar
4. Add text or image overlays
5. **Drag and resize** overlays directly on the video
6. **Save** or **delete** overlays as needed

---

## 🧰 Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| ❌ CORS error | Backend not allowing `5173` | Flask-CORS already enabled, ensure app is running |
| ❌ No video playing | RTSP URL unreachable | Use a different RTSP (e.g., Wowza demo) |
| ❌ MongoDB connection error | Docker not running | Run `docker-compose up -d` again |
| ❌ Stream not found | FFmpeg not running | Run `python stream_runner.py` first |
| ❌ Port already in use | Another process using port | Kill the process or change port in config |
