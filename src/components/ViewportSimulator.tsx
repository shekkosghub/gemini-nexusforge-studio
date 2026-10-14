import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCw, Eye, EyeOff, Layers, Scissors, Box, ShieldCheck, Tag, Minimize2, Palette, Feather, Droplet, Sun, Trash2, Crop, FolderPlus, FileCode, CheckCircle2 } from 'lucide-react';
import { PlatformType, SimulatedControl } from '../types/addon';

interface ViewportSimulatorProps {
  platform: PlatformType;
  controls: SimulatedControl[];
  addonName: string;
}

export const ViewportSimulator: React.FC<ViewportSimulatorProps> = ({
  platform,
  controls,
  addonName,
}) => {
  // Common log state
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `[${platform.toUpperCase()} RUNTIME] Addon '${addonName}' initialized and registered successfully.`,
  ]);

  const addLog = (msg: string) => {
    setConsoleLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 9),
    ]);
  };

  // --- BLENDER SIMULATOR STATE ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [blenderAngleThreshold, setBlenderAngleThreshold] = useState(45);
  const [blenderSeamsMarked, setBlenderSeamsMarked] = useState(false);
  const [blenderBevelWeights, setBlenderBevelWeights] = useState(false);
  const [blenderShowCage, setBlenderShowCage] = useState(false);
  const [blenderAutoRotate, setBlenderAutoRotate] = useState(true);
  const rotationRef = useRef({ x: 0.5, y: 0.3 });

  // 3D Canvas render loop for Blender
  useEffect(() => {
    if (platform !== 'blender') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (blenderAutoRotate) {
        rotationRef.current.y += 0.012;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center coordinates
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = 75;

      // Draw grid floor
      ctx.strokeStyle = '#1e2433';
      ctx.lineWidth = 1;
      for (let i = -100; i <= 100; i += 25) {
        ctx.beginPath();
        ctx.moveTo(cx - 140, cy + 90 + i * 0.2);
        ctx.lineTo(cx + 140, cy + 90 + i * 0.2);
        ctx.stroke();
      }

      // Torus geometry simulation
      const R = 1.3;
      const r = 0.5;
      const numSegments = 18;
      const numTube = 12;

      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
        // Rotate around X
        const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        const fov = 300 / (300 + z2 * scale);
        return {
          px: cx + x1 * scale * fov,
          py: cy + y2 * scale * fov,
          depth: z2,
        };
      };

      // Draw Cage if enabled
      if (blenderShowCage) {
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let i = 0; i < numSegments; i += 2) {
          const u = (i / numSegments) * Math.PI * 2;
          for (let j = 0; j < numTube; j += 2) {
            const v = (j / numTube) * Math.PI * 2;
            const x = (R * 1.15 + (r * 1.15) * Math.cos(v)) * Math.cos(u);
            const y = (R * 1.15 + (r * 1.15) * Math.cos(v)) * Math.sin(u);
            const z = (r * 1.15) * Math.sin(v);
            const p = project(x, y, z);
            if (j === 0) ctx.moveTo(p.px, p.py);
            else ctx.lineTo(p.px, p.py);
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Main Torus Mesh Rings
      for (let i = 0; i < numSegments; i++) {
        const u = (i / numSegments) * Math.PI * 2;
        ctx.beginPath();

        let isSharpSeam = blenderSeamsMarked && (i === 0 || i === Math.floor(numSegments / 2));
        let isBevelEdge = blenderBevelWeights && (i % 3 === 0);

        if (isSharpSeam) {
          ctx.strokeStyle = '#ea580c'; // Blender Seam Orange
          ctx.lineWidth = 2.5;
        } else if (isBevelEdge) {
          ctx.strokeStyle = '#06b6d4'; // Cyan Bevel Weight
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = '#3b4760';
          ctx.lineWidth = 1;
        }

        for (let j = 0; j <= numTube; j++) {
          const v = (j / numTube) * Math.PI * 2;
          const x = (R + r * Math.cos(v)) * Math.cos(u);
          const y = (R + r * Math.cos(v)) * Math.sin(u);
          const z = r * Math.sin(v);
          const p = project(x, y, z);

          if (j === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();
      }

      // Draw cross-tube rings
      for (let j = 0; j < numTube; j++) {
        const v = (j / numTube) * Math.PI * 2;
        ctx.beginPath();
        ctx.strokeStyle = '#2b364d';
        ctx.lineWidth = 0.8;
        for (let i = 0; i <= numSegments; i++) {
          const u = (i / numSegments) * Math.PI * 2;
          const x = (R + r * Math.cos(v)) * Math.cos(u);
          const y = (R + r * Math.cos(v)) * Math.sin(u);
          const z = r * Math.sin(v);
          const p = project(x, y, z);
          if (i === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [platform, blenderAutoRotate, blenderSeamsMarked, blenderBevelWeights, blenderShowCage]);

  // --- ZBRUSH SIMULATOR STATE ---
  const [subtools, setSubtools] = useState([
    { id: 1, name: 'Creature_Torso', polycount: 485200, visible: true },
    { id: 2, name: 'Creature_Horns', polycount: 142000, visible: true },
    { id: 3, name: 'Creature_Teeth', polycount: 65100, visible: true },
    { id: 4, name: 'Armor_Plates', polycount: 320400, visible: false },
  ]);
  const [zbrushProcessing, setZbrushProcessing] = useState(false);

  // --- PROCREATE DRAWING CANVAS STATE ---
  const paintCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#8A3C1E'); // Burnt Sienna default
  const [brushSize, setBrushSize] = useState(16);
  const [brushOpacity, setBrushOpacity] = useState(0.85);
  const [strokeCount, setStrokeCount] = useState(0);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setStrokeCount((c) => c + 1);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = brushOpacity;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearPaintCanvas = () => {
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    addLog('Procreate canvas cleared.');
  };

  // --- PHOTOSHOP UXP SIMULATOR STATE ---
  const [psLayers, setPsLayers] = useState([
    { id: 1, name: 'spr_hero_idle', selected: true, bounds: '128x128px', status: 'ready' },
    { id: 2, name: 'spr_hero_attack', selected: true, bounds: '180x140px', status: 'ready' },
    { id: 3, name: 'ui_dialogue_box', selected: false, bounds: '640x220px', status: 'idle' },
    { id: 4, name: 'btn_play_active', selected: true, bounds: '96x42px', status: 'ready' },
  ]);
  const [slicedAssets, setSlicedAssets] = useState<string[]>([]);

  return (
    <div className="flex flex-col h-full bg-[#0c0f17] border border-[#1e2538] rounded-xl overflow-hidden shadow-xl">
      {/* Simulator Workspace Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#121622] border-b border-[#1e2538]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">
            {platform === 'blender' && 'Blender 4.2+ Viewport & N-Panel Simulator'}
            {platform === 'zbrush' && 'ZBrush 2024 ZScript Shelf & Subtool Workspace'}
            {platform === 'procreate' && 'Procreate 5.3 Interactive Stylus Stroke Studio'}
            {platform === 'photoshop' && 'Photoshop 2024 UXP Modal Runtime Panel'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 tabular-nums">
          <span>Active Simulation</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Visual Simulation Stage (8 cols) */}
        <div className="lg:col-span-7 bg-[#080a10] relative flex items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-[#1e2538] min-h-[360px]">
          {/* BLENDER 3D VIEWPORT */}
          {platform === 'blender' && (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <canvas
                ref={canvasRef}
                width={420}
                height={320}
                className="max-w-full h-auto rounded cursor-grab active:cursor-grabbing"
              />
              <div className="absolute top-2 left-2 flex items-center gap-2 text-[11px] text-slate-400 bg-[#0f131e]/80 backdrop-blur px-2.5 py-1 rounded border border-[#20293d]">
                <RotateCw className="w-3 h-3 text-amber-400 animate-spin" />
                <span>3D Viewport Turntable</span>
                <button
                  onClick={() => setBlenderAutoRotate(!blenderAutoRotate)}
                  className="ml-1 text-[10px] text-orange-400 hover:underline cursor-pointer"
                >
                  {blenderAutoRotate ? 'Pause' : 'Play'}
                </button>
              </div>

              {/* Viewport indicators */}
              <div className="absolute bottom-2 left-2 flex items-center gap-3 text-[10px] font-mono text-slate-400">
                {blenderSeamsMarked && (
                  <span className="flex items-center gap-1 text-orange-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    UV Seams Visible (Orange)
                  </span>
                )}
                {blenderBevelWeights && (
                  <span className="flex items-center gap-1 text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Bevel Weight (Cyan)
                  </span>
                )}
                {blenderShowCage && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    Displacement Cage Active
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ZBRUSH SUBTOOL STAGE */}
          {platform === 'zbrush' && (
            <div className="w-full h-full flex flex-col justify-between p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-[#1b2233] pb-2">
                <span className="font-semibold text-slate-200">Subtool Hierarchy:</span>
                <span className="font-mono text-slate-500 tabular-nums">
                  Total Points: {(subtools.reduce((acc, s) => acc + (s.visible ? s.polycount : 0), 0) / 1000).toFixed(1)}k
                </span>
              </div>

              <div className="space-y-1.5 my-3 overflow-y-auto max-h-[220px]">
                {subtools.map((subtool) => (
                  <div
                    key={subtool.id}
                    className="flex items-center justify-between p-2 rounded bg-[#0f1420] border border-[#1e2638] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSubtools(subtools.map(s => s.id === subtool.id ? { ...s, visible: !s.visible } : s));
                          addLog(`Toggled visibility for ${subtool.name}`);
                        }}
                        className="text-slate-500 hover:text-slate-200 cursor-pointer"
                      >
                        {subtool.visible ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`font-mono ${subtool.visible ? 'text-slate-200' : 'text-slate-600'}`}>
                        {subtool.name}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                      {subtool.polycount.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>

              {zbrushProcessing && (
                <div className="p-2.5 rounded bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300 flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <span>Executing ZScript Decimation Queue...</span>
                </div>
              )}
            </div>
          )}

          {/* PROCREATE INTERACTIVE STYLUS CANVAS */}
          {platform === 'procreate' && (
            <div className="w-full h-full flex flex-col items-center justify-between p-2">
              <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-[#1b2233]">
                <span>Draw on Canvas (Mouse or Stylus):</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 tabular-nums">{strokeCount} strokes</span>
                  <button
                    onClick={clearPaintCanvas}
                    className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Drawing Surface */}
              <div className="relative my-2 w-full flex justify-center">
                <canvas
                  ref={paintCanvasRef}
                  width={380}
                  height={220}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="rounded bg-[#f5f2eb] shadow-inner cursor-crosshair border border-[#3b3226]"
                />
              </div>

              {/* Swatch Quick Palette */}
              <div className="w-full flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Swatches:</span>
                  {['#2B1E16', '#8A3C1E', '#F4D388', '#F9F6EE', '#13293D', '#6C1B1E', '#4D533C'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setBrushColor(c)}
                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                        brushColor === c ? 'scale-125 border-white shadow-md' : 'border-black/30'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Size:</span>
                  <input
                    type="range"
                    min="4"
                    max="48"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-16 accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PHOTOSHOP UXP SLICER STAGE */}
          {platform === 'photoshop' && (
            <div className="w-full h-full flex flex-col justify-between p-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-[#1b2233] pb-2">
                <span className="font-semibold text-slate-200">Active Document Layers:</span>
                <span className="font-mono text-slate-500">1920 x 1080px (RGB/8)</span>
              </div>

              <div className="space-y-1.5 my-3 overflow-y-auto max-h-[180px]">
                {psLayers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-2 rounded bg-[#0f1420] border border-[#1e2638] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={layer.selected}
                        onChange={() => {
                          setPsLayers(psLayers.map(l => l.id === layer.id ? { ...l, selected: !l.selected } : l));
                        }}
                        className="rounded border-[#2d3850] accent-cyan-500 cursor-pointer"
                      />
                      <span className="font-mono text-slate-200">{layer.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 tabular-nums">{layer.bounds}</span>
                  </div>
                ))}
              </div>

              {slicedAssets.length > 0 && (
                <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300">
                  <div className="flex items-center gap-1.5 font-semibold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sliced {slicedAssets.length} trimmed asset sprites:</span>
                  </div>
                  <div className="flex flex-wrap gap-1 font-mono text-[10px] text-cyan-200">
                    {slicedAssets.map(a => (
                      <span key={a} className="bg-cyan-900/60 px-1.5 py-0.5 rounded">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Generated N-Panel / Controls Runner (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e121c] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1d2436] pb-2.5 mb-3">
              <span className="text-xs font-semibold text-slate-200">
                {platform === 'blender' && 'N-Panel: [HardSurface]'}
                {platform === 'zbrush' && 'Zplugin: [NexusForge Shelf]'}
                {platform === 'procreate' && 'Brush Studio Engine'}
                {platform === 'photoshop' && 'UXP Panel: [Asset Slicer]'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">v1.2.0</span>
            </div>

            {/* Simulated UI Controls Buttons */}
            <div className="space-y-2">
              {platform === 'blender' && (
                <>
                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Dihedral Angle:</span>
                      <span className="font-mono text-amber-400 tabular-nums">{blenderAngleThreshold}°</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      value={blenderAngleThreshold}
                      onChange={(e) => setBlenderAngleThreshold(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setBlenderSeamsMarked(true);
                      addLog(`Marked 36 edges as UV seams (Angle > ${blenderAngleThreshold}°)`);
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Scissors className="w-3.5 h-3.5 text-orange-400" />
                      <span>Auto Mark UV Seams</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">bpy.ops</span>
                  </button>

                  <button
                    onClick={() => {
                      setBlenderBevelWeights(true);
                      addLog(`Assigned vertex bevel weight = 1.0 to sharp edges`);
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Bevel Weights by Angle</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">bmesh</span>
                  </button>

                  <button
                    onClick={() => {
                      setBlenderShowCage(!blenderShowCage);
                      addLog(blenderShowCage ? 'Removed push cage' : 'Generated push bake cage with 0.02m inflation');
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Box className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{blenderShowCage ? 'Hide Bake Cage' : 'Generate Push Cage'}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">displace</span>
                  </button>
                </>
              )}

              {platform === 'zbrush' && (
                <>
                  <button
                    onClick={() => {
                      setSubtools(subtools.map(s => ({ ...s, name: `SM_${s.name.replace('SM_', '')}` })));
                      addLog('Renamed 4 subtools with prefix "SM_"');
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-blue-400" />
                      <span>Batch Prefix Subtools</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">[IButton]</span>
                  </button>

                  <button
                    onClick={() => {
                      setZbrushProcessing(true);
                      setTimeout(() => {
                        setSubtools(subtools.map(s => ({ ...s, polycount: Math.round(s.polycount * 0.2) })));
                        setZbrushProcessing(false);
                        addLog('Decimation Master completed. 80% point reduction applied.');
                      }, 1200);
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Decimate to 20k Target</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">[Decimate]</span>
                  </button>

                  <button
                    onClick={() => {
                      addLog('Polypaint transferred to 4096x4096px texture clone buffer');
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Palette className="w-3.5 h-3.5 text-purple-400" />
                      <span>Bake Polypaint to 4K</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">[Clone]</span>
                  </button>
                </>
              )}

              {platform === 'procreate' && (
                <>
                  <div className="p-2.5 rounded bg-[#151a26] border border-[#222b3d] text-xs space-y-2">
                    <span className="font-semibold text-slate-200">Active Preset Dynamics:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                      <div>Streamline: 35%</div>
                      <div>Jitter: 2%</div>
                      <div>Wet Mix Dilution: 25%</div>
                      <div>Grain: Linen Weave</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setBrushSize(32);
                      setBrushOpacity(0.95);
                      addLog('Selected Heavy Impasto Hog Bristle mode');
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Feather className="w-3.5 h-3.5 text-purple-400" />
                      <span>Heavy Impasto Bristle</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">.brushset</span>
                  </button>

                  <button
                    onClick={() => {
                      setBrushSize(20);
                      setBrushOpacity(0.4);
                      addLog('Selected Translucent Glaze Wash mode');
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Translucent Oil Glaze</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">tilt-aware</span>
                  </button>
                </>
              )}

              {platform === 'photoshop' && (
                <>
                  <button
                    onClick={() => {
                      const selected = psLayers.filter(l => l.selected).map(l => `${l.name}.png`);
                      setSlicedAssets(selected);
                      addLog(`Trimmed and exported ${selected.length} layers to /exports/`);
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Crop className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Trim & Slice Selected</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">batchPlay</span>
                  </button>

                  <button
                    onClick={() => {
                      setPsLayers(psLayers.map(l => ({ ...l, name: l.name.startsWith('ui_') || l.name.startsWith('spr_') ? l.name : `asset_${l.name}` })));
                      addLog('Applied standardized game engine layer naming prefix');
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sanitize Hierarchy Names</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">modal</span>
                  </button>

                  <button
                    onClick={() => {
                      addLog('Generated design-tokens.json from active swatch swatches');
                    }}
                    className="w-full p-2.5 rounded bg-[#171f2e] hover:bg-[#1f2a3e] border border-[#26324b] text-left text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-purple-400" />
                      <span>Export Color Tokens JSON</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">tokens</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Console / Operator Log Stream */}
          <div className="mt-4 pt-3 border-t border-[#1a2233]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
              <span>Software Console Output</span>
              <span className="text-emerald-400 font-sans text-[10px]">Active Session</span>
            </div>
            <div className="bg-[#080a10] border border-[#182030] rounded p-2 text-[10px] font-mono text-slate-300 space-y-1 max-h-24 overflow-y-auto">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
