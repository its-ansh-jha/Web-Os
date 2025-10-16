import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

export function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      setError('Camera access denied or not available');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
    }
  };

  const downloadPhoto = () => {
    if (!capturedImage) return;
    const a = document.createElement('a');
    a.href = capturedImage;
    a.download = `photo-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 flex items-center justify-center bg-black/90 rounded-lg overflow-hidden mb-4">
        {error ? (
          <div className="text-center text-white">
            <Icons.CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{error}</p>
          </div>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured" className="max-w-full max-h-full" data-testid="captured-image" />
        ) : stream ? (
          <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-full" data-testid="camera-preview" />
        ) : (
          <div className="text-center text-white">
            <Icons.Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Click Start Camera to begin</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        {!stream && !capturedImage && (
          <Button onClick={startCamera} data-testid="button-start-camera">
            <Icons.Camera className="h-4 w-4 mr-2" />
            Start Camera
          </Button>
        )}

        {stream && !capturedImage && (
          <>
            <Button onClick={capturePhoto} data-testid="button-capture">
              <Icons.Circle className="h-4 w-4 mr-2" />
              Capture
            </Button>
            <Button variant="outline" onClick={stopCamera} data-testid="button-stop-camera">
              <Icons.CameraOff className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </>
        )}

        {capturedImage && (
          <>
            <Button onClick={downloadPhoto} data-testid="button-download">
              <Icons.Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCapturedImage(null);
                startCamera();
              }}
              data-testid="button-retake"
            >
              <Icons.RotateCw className="h-4 w-4 mr-2" />
              Retake
            </Button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
