import os

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
MONGO_DB = os.getenv('MONGO_DB', 'livestream')
OVERLAYS_COLLECTION = os.getenv('OVERLAYS_COLLECTION', 'overlays')


# Where FFmpeg will drop HLS files
STREAM_OUTPUT_DIR = os.getenv('STREAM_OUTPUT_DIR', './static/stream')


# HLS playlist filename (relative to STREAM_OUTPUT_DIR)
HLS_PLAYLIST = os.getenv('HLS_PLAYLIST', 'live.m3u8')


# Default RTSP URL -- override in .env
RTSP_URL = os.getenv('RTSP_URL', '')


# FFmpeg binary path
FFMPEG_BIN = os.getenv('FFMPEG_BIN', 'ffmpeg')