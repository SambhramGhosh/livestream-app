import React, { useEffect, useState, useRef } from "react";
import Hls from "hls.js";
import { hlsUrl } from "../api";
import { Rnd } from "react-rnd";
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import './VideoPlayer.css';

export default function VideoPlayer({ overlays = [], onSelectOverlay, onUpdateOverlay }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const url = hlsUrl();
    const video = videoRef.current;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => console.error('HLS error', event, data));
      return () => hls.destroy();
    } else {
      console.error('This browser does not support HLS.');
    }
  }, []);

  useEffect(() => { if (videoRef.current) videoRef.current.volume = volume }, [volume]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  return (
    <div className="player-wrap">
      <div className="video-container" ref={containerRef}>
        <video ref={videoRef} controls={false} autoPlay={false} muted={false} playsInline className="video-element" />
        
        {overlays.map(ov => (
          <Rnd
            key={ov.id}
            size={{ width: ov.width || 160, height: ov.height || 60 }}
            position={{ x: ov.x || 10, y: ov.y || 10 }}
            bounds="parent"
            onDragStop={(e, d) => onUpdateOverlay(ov.id, { ...ov, x: d.x, y: d.y })}
            onResizeStop={(e, dir, ref, delta, pos) => onUpdateOverlay(ov.id, {
              ...ov,
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              x: pos.x,
              y: pos.y
            })}
            style={{ zIndex: ov.zIndex || 10, cursor: 'move' }}
          >
            <div className="overlay-content">
              {ov.type === 'text' ? (
                <div className="overlay-text">{ov.text || 'Text overlay'}</div>
              ) : (
                <img src={ov.src} alt={ov.alt || 'overlay-image'} style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
              )}
            </div>
          </Rnd>
        ))}

        <div className="player-controls">
          <button className="btn-play" onClick={togglePlay}>
            {paused ? <FaPlay /> : <FaPause />}
          </button>
          <div className="volume-control">
            <FaVolumeUp className="volume-icon" />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(Number(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
}
