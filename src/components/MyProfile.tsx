import React from 'react';
import { CONSTELLATION_LIST } from '../data/constellations';
import { AppSettings } from '../types';
import { Shield, Sparkles, RefreshCw, Star } from 'lucide-react';

interface MyProfileProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onViewConstellation: (id: string) => void;
  onViewPrivacyPolicy: () => void;
}

export default function MyProfile({ settings, onUpdateSettings, onViewConstellation, onViewPrivacyPolicy }: MyProfileProps) {

  const handleMyConstellationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({ myConstellationId: e.target.value });
  };

  const selectedHomeConstellation = CONSTELLATION_LIST.find(c => c.id === settings.myConstellationId);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-5 text-left" id="my-profile-panel">
      
      {/* Home Star quick-pass card */}
      <div className="p-4 rounded-2xl bg-[#11111d]/75 border border-[#d4af37]/25 shadow-xl flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold flex items-center gap-1">
            <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
            <span>我的主星 (常用星座)</span>
          </div>
          {selectedHomeConstellation ? (
            <span className="text-base text-white font-bold mt-1 font-serif">
              {selectedHomeConstellation.basic.symbol} {selectedHomeConstellation.basic.name} · 【我的常驻本命宿曜】
            </span>
          ) : (
            <span className="text-xs text-slate-400 mt-1">尚未设置主星偏好</span>
          )}
          {selectedHomeConstellation && (
            <button 
              onClick={() => onViewConstellation(settings.myConstellationId)}
              className="text-[10px] text-[#d4af37] hover:text-[#f4d03f] font-semibold mt-2 underline font-serif"
            >
              一键直达专属命盘 →
            </button>
          )}
        </div>
        
        {/* Native Selector for Home Constellation */}
        <select
          value={settings.myConstellationId}
          onChange={handleMyConstellationChange}
          className="px-3 py-1.5 bg-slate-950 border border-slate-800/60 text-slate-200 text-xs rounded-xl focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] cursor-pointer h-9 shadow-inner"
        >
          <option value="" className="bg-[#11111d]">-- 选择星座 --</option>
          {CONSTELLATION_LIST.map(c => (
            <option key={c.id} value={c.id} className="bg-[#11111d]">{c.basic.symbol} {c.basic.name}</option>
          ))}
        </select>
      </div>

      {/* Common settings category list */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase px-1 font-serif">偏好设置</h4>
        
        <div className="flex flex-col rounded-2xl bg-[#11111d]/75 border border-[#d4af37]/10 p-1.5 gap-1.5">
          <div className="flex flex-col rounded-xl overflow-hidden">
            <div 
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/10 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[#d4af37]">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">隐私政策</span>
                  <span className="text-[10px] text-slate-400">隐私保障声明</span>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewPrivacyPolicy();
                }}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition select-none bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300`}
              >
                详细政策
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Application Information */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase px-1 font-serif">关于 APP</h4>
        
        <div className="rounded-2xl bg-[#11111d]/75 border border-[#d4af37]/15 p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-950 rounded-xl border border-[#d4af37]/20">
              <span className="text-2xl font-bold select-none leading-none">🔮</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-white font-serif">秘境星座 APP</span>
              <span className="text-[10px] text-slate-400">版本: V1.0</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-300 leading-relaxed text-justify">
            「秘境星座」是一款专门为安卓系统深度适配的星曜小工具。应用本着「极速响应、极简至美」的匠心原则，完整内置中国传统阴阳历和西方星轨算法，尊重并保护用户的隐私安全。
          </p>

          <hr className="border-slate-800/30" />

        </div>
      </div>

      {/* Design signoff slogan */}
      <div className="mt-4 flex flex-col items-center justify-center text-center gap-0.5 select-none opacity-45">
        <div className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-[#d4af37] font-bold">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>秘境星宿奥秘档案</span>
        </div>
      </div>

    </div>
  );
}
