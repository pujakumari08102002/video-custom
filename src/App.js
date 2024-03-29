import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import video from './love.mp4';
import { FaPlay, FaPause, FaBackward, FaForward, FaExpand} from 'react-icons/fa';

const VideoContainer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0); 
  const [tapCount, setTapCount] = useState(0); 
  const [playbackRate, setPlaybackRate] = useState(1); 

  useEffect(() => {
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      setDuration(video.duration);
      video.playbackRate = playbackRate; // Set playback rate here
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [playbackRate]); // Listen to changes in playback rate

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video.paused && !isPaused) {
      video.play();
      setIsPlaying(true);
    } else if (!video.paused && !isPaused) {
      video.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      video.play();
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleDoubleTapRight = () => {
    const now = Date.now();
    if (tapCount === 1 && now - lastTapTime < 300) { 
      const video = videoRef.current;
      video.currentTime += 10;
      setTapCount(0);
    } else {
      setTapCount(1);
      setTimeout(() => setTapCount(0), 300); 
    }
    setLastTapTime(now);
  };

  const handleDoubleTapLeft = () => {
    const now = Date.now();
    if (tapCount === 1 && now - lastTapTime < 300) {
      const video = videoRef.current;
      video.currentTime -= 5;
      setTapCount(0);
    } else {
      setTapCount(1);
      setTimeout(() => setTapCount(0), 300); 
    }
    setLastTapTime(now);
  };

  const handleHoldLeft = () => {
    const video = videoRef.current;
    setPlaybackRate(1); 
    video.playbackRate = 1;
    video.currentTime -= 1;
  };

  const handleHoldRight = () => {
    const video = videoRef.current;
    setPlaybackRate(2); 
    video.playbackRate = 2;
    video.currentTime += 1;
  };

  const handleFullScreen = () => {
    const video = videoRef.current;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) { 
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) { 
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { 
      video.msRequestFullscreen();
    }
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    video.volume = e.target.value;
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = e.target.value;
    video.currentTime = seekTime;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="video-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={video}
          className="video"
          onClick={handlePlayPause}
        ></video>
        {isLoading && <div className="spinner"></div>}
        <div className="custom-controls">
          {/* {isPlaying ? (
            <FaPause onClick={handlePlayPause} />
          ) : (
            <FaPlay onClick={handlePlayPause} />
          )} */}
          <FaBackward onClick={handleDoubleTapLeft} />

          {isPlaying ? (
            <FaPause onClick={handlePlayPause} />
          ) : (
            <FaPlay onClick={handlePlayPause} />
          )}



          <FaForward onClick={handleDoubleTapRight} />
          <FaBackward onMouseDown={handleHoldLeft} onMouseUp={handlePlayPause} />
          <FaForward onMouseDown={handleHoldRight} onMouseUp={handlePlayPause} />
          <FaExpand onClick={handleFullScreen} />
          {/* <FaVolumeUp /> */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={video.volume}
            onChange={handleVolumeChange}
          />
          <input
            type="range"
            min="0"
            max={duration}
            step="1"
            value={currentTime}
            onChange={handleSeek}
          />
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
