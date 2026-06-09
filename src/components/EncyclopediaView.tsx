import React, { useState } from 'react';
import { CONSTELLATION_LIST } from '../data/constellations';
import { ConstellationData } from '../types';
import { ShieldAlert, Heart, Briefcase, Award, Sparkles, Smile, Compass, LifeBuoy } from 'lucide-react';

interface EncyclopediaViewProps {
  initialConstellation: ConstellationData;
  onConstellationChange?: (constellation: ConstellationData) => void;
}

type TabType = 'basic' | 'personality' | 'love' | 'life' | 'career' | 'growth';

export default function EncyclopediaView({ initialConstellation, onConstellationChange }: EncyclopediaViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const currentConstellation = initialConstellation;

  const handleQuickSwitch = (c: ConstellationData) => {
    if (onConstellationChange) {
      onConstellationChange(c);
    }
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'basic', label: '星象基础', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'personality', label: '精细性格', icon: <Smile className="w-3.5 h-3.5" /> },
    { id: 'love', label: '情感特质', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'life', label: '生活奥秘', icon: <LifeBuoy className="w-3.5 h-3.5" /> },
    { id: 'career', label: '职场潜能', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'growth', label: '成长指南', icon: <Award className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4" id="encyclopedia-view-portal">
      
      {/* 12-Constellations 4x3 Grid Selector */}
      <div className="w-full flex flex-col gap-1.5 px-0.5 select-none animate-fade-in" id="constellation-encyclopedia-grid-wrapper">
        <label className="text-[10px] uppercase font-mono tracking-wider text-[#d4af37]/80 font-bold ml-1 text-left">
          快速切换其它星座
        </label>
        <div className="grid grid-cols-4 gap-1.5 w-full py-1" id="rapid-constellation-switcher-grid">
          {CONSTELLATION_LIST.map((c) => {
            const isSelected = c.id === currentConstellation.id;
            return (
              <button
                key={c.id}
                onClick={() => handleQuickSwitch(c)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/60 shadow-lg scale-102 font-serif'
                    : 'bg-[#11111d]/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700/80'
                }`}
                title={c.basic.name}
              >
                <span className="text-base leading-none">{c.basic.symbol}</span>
                <span className="text-[10px] tracking-tight">{c.basic.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Category Selector Tabs */}
      <div className="w-full bg-[#0c0c14]/95 rounded-xl border border-slate-800/40 p-1 grid grid-cols-3 gap-1 relative z-10" id="bento-category-tabs">
        {tabs.map((t) => {
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`py-2 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 font-serif'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Information Rendering viewport */}
      <div className="w-full p-5 bg-[#11111d]/75 rounded-2xl border border-[#d4af37]/20 backdrop-blur-md shadow-xl text-left relative overflow-hidden" id="details-view-container">
        
        {/* Tab content switcher */}
        {activeTab === 'basic' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-[#d4af37] font-bold text-sm font-serif">
               <Sparkles className="w-4.5 h-4.5" />
               <span>【{currentConstellation.basic.name}】基础档案</span>
             </div>
 
             <div className="grid grid-cols-2 gap-3 mt-1">
               <div className="p-2.5 rounded-xl bg-[#0c0c14]/90 border border-slate-800/40">
                 <span className="text-[10px] text-slate-500 block font-serif uppercase tracking-wider">公历范围</span>
                 <span className="text-white text-xs font-semibold mt-0.5 block">{currentConstellation.basic.dateRange}</span>
               </div>
               <div className="p-2.5 rounded-xl bg-[#0c0c14]/90 border border-slate-800/40">
                 <span className="text-[10px] text-slate-500 block font-serif uppercase tracking-wider">星象守护星</span>
                 <span className="text-white text-xs font-semibold mt-0.5 block">{currentConstellation.basic.rulingPlanet}</span>
               </div>
               <div className="p-2.5 rounded-xl bg-[#0c0c14]/90 border border-slate-800/40">
                 <span className="text-[10px] text-slate-500 block font-serif uppercase tracking-wider">神话守护神</span>
                 <span className="text-white text-xs font-semibold mt-0.5 block">{currentConstellation.basic.guardianGod}</span>
               </div>
               <div className="p-2.5 rounded-xl bg-[#0c0c14]/90 border border-slate-800/40">
                 <span className="text-[10px] text-slate-500 block font-serif uppercase tracking-wider">星盘阴阳性</span>
                 <span className="text-white text-xs font-semibold mt-0.5 block">{currentConstellation.basic.polarity}星</span>
               </div>
             </div>
 
             <div className="p-3.5 rounded-xl bg-[#d4af37]/5 border-l-2 border-[#d4af37] mt-1 flex flex-col gap-1">
               <span className="text-[10px] text-[#d4af37] font-bold font-serif tracking-wider uppercase">核心性格标签</span>
               <p className="text-slate-300 text-xs leading-relaxed font-sans">{currentConstellation.basic.keyPersonality}</p>
             </div>
 
             <div className="p-3.5 rounded-xl bg-indigo-500/[0.03] border-l-2 border-[#2a1b4d] flex flex-col gap-1">
               <span className="text-[10px] text-indigo-400 font-bold font-serif tracking-wider uppercase">最大特征勋章</span>
               <p className="text-slate-300 text-xs leading-relaxed font-sans">{currentConstellation.basic.coreTrait}</p>
             </div>
          </div>
        )}

        {activeTab === 'personality' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-[#d4af37] font-bold text-sm font-serif">
              <Smile className="w-4.5 h-4.5" />
              <span>性格解析大纲</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">星之特质（优点）</div>
              <div className="grid grid-cols-2 gap-2">
                {currentConstellation.personality.advantages.map((adv, i) => (
                  <div key={i} className="px-2.5 py-1.5 rounded-lg bg-green-500/5 border border-green-500/10 text-green-400 text-xs flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-green-400" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">逆光暗影（缺点）</div>
              <div className="grid grid-cols-2 gap-2">
                {currentConstellation.personality.disadvantages.map((dis, i) => (
                  <div key={i} className="px-2.5 py-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-xs flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    <span>{dis}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-800/60 my-1" />

            <div className="flex flex-col gap-1">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">整体性格洞察</div>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">{currentConstellation.personality.overall}</p>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">关键行为模式</div>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">{currentConstellation.personality.behaviorMode}</p>
            </div>
          </div>
        )}

        {activeTab === 'love' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
              <Heart className="w-4.5 h-4.5 text-rose-500" />
              <span>情感本源与缘分</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="text-xs text-slate-400 font-bold">核心爱情观</div>
              <blockquote className="p-3.5 bg-slate-950/60 rounded-xl border-l-[3px] border-rose-500 text-xs text-slate-300 font-medium leading-relaxed">
                "{currentConstellation.love.loveView}"
              </blockquote>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="text-xs text-slate-400 font-bold">择偶审美品味</div>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">{currentConstellation.love.preference}</p>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="text-xs text-slate-400 font-bold">亲密相处指南</div>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">{currentConstellation.love.guide}</p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mt-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-green-400 font-bold block mb-1">💯 心灵契合最配星座</span>
                <div className="flex flex-wrap gap-1">
                  {currentConstellation.love.bestMatches.map((m, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-green-500/10 text-green-300 rounded border border-green-500/20">{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-red-400 font-bold block mb-1">⚠️ 磨砺历练较难相处</span>
                <div className="flex flex-wrap gap-1">
                  {currentConstellation.love.worstMatches.map((m, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-red-500/10 text-red-300 rounded border border-red-500/20">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'life' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-[#d4af37] font-bold text-sm font-serif">
              <LifeBuoy className="w-4.5 h-4.5" />
              <span>日常生活启示录</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 rounded-xl bg-[#0c0c14]/90 border border-slate-800/40">
                <span className="text-[10px] text-slate-500 block font-medium font-serif uppercase">穿衣契合风格</span>
                <p className="text-[11px] text-slate-200 font-medium mt-1 leading-relaxed">{currentConstellation.life.outfit}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0c0c14]/90 border border-slate-800/40">
                <span className="text-[10px] text-slate-500 block font-medium font-serif uppercase">星辉解压指南</span>
                <p className="text-[11px] text-slate-200 font-medium mt-1 leading-relaxed">{currentConstellation.life.decompression}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="p-2.5 rounded-lg bg-[#0c0c14]/90 border border-slate-800/40 text-center">
                <span className="text-[9px] text-slate-500 block">能量幸运色</span>
                <span className="text-[11px] text-[#d4af37] font-semibold block mt-0.5 truncate" title={currentConstellation.life.luckyColor}>
                  {currentConstellation.life.luckyColor}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0c0c14]/90 border border-slate-800/40 text-center">
                <span className="text-[9px] text-slate-500 block">共鸣幸运数</span>
                <span className="text-[11px] text-[#d4af37] font-semibold block mt-0.5">
                  {currentConstellation.life.luckyNumber.slice(0, 3).join(', ')}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0c0c14]/90 border border-slate-800/40 text-center">
                <span className="text-[9px] text-slate-500 block">灵魂幸运石</span>
                <span className="text-[11px] text-[#d4af37] font-semibold block mt-0.5 truncate" title={currentConstellation.life.luckyStone}>
                  {currentConstellation.life.luckyStone}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'career' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-[#d4af37] font-bold text-sm font-serif">
              <Briefcase className="w-4.5 h-4.5" />
              <span>职场博弈与学习</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-xs text-slate-400 font-bold mb-1">最酷契合职业</div>
              <div className="flex flex-wrap gap-2">
                {currentConstellation.career.jobs.map((job, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#d4af37]/5 text-[#d4af37] text-xs rounded-xl border border-[#d4af37]/15 font-medium">💼 {job}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="text-xs text-slate-400 font-bold mb-0.5">王格职场优势</div>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">{currentConstellation.career.strengths}</p>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <div className="text-xs text-slate-400 font-bold mb-0.5">脑力学习特点</div>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">{currentConstellation.career.learningStyle}</p>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
              <Award className="w-4.5 h-4.5" />
              <span>灵魂蜕变指南</span>
            </div>

            <div className="p-3.5 rounded-xl bg-green-500/[0.02] border border-green-500/10 flex flex-col gap-1.5">
              <div className="text-xs text-green-400 font-bold flex items-center gap-1">
                <span>🌟 拓展飞升轨道</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">{currentConstellation.growth.direction}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-red-500/[0.02] border border-red-500/10 flex flex-col gap-1.5">
              <div className="text-xs text-red-400 font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>避坑避险雷区</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">{currentConstellation.growth.pitfalls}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
