import React, { useState, useEffect } from 'react';
import { solarToLunar, lunarToSolar, CHINESE_MONTHS, CHINESE_DAYS } from '../utils/lunar';
import { matchConstellationByDate } from '../data/constellations';
import { ConstellationData } from '../types';
import { Calendar, Search, ArrowRightLeft, Sparkles } from 'lucide-react';

interface DateQueryProps {
  onSearchResult: (constellation: ConstellationData, queryLabel: string, isLunar: boolean) => void;
}

export default function DateQuery({ onSearchResult }: DateQueryProps) {
  const [isLunar, setIsLunar] = useState<boolean>(false);
  
  // Year ranges
  const years = Array.from({ length: 101 }, (_, i) => 1950 + i); // 1950 to 2050
  
  // Selection States
  const [selectedYear, setSelectedYear] = useState<number>(2000);
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [isLeapMonth, setIsLeapMonth] = useState<boolean>(false);
  
  // Computed conversions (solar <-> lunar)
  const [resolvedSolar, setResolvedSolar] = useState<string>('');
  const [resolvedLunar, setResolvedLunar] = useState<string>('');
  const [resolvedConstellation, setResolvedConstellation] = useState<ConstellationData | null>(null);

  // Re-calculate results when any input changes
  useEffect(() => {
    try {
      if (!isLunar) {
        // Input: Solar. Output: Lunar + Constellation
        const lunarDate = solarToLunar(selectedYear, selectedMonth, selectedDay);
        const constellation = matchConstellationByDate(selectedMonth, selectedDay);
        
        setResolvedSolar(`公历: ${selectedYear}年${selectedMonth}月${selectedDay}日`);
        setResolvedLunar(`阴历: ${lunarDate.lunarYear}年 ${lunarDate.lunarMonthName}${lunarDate.lunarDayName} (${lunarDate.zodiac}年)`);
        setResolvedConstellation(constellation);
      } else {
        // Input: Lunar. Translate to Solar. Output: Solar + Constellation
        const solarDate = lunarToSolar(selectedYear, selectedMonth, selectedDay, isLeapMonth);
        const sYear = solarDate.getFullYear();
        const sMonth = solarDate.getMonth() + 1;
        const sDay = solarDate.getDate();
        
        const constellation = matchConstellationByDate(sMonth, sDay);
        const lunarInfo = solarToLunar(sYear, sMonth, sDay);
        
        setResolvedSolar(`公历: ${sYear}年${sMonth}月${sDay}日`);
        setResolvedLunar(`阴历: ${selectedYear}年 ${lunarInfo.lunarMonthName}${lunarInfo.lunarDayName} (${lunarInfo.zodiac}年)`);
        setResolvedConstellation(constellation);
      }
    } catch (e) {
      // Graceful fallback for invalid dates (e.g. Feb 30)
      setResolvedSolar('日期无效');
      setResolvedLunar('请检查农历/公历选择');
      setResolvedConstellation(null);
    }
  }, [isLunar, selectedYear, selectedMonth, selectedDay, isLeapMonth]);

  const handleSearch = () => {
    if (!resolvedConstellation) return;
    
    const displayLabel = isLunar ? resolvedLunar : resolvedSolar;
    onSearchResult(resolvedConstellation, displayLabel, isLunar);
  };

  // Days in month calculator for selected Year/Month (Solar only)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const solarDaysCount = getDaysInMonth(selectedYear, selectedMonth);

  // Clamp selectedDay if month capacity is exceeded
  useEffect(() => {
    if (!isLunar && selectedDay > solarDaysCount) {
      setSelectedDay(solarDaysCount);
    }
  }, [selectedYear, selectedMonth, solarDaysCount, isLunar]);

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-[#11111d]/75 rounded-2xl border border-[#d4af37]/20 backdrop-blur-md shadow-xl" id="lunar-solar-query-panel">
      
      {/* Selector Mode Tabs */}
      <div className="flex items-center justify-between p-1 bg-[#0c0c14]/95 rounded-xl border border-slate-800/40 mb-5 relative">
        <button
          onClick={() => {
            setIsLunar(false);
            setSelectedMonth(6);
            setSelectedDay(15);
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            !isLunar 
              ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 font-serif' 
              : 'text-slate-400 hover:text-white'
          }`}
          id="mode-solar-btn"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>阳历 (公历) 查询</span>
        </button>

        <button
          onClick={() => {
            setIsLunar(true);
            setSelectedMonth(5);
            setSelectedDay(15);
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            isLunar 
              ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 font-serif' 
              : 'text-slate-400 hover:text-white'
          }`}
          id="mode-lunar-btn"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>阴历 (农历) 查询</span>
        </button>
      </div>

      {/* Selector Wheels */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {/* Year Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">年份</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800/60 text-slate-200 text-sm rounded-xl focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] cursor-pointer h-10"
            id="year-native-selector"
          >
            {years.map(y => (
              <option key={y} value={y} className="bg-[#11111d]">{y} 年</option>
            ))}
          </select>
        </div>

        {/* Month Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">月份</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800/60 text-slate-200 text-sm rounded-xl focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] cursor-pointer h-10"
            id="month-native-selector"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m} className="bg-[#11111d]">
                {isLunar ? CHINESE_MONTHS[m - 1] : `${m} 月`}
              </option>
            ))}
          </select>
        </div>

        {/* Day Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">日期</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800/60 text-slate-200 text-sm rounded-xl focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] cursor-pointer h-10"
            id="day-native-selector"
          >
            {Array.from({ length: isLunar ? 30 : solarDaysCount }, (_, i) => i + 1).map(d => (
              <option key={d} value={d} className="bg-[#11111d]">
                {isLunar ? (CHINESE_DAYS[d - 1] || `${d}日`) : `${d} 日`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leap Month Option (Lunar mode only) */}
      {isLunar && (
        <div className="flex items-center gap-2 mb-6 px-1.5">
          <input 
            type="checkbox" 
            id="lunar-leap-checkbox"
            checked={isLeapMonth}
            onChange={(e) => setIsLeapMonth(e.target.checked)}
            className="w-4 h-4 rounded border-slate-800/60 text-[#d4af37] accent-[#d4af37] cursor-pointer focus:ring-0 focus:ring-offset-0 bg-slate-950"
          />
          <label htmlFor="lunar-leap-checkbox" className="text-xs text-slate-300 font-medium cursor-pointer select-none">
            该月属于“闰月” (特指阴历闰月年份)
          </label>
        </div>
      )}

      {/* Live Conversion Preview Card */}
      <div className="p-4 bg-[#0c0c14]/90 rounded-xl border border-[#d4af37]/15 mb-6 flex flex-col gap-2 relative">
        <div className="absolute right-3.5 top-3.5 pointer-events-none opacity-20">
          <Sparkles className="w-5 h-5 text-[#d4af37] animate-pulse" />
        </div>
        
        <div className="flex flex-col gap-0.5 text-left">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">阳历对照</div>
          <span className="text-xs text-slate-200 font-semibold">{resolvedSolar}</span>
        </div>

        <div className="h-px bg-slate-800/30 my-1" />

        <div className="flex flex-col gap-0.5 text-left">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">阴历对照</div>
          <span className="text-xs text-slate-200 font-semibold">{resolvedLunar}</span>
        </div>

        {resolvedConstellation && (
          <>
            <div className="h-px bg-slate-800/30 my-1" />
            <div className="flex items-center justify-between text-xs mt-1 bg-[#d4af37]/5 py-1.5 px-2.5 rounded-lg border border-[#d4af37]/20">
              <span className="text-[#d4af37] font-medium font-serif flex items-center gap-1.5">
                <span>✨ 匹配星座:</span>
                <span className="font-bold">{resolvedConstellation.basic.name}</span>
                <span className="text-slate-400 font-sans">({resolvedConstellation.basic.englishName})</span>
              </span>
              <span className="text-slate-400 font-mono text-[10px]">
                {resolvedConstellation.basic.symbol} {resolvedConstellation.basic.element}象
              </span>
            </div>
          </>
        )}
      </div>

      {/* View Constellation Trigger */}
      <button
        onClick={handleSearch}
        disabled={!resolvedConstellation}
        className="w-full py-3 px-4 bg-[#d4af37] hover:bg-[#f4d03f] text-[#050508] text-sm font-bold tracking-widest font-serif rounded-xl shadow-lg shadow-[#d4af37]/5 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        id="search-trigger-btn"
      >
        <Search className="w-4 h-4" />
        <span>查询星象 · 进入命盘</span>
      </button>

    </div>
  );
}
