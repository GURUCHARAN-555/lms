"use client";

import { useRef, useState } from "react";

type Rectangle = { x: number; y: number; width: number; height: number };

const getRectangle = (a: { x: number; y: number }, b: { x: number; y: number }): Rectangle => ({
  x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(a.x - b.x), height: Math.abs(a.y - b.y)
});

export default function ScreenWidget() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Choose Capture to select a tab, window, or screen.");
  const [selection, setSelection] = useState<Rectangle | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [question, setQuestion] = useState("");
  const image = useRef<HTMLCanvasElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  const draw = (next = selection) => {
    const source = image.current; const target = canvas.current; if (!source || !target) return;
    const context = target.getContext("2d"); if (!context) return;
    context.clearRect(0, 0, target.width, target.height); context.drawImage(source, 0, 0);
    if (!next) return;
    context.fillStyle = "rgba(0,0,0,.5)"; context.fillRect(0, 0, target.width, target.height);
    context.save(); context.beginPath(); context.rect(next.x, next.y, next.width, next.height); context.clip(); context.drawImage(source, 0, 0); context.restore();
    context.strokeStyle = "#8b82ff"; context.lineWidth = 3; context.strokeRect(next.x, next.y, next.width, next.height);
  };
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const target = canvas.current!; const box = target.getBoundingClientRect();
    return { x: (event.clientX - box.left) * target.width / box.width, y: (event.clientY - box.top) * target.height / box.height };
  };
  const capture = async () => {
    try {
      setStatus("Choose a tab, window, or screen in the browser picker…");
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const video = document.createElement("video"); video.srcObject = stream; video.muted = true; await video.play();
      const source = document.createElement("canvas"); source.width = video.videoWidth; source.height = video.videoHeight;
      source.getContext("2d")?.drawImage(video, 0, 0); stream.getTracks().forEach((track) => track.stop());
      image.current = source; if (canvas.current) { canvas.current.width = source.width; canvas.current.height = source.height; }
      setSelection(null); setSelecting(false); requestAnimationFrame(() => draw(null)); setStatus("Captured. Choose Select, then drag over the question.");
    } catch (error) { setStatus(`Capture unavailable: ${error instanceof Error ? error.message : "cancelled"}`); }
  };
  const beginSelection = () => { if (!image.current) { setStatus("Capture an image first."); return; } setSelecting(true); setSelection(null); draw(null); setStatus("Drag over the question in the preview."); };
  const pointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => { if (!selecting) return; start.current = point(event); event.currentTarget.setPointerCapture(event.pointerId); };
  const pointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => { if (!selecting || !start.current) return; const next = getRectangle(start.current, point(event)); setSelection(next); draw(next); };
  const pointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => { if (!selecting || !start.current) return; const next = getRectangle(start.current, point(event)); start.current = null; setSelection(next); setSelecting(false); draw(next); setStatus("Region selected. Type or paste the question below."); };

  const openWidget = async () => {
    setOpen(true); setStatus("Full-screen capture mode is open. Capture or type a question.");
    try { await document.documentElement.requestFullscreen(); } catch { /* Browser fullscreen is optional. */ }
  };
  const closeWidget = async () => {
    setOpen(false);
    if (document.fullscreenElement) await document.exitFullscreen();
  };

  return <>
    <button className="widget-launch" onClick={openWidget}>⊞ Open full-screen capture</button>
    {open && <aside className="screen-widget" aria-label="Screen Answer widget">
      <div className="widget-header"><strong>Screen Answer</strong><button aria-label="Close widget" onClick={closeWidget}>×</button></div>
      <div className="widget-actions"><button className="widget-primary" onClick={capture}>Capture</button><button onClick={beginSelection}>Select</button></div>
      {image.current && <canvas ref={canvas} className="widget-canvas" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} />}
      {!image.current && <canvas ref={canvas} className="widget-canvas" hidden />}
      <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Question text" rows={3} />
      <p>{status}</p>
    </aside>}
  </>;
}
