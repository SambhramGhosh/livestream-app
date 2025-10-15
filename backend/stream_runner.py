
import subprocess
import os
import shlex
import time
from dotenv import load_dotenv


load_dotenv()
from config import FFMPEG_BIN, STREAM_OUTPUT_DIR, HLS_PLAYLIST, RTSP_URL
# Ensure output dir exists
os.makedirs(STREAM_OUTPUT_DIR, exist_ok=True)

# Build FFmpeg command for RTSP -> HLS
# This command produces a playlist and segment files in STREAM_OUTPUT_DIR

FFMPEG_COMMAND_TEMPLATE = (
    "{ffmpeg} -y -rtsp_transport tcp -i \"{rtsp}\" "
    "-c:v copy -c:a aac -ac 1 -f hls "
    "-hls_time 2 -hls_list_size 3 -hls_flags delete_segments+append_list "
    "-hls_segment_filename \"{out}/segment%03d.ts\" \"{out}/{playlist}\""
)


def start_ffmpeg(rtsp_url=None):
    rtsp = rtsp_url or RTSP_URL
    if not rtsp:
        raise ValueError('RTSP_URL not set')

    cmd = FFMPEG_COMMAND_TEMPLATE.format(
        ffmpeg=FFMPEG_BIN,
        rtsp=rtsp,
        out=STREAM_OUTPUT_DIR,
        playlist=HLS_PLAYLIST,
    )

    print('Starting ffmpeg with command:')
    print(cmd)

    # Start in a subprocess and let it run
    proc = subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return proc


if __name__ == '__main__':
    proc = start_ffmpeg()
    try:
        # Stream process stderr to console
        while True:
            line = proc.stderr.readline()
            if not line:
                break
            print(line.decode('utf-8', errors='ignore').strip())
    except KeyboardInterrupt:
        proc.terminate()
        proc.wait()
