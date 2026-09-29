import React, { useEffect, useRef } from 'react';
import { Camera } from '../../types/surveillance';

interface CameraFeedCanvasProps {
  camera: Camera;
  isExpanded?: boolean;
}

export const CameraFeedCanvas: React.FC<CameraFeedCanvasProps> = ({ camera, isExpanded = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (camera.status === 'OFFLINE') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Render terrain according to feedType
      if (camera.feedType === 'desert') {
        // Desert / Arid Border outpost
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
        skyGrad.addColorStop(0, '#1c2838');
        skyGrad.addColorStop(1, '#2c3a4a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.6);

        // Distant mountains
        ctx.fillStyle = '#1e2633';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.6);
        ctx.lineTo(w * 0.25, h * 0.48);
        ctx.lineTo(w * 0.55, h * 0.52);
        ctx.lineTo(w * 0.85, h * 0.45);
        ctx.lineTo(w, h * 0.58);
        ctx.lineTo(w, h * 0.6);
        ctx.closePath();
        ctx.fill();

        // Desert ground
        const groundGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
        groundGrad.addColorStop(0, '#383b38');
        groundGrad.addColorStop(1, '#252924');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, h * 0.6, w, h * 0.4);

        // Metal Watchtower silhouette in distance
        ctx.strokeStyle = '#0f1721';
        ctx.lineWidth = 2.5;
        // Legs
        ctx.beginPath();
        ctx.moveTo(w * 0.65, h * 0.7);
        ctx.lineTo(w * 0.69, h * 0.32);
        ctx.lineTo(w * 0.73, h * 0.7);
        ctx.stroke();
        // Cross bracing
        ctx.beginPath();
        ctx.moveTo(w * 0.66, h * 0.55);
        ctx.lineTo(w * 0.72, h * 0.55);
        ctx.moveTo(w * 0.67, h * 0.42);
        ctx.lineTo(w * 0.71, h * 0.42);
        ctx.stroke();
        // Cabin
        ctx.fillStyle = '#131b26';
        ctx.fillRect(w * 0.675, h * 0.28, w * 0.05, h * 0.07);
        // Cabin roof & beacon
        ctx.beginPath();
        ctx.moveTo(w * 0.67, h * 0.28);
        ctx.lineTo(w * 0.70, h * 0.24);
        ctx.lineTo(w * 0.73, h * 0.28);
        ctx.fill();
        // Beacon pulse
        ctx.fillStyle = (Math.sin(tick * 0.05) > 0) ? '#00e5ff' : '#005577';
        ctx.beginPath();
        ctx.arc(w * 0.70, h * 0.23, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Security fence lines stretching across
        ctx.strokeStyle = '#1b2533';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 18) {
          ctx.beginPath();
          ctx.moveTo(x, h * 0.65);
          ctx.lineTo(x, h * 0.85);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(0, h * 0.7);
        ctx.lineTo(w, h * 0.7);
        ctx.moveTo(0, h * 0.78);
        ctx.lineTo(w, h * 0.78);
        ctx.stroke();

      } else if (camera.feedType === 'river') {
        // River border crossing
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        skyGrad.addColorStop(0, '#131f2d');
        skyGrad.addColorStop(1, '#233244');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.4);

        // Far river bank / trees
        ctx.fillStyle = '#1c2826';
        ctx.fillRect(0, h * 0.35, w, h * 0.12);

        // River water with subtle wave flow
        const waterGrad = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.85);
        waterGrad.addColorStop(0, '#162b3a');
        waterGrad.addColorStop(1, '#0e1c27');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, h * 0.45, w, h * 0.4);

        // Water ripples
        ctx.strokeStyle = '#224056';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
          const yWave = h * (0.5 + i * 0.06);
          const xOffset = (tick * 0.5 + i * 40) % w;
          ctx.beginPath();
          ctx.moveTo(xOffset, yWave);
          ctx.lineTo(xOffset + 40, yWave);
          ctx.stroke();
        }

        // Near shoreline
        ctx.fillStyle = '#2d332d';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.75);
        ctx.quadraticCurveTo(w * 0.5, h * 0.7, w, h * 0.82);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Figure walking on riverbank (PERSON)
        const personX = w * 0.48 + Math.sin(tick * 0.02) * 8;
        const personY = h * 0.52;
        ctx.fillStyle = '#0d151c';
        // Head
        ctx.beginPath();
        ctx.arc(personX, personY - 24, 4, 0, Math.PI * 2);
        ctx.fill();
        // Torso
        ctx.fillRect(personX - 3.5, personY - 19, 7, 14);
        // Legs
        ctx.beginPath();
        ctx.moveTo(personX - 2, personY - 5);
        ctx.lineTo(personX - 4 + Math.sin(tick * 0.1) * 3, personY + 12);
        ctx.moveTo(personX + 2, personY - 5);
        ctx.lineTo(personX + 4 - Math.sin(tick * 0.1) * 3, personY + 12);
        ctx.stroke();

      } else if (camera.feedType === 'forest') {
        // Forest Path with vehicle
        // Dense trees in background
        ctx.fillStyle = '#101a14';
        ctx.fillRect(0, 0, w, h);

        // Dirt road cutting diagonally through woods
        ctx.fillStyle = '#2b271d';
        ctx.beginPath();
        ctx.moveTo(w * 0.45, 0);
        ctx.lineTo(w * 0.55, 0);
        ctx.lineTo(w * 0.85, h);
        ctx.lineTo(w * 0.25, h);
        ctx.closePath();
        ctx.fill();

        // Tree trunks
        ctx.fillStyle = '#0b120d';
        for (let x of [w * 0.1, w * 0.22, w * 0.88, w * 0.95]) {
          ctx.fillRect(x, 0, w * 0.04, h);
        }

        // Vehicle on dirt path
        const vehX = w * 0.54;
        const vehY = h * 0.52;
        ctx.fillStyle = '#1a1e1b';
        // Vehicle chassis
        ctx.fillRect(vehX - 24, vehY - 14, 48, 26);
        // Roof
        ctx.fillStyle = '#0f1411';
        ctx.fillRect(vehX - 16, vehY - 22, 32, 10);
        // Headlights
        ctx.fillStyle = '#fff4cc';
        ctx.fillRect(vehX - 22, vehY + 2, 4, 4);
        ctx.fillRect(vehX + 18, vehY + 2, 4, 4);

      } else if (camera.feedType === 'checkpoint') {
        // Border Check Post with barrier and floodlights
        ctx.fillStyle = '#151c24';
        ctx.fillRect(0, 0, w, h);

        // Concrete asphalt road
        ctx.fillStyle = '#222933';
        ctx.fillRect(0, h * 0.4, w, h * 0.6);

        // Road lane markings
        ctx.fillStyle = '#596373';
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(w * 0.48, h * (0.45 + i * 0.14), w * 0.04, h * 0.08);
        }

        // Checkpoint booth
        ctx.fillStyle = '#0f1926';
        ctx.fillRect(w * 0.12, h * 0.28, w * 0.18, h * 0.35);
        ctx.strokeStyle = '#28466b';
        ctx.strokeRect(w * 0.12, h * 0.28, w * 0.18, h * 0.35);

        // Booth window with amber light
        ctx.fillStyle = '#d97706';
        ctx.fillRect(w * 0.15, h * 0.33, w * 0.12, h * 0.15);

        // Barrier gate arm (red/white stripes)
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(w * 0.3, h * 0.52);
        ctx.lineTo(w * 0.72, h * 0.52);
        ctx.stroke();

        // Floodlight pole & flare
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w * 0.8, h * 0.7);
        ctx.lineTo(w * 0.8, h * 0.18);
        ctx.stroke();
        // Light glow
        const spotGrad = ctx.createRadialGradient(w * 0.8, h * 0.18, 5, w * 0.5, h * 0.5, 120);
        spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        spotGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.18, 120, 0, Math.PI * 2);
        ctx.fill();

        // Person near barrier
        const pX = w * 0.48;
        const pY = h * 0.56;
        ctx.fillStyle = '#0a0f16';
        ctx.beginPath();
        ctx.arc(pX, pY - 26, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(pX - 4, pY - 20, 8, 16);
        ctx.fillRect(pX - 4, pY - 4, 3.5, 14);
        ctx.fillRect(pX + 0.5, pY - 4, 3.5, 14);

      } else if (camera.feedType === 'hillside') {
        // Hillside Sector with terrain contours & figures
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        skyGrad.addColorStop(0, '#101c2a');
        skyGrad.addColorStop(1, '#1e2b3c');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.4);

        // Multiple rolling hills
        ctx.fillStyle = '#1a221f';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.35);
        ctx.quadraticCurveTo(w * 0.35, h * 0.22, w, h * 0.4);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#262f27';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.55);
        ctx.quadraticCurveTo(w * 0.65, h * 0.38, w, h * 0.6);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Cluster of figures walking on hillside (PERSONS 78%)
        for (let i = 0; i < 3; i++) {
          const figX = w * 0.58 + i * 16;
          const figY = h * 0.56 + (i % 2) * 6;
          ctx.fillStyle = '#0c1218';
          ctx.beginPath();
          ctx.arc(figX, figY - 18, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(figX - 3, figY - 14, 6, 12);
        }
      }

      // Tactical Crosshair center reticle
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      const midX = w / 2;
      const midY = h / 2;
      ctx.beginPath();
      ctx.moveTo(midX - 10, midY);
      ctx.lineTo(midX - 3, midY);
      ctx.moveTo(midX + 3, midY);
      ctx.lineTo(midX + 10, midY);
      ctx.moveTo(midX, midY - 10);
      ctx.lineTo(midX, midY - 3);
      ctx.moveTo(midX, midY + 3);
      ctx.lineTo(midX, midY + 10);
      ctx.stroke();

      // Optical Corner Reticles
      const cornerSize = 12;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 1.5;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(8, 8 + cornerSize);
      ctx.lineTo(8, 8);
      ctx.lineTo(8 + cornerSize, 8);
      // Top-Right
      ctx.moveTo(w - 8 - cornerSize, 8);
      ctx.lineTo(w - 8, 8);
      ctx.lineTo(w - 8, 8 + cornerSize);
      // Bottom-Left
      ctx.moveTo(8, h - 8 - cornerSize);
      ctx.lineTo(8, h - 8);
      ctx.lineTo(8 + cornerSize, h - 8);
      // Bottom-Right
      ctx.moveTo(w - 8 - cornerSize, h - 8);
      ctx.lineTo(w - 8, h - 8);
      ctx.lineTo(w - 8, h - 8 - cornerSize);
      ctx.stroke();

      // Virtual Tripwire line if camera hasVirtualFence
      if (camera.hasVirtualFence) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.72);
        ctx.lineTo(w * 0.9, h * 0.72);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label on tripwire
        ctx.fillStyle = '#ef4444';
        ctx.font = '9px "Chakra Petch", sans-serif';
        ctx.fillText('⚡ VIRTUAL FENCE TRIPWIRE', w * 0.12, h * 0.70);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [camera, isExpanded]);

  if (camera.status === 'OFFLINE') {
    return (
      <div className="w-full h-full bg-[#0a101d] flex flex-col items-center justify-center relative overflow-hidden select-none">
        {/* Subtle diagonal offline stripes */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#ff0055_25%,transparent_25%,transparent_50%,#ff0055_50%,#ff0055_75%,transparent_75%,transparent)] [background-size:20px_20px]" />
        
        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <span className="text-xl font-bold text-rose-500 font-mono">!</span>
        </div>
        
        <div className="text-sm font-semibold tracking-wide text-rose-400 font-tech">
          Camera Offline
        </div>
        <div className="text-[11px] text-slate-500 font-mono-num mt-0.5">
          RTSP NO SIGNAL · PORT 554
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <canvas
        ref={canvasRef}
        width={isExpanded ? 800 : 380}
        height={isExpanded ? 450 : 214}
        className="w-full h-full object-cover"
      />
      {/* CCTV Scanlines layer */}
      <div className="absolute inset-0 cctv-scanline opacity-70" />
    </div>
  );
};
