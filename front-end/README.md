Setup Instructions:

1️⃣ Clone or Download

git clone https://github.com/SambhramGhosh/livestream-overlay.git
cd livestream-overlay


Or extract ZIP and navigate into the root folder.

2️⃣ Backend Environment


```
1) Run MongoDB in Docker (example):
   docker-compose up -d

  - if error, see which containers are already running using: docker ps
  - then stop the container using: docker stop <container-name> or docker-compose down -v
  - then run: docker container prune
    Note: This deletes all previous non running containers
  -Then finally try once again: docker-compose up -d



```
Inside backend/, create .env:

---
MONGO_URI=mongodb://root:example@localhost:27017
MONGO_DB=livestream
OVERLAYS_COLLECTION=overlays
FFMPEG_BIN=ffmpeg
RTSP_URL=rtsp://rtspstream:2cfdF7q6qy4iz2B0-zgcZ@zephyr.rtsp.stream/movie
STREAM_OUTPUT_DIR=./static/stream
HLS_PLAYLIST=live.m3u8
FLASK_ENV=development
---

then, pip install -r requirements.txt



3️⃣ Frontend Environment

Inside front-end/, create .env:
---
VITE_API_URL=http://localhost:5000
VITE_HLS_PATH=http://localhost:5000/stream/live.m3u8
---



4️⃣ Backend Setup

Go to project root>backend/ once again

Start Flask server:

python app.py


Backend runs on: http://localhost:5000

HLS stream: http://localhost:5000/stream/live.m3u8

Ensure MongoDB container is running before starting Flask.

5️⃣ Frontend Setup

Navigate to frontend:

cd ../frontend


Install dependencies:

npm install


Start Vite dev server:

npm run dev


Frontend runs on: http://localhost:5173

Fetches overlays from backend API at http://localhost:5000/api/overlays/

Plays livestream via HLS

6️⃣ Overlay CRUD API (for testing / Postman)
Method	Endpoint	Description
GET	/api/overlays/	List all overlays
POST	/api/overlays/	Create overlay
GET	/api/overlays/:id	Get overlay by ID
PUT	/api/overlays/:id	Update overlay
DELETE	/api/overlays/:id	Delete overlay


7️⃣ Usage

Open frontend: http://localhost:5173

Click Play to start livestream

Add/select overlays in Overlay Manager

Drag, resize, and position overlays on video

Save or delete overlays via sidebar

8️⃣ Notes

Overlays are fully draggable/resizable using React-RND

Video controls: Play/Pause + Volume (no progress bar required)

Ensure MongoDB Docker is running before Flask