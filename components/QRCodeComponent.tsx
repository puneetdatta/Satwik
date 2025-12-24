
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';

interface QRCodeComponentProps {
  url: string;
  shopName: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ url, shopName }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Larger canvas to accommodate branding
      canvas.width = 400;
      canvas.height = 550;
      
      if (ctx) {
        // Background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header Decoration
        ctx.fillStyle = "#4f46e5"; // Indigo 600
        ctx.fillRect(0, 0, canvas.width, 10);

        // Draw Stylized Satwik Logo (Wheat icon + Text)
        // Wheat Icon (Orange)
        ctx.fillStyle = "#f97316";
        const iconX = canvas.width / 2 - 60;
        const iconY = 60;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.ellipse(iconX, iconY + (i * 12), 8, 14, Math.PI / 4, 0, Math.PI * 2);
          ctx.ellipse(iconX + 15, iconY + (i * 12), 8, 14, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Text "BEING"
        ctx.fillStyle = "#f97316";
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.fillText("BEING", iconX + 40, iconY + 5);

        // Text "सात्विक" (Simulated with English style branding for Satwik)
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 32px Inter, sans-serif";
        ctx.fillText("SATWIK", iconX + 40, iconY + 40);

        // Draw the QR Code
        ctx.drawImage(img, 50, 140, 300, 300);

        // Footer Text
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 20px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(shopName.toUpperCase(), canvas.width / 2, 480);
        
        ctx.fillStyle = "#64748b";
        ctx.font = "14px Inter, sans-serif";
        ctx.fillText("OFFICIAL PARTNER • SATWIK UNIVERSE", canvas.width / 2, 510);
      }

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `SATWIK_QR_${shopName.replace(/\s+/g, '_')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
      <div className="flex items-center gap-2 mb-6">
        <div className="flex flex-col items-center">
           <span className="text-[10px] font-black text-orange-500 tracking-[0.2em] uppercase leading-none">Being</span>
           <span className="text-xl font-black text-slate-800 leading-none">SATWIK</span>
        </div>
      </div>
      <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 mb-6 group relative">
        <QRCodeSVG 
          value={url} 
          size={200} 
          level="H" 
          includeMargin={true}
          ref={svgRef}
        />
        <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
           <Download className="text-indigo-600 animate-bounce" size={32} />
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{shopName}</h3>
      <p className="text-slate-400 text-[11px] mb-6 text-center max-w-[220px] font-medium uppercase tracking-wider">
        Authorized Referral Point
      </p>
      <button
        onClick={downloadQR}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-slate-200"
      >
        <Download size={18} />
        Download Branded Kit
      </button>
    </div>
  );
};

export default QRCodeComponent;
