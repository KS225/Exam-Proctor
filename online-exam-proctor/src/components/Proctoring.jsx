import { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function Proctoring({ examId, onViolation }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // 🔥 optimized interval (less lag)
  useEffect(() => {
    const interval = setInterval(sendFrame, 1500); // slower = smoother
    return () => clearInterval(interval);
  }, []);

  const sendFrame = async () => {
    const webcam = webcamRef.current;
    const canvas = canvasRef.current;

    if (!webcam || !canvas) return;

    const screenshot = webcam.getScreenshot();
    if (!screenshot) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/proctor/frame",
        {
          examId,
          image: screenshot // ✅ full base64
        }
      );

      const data = res.data;

      const video = webcam.video;
      const ctx = canvas.getContext("2d");

      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      // ✅ draw boxes
      data.boxes?.forEach((b) => {
        const [x1, y1, x2, y2] = b.box;

        ctx.strokeStyle = data.violation ? "red" : "lime";
        ctx.lineWidth = 2;

        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillText(b.label, x1, y1 - 5);
      });

      // ✅ violation callback
      if (data.violation) {
        onViolation?.();
      }

    } catch (err) {
      console.log("Proctoring error:", err);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width="100%"
        videoConstraints={{
          facingMode: "user"
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
      />
    </div>
  );
}