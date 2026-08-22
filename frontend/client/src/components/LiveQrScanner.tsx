import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, Upload, ScanLine, AlertCircle, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface LiveQrScannerProps {
  onScan: (decodedText: string) => void;
  isScanning: boolean;
}

export const LiveQrScanner: React.FC<LiveQrScannerProps> = ({ onScan, isScanning }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scannerElementId = "spectra-live-qr-reader";

  useEffect(() => {
    // Check available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Prefer back/environment camera if available
          const backCamera = devices.find(d => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment"));
          setSelectedCameraId(backCamera ? backCamera.id : devices[0].id);
        }
      })
      .catch((err) => {
        console.warn("[Scanner] Camera enumeration note:", err);
      });

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (cameraId?: string) => {
    setCameraError(null);
    const targetCamera = cameraId || selectedCameraId;

    try {
      if (html5QrCodeRef.current) {
        await stopCamera();
      }

      const qrCode = new Html5Qrcode(scannerElementId);
      html5QrCodeRef.current = qrCode;

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await qrCode.start(
        targetCamera ? { deviceId: { exact: targetCamera } } : { facingMode: "environment" },
        config,
        (decodedText) => {
          setLastScanned(decodedText);
          toast.success("📷 QR Code Detected via Camera!", {
            description: `Token: ${decodedText}`
          });
          onScan(decodedText);
          stopCamera();
        },
        () => {
          // Ignore scanning frame misses
        }
      );

      setIsCameraActive(true);
      toast.info("Live Optical Camera Active", {
        description: "Align patient's QR code within the viewfinder."
      });
    } catch (err: any) {
      console.error("[Scanner] Camera start error:", err);
      setCameraError(
        err?.message || "Could not access camera. Ensure camera permissions are granted or try image upload."
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isCameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        // Ignore stop errors
      } finally {
        setIsCameraActive(false);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const qrCode = html5QrCodeRef.current || new Html5Qrcode(scannerElementId);
      html5QrCodeRef.current = qrCode;

      const result = await qrCode.scanFile(file, true);
      setLastScanned(result);
      toast.success("📷 QR Extracted from Uploaded Image!", {
        description: `Token: ${result}`
      });
      onScan(result);
    } catch (err) {
      toast.error("Could not find a valid QR code in this image. Try another photo.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Scanner Viewfinder Box */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--line)] bg-black/90 min-h-[300px] flex flex-col items-center justify-center text-center text-white p-4">
        {/* The DOM element html5-qrcode attaches video to */}
        <div
          id={scannerElementId}
          className={`w-full max-w-[320px] rounded-xl overflow-hidden ${isCameraActive ? "block" : "hidden"}`}
        />

        {!isCameraActive && (
          <div className="flex flex-col items-center justify-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[var(--coral)]/20 text-[var(--coral)] border border-[var(--coral)]/40 flex items-center justify-center">
              <ScanLine size={36} className="animate-pulse" />
            </div>
            <strong className="text-base font-bold text-white font-['Bricolage_Grotesque']">
              Live Optical Camera QR Scanner
            </strong>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
              Use your device's physical camera to scan the patient's ephemeral QR code, or upload an image file.
            </p>

            {cameraError && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs text-left max-w-sm">
                <AlertCircle size={16} className="shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>
        )}

        {/* Live Reticle & Scanning Beam Overlay */}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-56 border-2 border-emerald-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400" />
              {/* Scanning laser line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>

      {/* Scanner Control Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--paper)] p-3.5 rounded-2xl border border-[var(--line)]">
        <div className="flex items-center gap-2 flex-wrap">
          {!isCameraActive ? (
            <button
              type="button"
              onClick={() => startCamera()}
              className="bg-[var(--coral)] hover:bg-[var(--coral-deep)] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
            >
              <Camera size={16} />
              <span>Launch Live Camera</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCamera}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
            >
              <CameraOff size={16} />
              <span>Stop Camera</span>
            </button>
          )}

          {/* Upload Image QR Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white hover:bg-[var(--cream)] border border-[var(--line)] text-[var(--rose)] text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Upload size={15} className="text-[var(--coral-deep)]" />
            <span>Scan from Image</span>
          </button>
        </div>

        {/* Camera Selector (if multiple cameras exist) */}
        {cameras.length > 1 && isCameraActive && (
          <select
            value={selectedCameraId}
            onChange={(e) => {
              setSelectedCameraId(e.target.value);
              startCamera(e.target.value);
            }}
            className="bg-white border border-[var(--line)] text-xs font-medium text-[var(--rose)] rounded-xl px-3 py-2 outline-none"
          >
            {cameras.map((cam) => (
              <option key={cam.id} value={cam.id}>
                📷 {cam.label || `Camera ${cam.id.slice(0, 5)}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {lastScanned && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>
              Last Scanned Token: <strong className="font-mono">{lastScanned}</strong>
            </span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">
            Decoded
          </span>
        </div>
      )}
    </div>
  );
};

export default LiveQrScanner;
