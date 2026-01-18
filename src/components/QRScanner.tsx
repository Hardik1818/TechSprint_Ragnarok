
import { useState, useRef, useEffect } from 'react';
import { X, Flashlight, Image as ImageIcon, QrCode, Zap } from 'lucide-react';
import './QRScanner.css';

interface QRScannerProps {
    onClose: () => void;
}

const QRScanner = ({ onClose }: QRScannerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [flashOn, setFlashOn] = useState(false); // Note: Simple web APIs often don't support flashlight control easily without advanced constraints

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setHasPermission(true);
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setHasPermission(false);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="qr-scanner-overlay animate-fadeIn">
            <header className="scanner-header">
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <X size={24} />
                </button>
                <button onClick={() => setFlashOn(!flashOn)} style={{ background: 'none', border: 'none', color: flashOn ? '#ffcc33' : 'white' }}>
                    <Zap size={24} fill={flashOn ? '#ffcc33' : 'none'} />
                </button>
            </header>

            <div className="scanner-content">
                <div className="scanner-logo">
                    <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--primary)' }}>DailyPay</span>
                    </h2>
                </div>

                <p className="scanner-instruction">Please align the QR within the frame</p>

                <div className="scan-frame">
                    <div className="scan-corner top-left"></div>
                    <div className="scan-corner top-right"></div>
                    <div className="scan-corner bottom-left"></div>
                    <div className="scan-corner bottom-right"></div>
                    <div className="scan-line"></div>

                    {/* Video Background */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="camera-view"
                        style={{ filter: hasPermission ? 'none' : 'blur(10px)' }}
                    />
                    {!hasPermission && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>Camera Access Required</div>}
                </div>

                <button className="gallery-btn">
                    <ImageIcon size={20} />
                    Upload from Gallery
                </button>

                <div className="partners-row">
                    <span className="partner-logo red">fonepay</span>
                    <span className="partner-logo union">UnionPay</span>
                    <span className="partner-logo blue">NEPALPAY</span>
                    <span className="partner-logo red">IME QR</span>
                </div>

                <button className="show-qr-btn">
                    <QrCode size={20} />
                    SHOW MY QR CODE
                </button>
            </div>
        </div>
    );
};

export default QRScanner;
