import React, { useEffect, useRef } from 'react';
import s from './VideoPlayer.module.scss';

interface PropsI {
  path: string;
}
export const VideoPlayer: React.FC<PropsI> = (props) => {
  const { path } = props;
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current as never as HTMLVideoElement;
    if (!video) return;

    const handleVideoEnd = () => {
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  return (
    <video
      className={s.container}
      ref={videoRef}
      autoPlay
      muted
      playsInline
      loop
    >
      <source src={path} type="video/webm" />
    </video>
  );
};