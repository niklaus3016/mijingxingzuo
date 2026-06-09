import React, { useState, useRef, useEffect } from 'react';
import { ConstellationData } from '../types';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Compass } from 'lucide-react';

interface ConstellationWheelProps {
  constellation: ConstellationData;
}

export default function ConstellationWheel({ constellation }: ConstellationWheelProps) {
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);
  const [activeStar, setActiveStar] = useState<{ name: string; description: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartAngle = useRef<number>(0);
  const dragStartRotation = useRef<number>(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Auto slow rotate effect when idle to look mystical
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (!isDragging) {
        setRotation(prev => (prev + 0.05) % 360);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]);

  const getAngle = (clientX: number, clientY: number): number => {
    if (!wheelRef.current) return 0;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = clientX - centerX;
    const y = clientY - centerY;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return; // left click only
    setIsDragging(true);
    const angle = getAngle(e.clientX, e.clientY);
    dragStartAngle.current = angle;
    dragStartRotation.current = rotation;
    if (wheelRef.current) {
      wheelRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentAngle = getAngle(e.clientX, e.clientY);
    const angleDiff = currentAngle - dragStartAngle.current;
    setRotation((dragStartRotation.current + angleDiff) % 360);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (wheelRef.current) {
      wheelRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const handleStarClick = (starName: string | undefined, index: number) => {
    const rawClean = (starName || "").replace(/\s*\([A-Za-z\s0-9]+\)/g, '').trim();
    const finalName = rawClean || `星子 第${index + 1}号`;
    const energyPrisms = [
      '寄宿着守护星深邃而古老的星河意志。',
      '星辉交叠，激发白银般的精神指引。',
      '汇聚本源能量，折射至深潜心灵深处。',
      '命盘的核心锚点，承载性格的天赋徽章。',
      '恒常流转，是运势平衡中的静谧港湾。',
      '指引宿命中情感与人生的终极对视。'
    ];
    setActiveStar({
      name: finalName,
      description: `【${constellation.basic.name}】精巧汇聚的第 ${index + 1} 颗命运微星。此星子名为「${finalName}」，${energyPrisms[index % energyPrisms.length]}`
    });
  };

  // Convert stars coordinate to display layout based on center point (150, 150)
  const center = 150;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 bg-[#11111d]/75 backdrop-blur-md rounded-2xl border border-[#d4af37]/30 shadow-2xl relative overflow-hidden" id="constellation-star-wheel-card">
      
      {/* Decorative Compass Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-15 flex items-center justify-center">
        <Compass className="w-5/6 h-5/6 animate-spin-slow text-[#d4af37]" />
      </div>

      <div className="text-center mb-2 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/30 text-[#d4af37] text-xs font-mono tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>天体星盘图</span>
        </div>
        <h2 className="text-3xl font-serif text-[#d4af37] tracking-wide mt-1.5">
          {constellation.basic.name}
        </h2>
        <p className="text-xs text-slate-400 font-sans tracking-widest mt-0.5">【{constellation.basic.name}】 · 守护周期：{constellation.basic.dateRange}</p>
      </div>

      {/* Main Celestial Map Container */}
      <div 
        ref={wheelRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-[280px] h-[280px] rounded-full relative cursor-grab active:cursor-grabbing touch-none select-none overflow-hidden border-2 border-[#d4af37]/20 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-[#2a1b4d]/30 via-[#050508] to-[#11111d] shadow-inner flex items-center justify-center"
        style={{ touchAction: 'none' }}
        id="active-celestial-canvas"
      >
        {/* Glow effects inside sphere */}
        <div className="absolute w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Grids and circles */}
        <div className="absolute w-[95%] h-[95%] rounded-full border border-dashed border-[#d4af37]/10 pointer-events-none" />
        <div className="absolute w-[75%] h-[75%] rounded-full border border-slate-700/20 pointer-events-none" />
        <div className="absolute w-[50%] h-[50%] rounded-full border border-dashed border-[#d4af37]/15 pointer-events-none text-center flex items-center justify-center text-[#d4af37] text-8xl font-serif pointer-events-none select-none opacity-10">
          {constellation.basic.symbol}
        </div>

        {/* Diagonal coordinates line */}
        <div className="absolute inset-0 border-t border-slate-800/40 transform rotate-45 pointer-events-none" />
        <div className="absolute inset-0 border-t border-slate-800/40 transform -rotate-45 pointer-events-none" />
        <div className="absolute inset-0 border-t border-slate-800/20 transform rotate-90 pointer-events-none" />
        <div className="absolute inset-0 border-l border-slate-800/20 transform pointer-events-none" />

        {/* Rotatable/Zoomable Content */}
        <div 
          className="absolute w-full h-full transition-transform duration-75 ease-out"
          style={{ 
            transform: `rotate(${rotation}deg) scale(${zoom})`,
          }}
        >
          {/* Constellation Vector Lines */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 300 300">
            <g stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
              {constellation.lines.map(([p1, p2], idx) => {
                const s1 = constellation.stars[p1];
                const s2 = constellation.stars[p2];
                if (!s1 || !s2) return null;
                return (
                  <line 
                    key={idx} 
                    x1={s1.x} 
                    y1={s1.y} 
                    x2={s2.x} 
                    y2={s2.y} 
                    className="animate-pulse"
                    style={{ strokeDasharray: '4,4', animationDuration: '3s' }}
                  />
                );
              })}
            </g>
            
            {/* Glowing halos */}
            <g fill="none">
              {constellation.stars.map((star, idx) => (
                <circle 
                  key={`halo-${idx}`}
                  cx={star.x} 
                  cy={star.y} 
                  r={12 * (star.brightness || 1)} 
                  className="fill-indigo-500/10 stroke-indigo-500/5 stroke-[0.5]"
                />
              ))}
            </g>
          </svg>

          {/* Interactive Stars */}
          {constellation.stars.map((star, idx) => {
            const size = 10 + (star.brightness || 0.8) * 8;
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStarClick(star.name, idx);
                }}
                className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 group transition-all duration-300"
                style={{
                  left: `${star.x}px`,
                  top: `${star.y}px`,
                  width: `${size + 12}px`,
                  height: `${size + 12}px`,
                }}
                title={star.name ? star.name.replace(/\s*\([A-Za-z\s0-9]+\)/g, '') : `星子第${idx + 1}号`}
              >
                {/* Radiant Core */}
                <div 
                  className="bg-white rounded-full relative group-hover:scale-135 transition-all shadow-[0_0_10px_#fff,0_0_20px_var(--color-yellow-400)]"
                  style={{
                    width: `${size / 2.5}px`,
                    height: `${size / 2.5}px`,
                  }}
                />
                
                {/* Core Ring structure */}
                <div className="absolute w-[70%] h-[70%] rounded-full border border-yellow-300/30 group-hover:border-yellow-400/80 animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />

                {/* Star Tooltip Label (offset rotation so text is horizontal) */}
                {star.name && (
                  <div 
                    className="absolute text-[8px] text-yellow-100 bg-slate-950/80 border border-slate-700 px-1 py-0.5 rounded pointer-events-none hidden group-hover:block transition-all shadow-md z-30"
                    style={{
                      transform: `rotate(${-rotation}deg) translateY(-20px)`,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {star.name.replace(/\s*\([A-Za-z\s0-9]+\)/g, '')}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="w-full flex items-center justify-between mt-4 px-2 z-10 gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-[#1a1a2e]/60 px-3 py-1.5 rounded-full border border-slate-800/40 flex-1">
          <ZoomOut className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))} />
          <input 
            type="range" 
            min="0.6" 
            max="1.8" 
            step="0.05"
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-[#d4af37] h-1 rounded-lg bg-slate-800 cursor-pointer text-[#d4af37]"
          />
          <ZoomIn className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" onClick={() => setZoom(prev => Math.min(1.8, prev + 0.1))} />
        </div>

        {/* Rotation Preset Button */}
        <button 
          onClick={() => setRotation(0)}
          className="p-2 bg-[#1a1a2e]/60 rounded-full border border-slate-800/40 hover:bg-[#d4af37]/10 text-slate-300 hover:text-[#d4af37] transition"
          title="重置星盘角度"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Drag instruction helper */}
      <p className="text-[10px] text-slate-400/80 mt-2 hover:text-[#d4af37] transition flex items-center gap-1 font-mono tracking-wider">
        <span>☝️ 拖拽此星盘可自由旋转 · 点击星子探索宿命能量</span>
      </p>

      {/* Key Traits Bento Panel */}
      <div className="w-full grid grid-cols-2 gap-2 mt-4 z-10 text-xs">
        <div className="p-2.5 rounded-xl bg-[#11111d]/50 border border-slate-800/40 flex flex-col justify-between">
          <span className="text-[#d4af37]/75 font-semibold tracking-wider text-[10px] uppercase font-serif">守护星 & 守护神</span>
          <span className="text-white font-medium mt-1">
            {constellation.basic.rulingPlanet} · {constellation.basic.guardianGod.split(' ')[0]}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#11111d]/50 border border-slate-800/40 flex flex-col justify-between">
          <span className="text-[#d4af37]/75 font-semibold tracking-wider text-[10px] uppercase font-serif">能量属性 / 阴阳</span>
          <span className="text-white font-medium mt-1 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${
              constellation.basic.element === '火' ? 'bg-red-500' :
              constellation.basic.element === '土' ? 'bg-amber-600' :
              constellation.basic.element === '风' ? 'bg-blue-300' : 'bg-blue-600'
            }`} />
            {constellation.basic.element}象星座 · {constellation.basic.polarity}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#11111d]/50 border border-slate-800/40 flex flex-col justify-between">
          <span className="text-[#d4af37]/75 font-semibold tracking-wider text-[10px] uppercase font-serif">幸运色 & 石</span>
          <span className="text-white font-medium mt-1 truncate" title={constellation.life.luckyStone}>
            {constellation.life.luckyColor.split('、')[0]} | {constellation.life.luckyStone.split('、')[0]}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#11111d]/50 border border-slate-800/40 flex flex-col justify-between">
          <span className="text-[#d4af37]/75 font-semibold tracking-wider text-[10px] uppercase font-serif">幸运数字</span>
          <span className="text-white font-medium mt-1 font-mono">
            {constellation.life.luckyNumber.join(', ')}
          </span>
        </div>
      </div>

      {/* Spark star dialog popup */}
      {activeStar && (
        <div className="absolute inset-x-4 bottom-4 p-4 rounded-xl bg-[#0c0c14]/95 border border-[#d4af37]/40 z-20 shadow-2xl animate-fade-in flex flex-col gap-1.5">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
            <div className="flex items-center gap-1.5 text-[#d4af37] font-semibold text-xs font-serif">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeStar.name} 的启示</span>
            </div>
            <button 
              onClick={() => setActiveStar(null)}
              className="text-slate-400 hover:text-white font-bold text-xs px-1.5 py-0.5 rounded hover:bg-slate-800/40 transition"
            >
              关闭
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed text-left">
            {activeStar.description}
          </p>
        </div>
      )}
    </div>
  );
}
