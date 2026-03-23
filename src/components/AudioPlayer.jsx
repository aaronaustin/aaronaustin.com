import { useState, useRef } from "react";

export default function AudioPlayer({ src, title }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="audio-player">
      <button onClick={toggle}>
        {playing ? "Pause" : "Play"}
      </button>
      <span>{title}</span>
      <audio ref={audioRef} src={src} />
    </div>
  );
}
