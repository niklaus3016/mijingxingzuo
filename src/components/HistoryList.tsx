import React, { useState } from 'react';
import { HistoryRecord } from '../types';
import { Compass, Trash2, Calendar, Sparkles, X, Check } from 'lucide-react';

interface HistoryListProps {
  records: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export default function HistoryList({ records, onSelectRecord, onDeleteRecord, onClearAll }: HistoryListProps) {
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const triggerClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmClearAll) {
      setConfirmClearAll(true);
    } else {
      onClearAll();
      setConfirmClearAll(false);
    }
  };

  const cancelClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmClearAll(false);
  };

  const triggerDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
    } else {
      onDeleteRecord(id, e);
      setConfirmDeleteId(null);
    }
  };

  const cancelDeleteRecord = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4" id="history-logs-panel">
      
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-white tracking-wide">最近查询记录 ({records.length}/10)</h3>
        {records.length > 0 && (
          <div className="flex items-center gap-1.5">
            {confirmClearAll ? (
              <div className="flex items-center gap-1 animate-fade-in">
                <button 
                  onClick={triggerClearAll}
                  className="text-[10px] text-white bg-red-600 hover:bg-red-500 font-bold px-2 py-1 rounded-md cursor-pointer transition flex items-center gap-0.5"
                >
                  <Check className="w-2.5 h-2.5" />
                  <span>确定清空</span>
                </button>
                <button 
                  onClick={cancelClearAll}
                  className="text-[10px] text-slate-400 bg-slate-800 hover:bg-slate-700 font-semibold px-2 py-1 rounded-md cursor-pointer transition flex items-center gap-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                  <span>取消</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={triggerClearAll}
                className="text-[10px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 px-2.5 py-1 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 rounded-lg cursor-pointer transition"
                id="clear-all-history-btn"
              >
                <Trash2 className="w-3 h-3" />
                <span>清空记录</span>
              </button>
            )}
          </div>
        )}
      </div>

      {records.length === 0 ? (
        <div className="p-10 bg-[#11111d]/75 rounded-2xl border border-[#d4af37]/20 backdrop-blur-md text-center flex flex-col items-center justify-center gap-2">
          <Calendar className="w-10 h-10 text-slate-600 animate-pulse" />
          <p className="text-xs text-slate-400 font-medium font-serif">暂无最近查询，快在首页查查吧！</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5" id="history-items-container">
          {records.map((rec) => (
            <div
              key={rec.id}
              onClick={() => {
                // Ignore click if confirming deletion to avoid misnavigation
                if (confirmDeleteId === rec.id) return;
                onSelectRecord(rec);
              }}
              className={`p-3.5 bg-[#11111d]/75 hover:bg-[#11111d] rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 group ${
                confirmDeleteId === rec.id ? 'border-red-500/35 bg-red-950/5' : 'border-[#d4af37]/10 hover:border-[#d4af37]/45'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Visual Accent symbol */}
                <div className="w-9 h-9 rounded-full bg-[#0c0c14] flex items-center justify-center border border-[#d4af37]/20 font-sans text-lg text-[#d4af37]" id={`history-symbol-avatar-${rec.id}`}>
                  {rec.constellationName.slice(0,1) === '双' || rec.constellationName.slice(0,1) === '处' ? '✨' : '⭐'}
                </div>
                
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-[#d4af37] font-sans transition">
                      {rec.constellationName}
                    </span>
                    <span className="text-[9px] px-1 py-0.5 rounded font-mono font-bold bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 scale-95">
                      {rec.isLunar ? '农历' : '公历'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block tracking-tight line-clamp-1">{rec.queryDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {confirmDeleteId === rec.id ? (
                  <div className="flex items-center gap-1 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => triggerDeleteRecord(rec.id, e)}
                      className="px-2 py-1 text-[9px] font-bold text-white bg-red-600 hover:bg-red-500 rounded cursor-pointer transition flex items-center gap-0.5"
                    >
                      <Check className="w-2.5 h-2.5" />
                      <span>确认删除</span>
                    </button>
                    <button
                      onClick={cancelDeleteRecord}
                      className="px-2 py-1 text-[9px] font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 rounded cursor-pointer transition flex items-center gap-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                      <span>取消</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-[9px] text-[#d4af37] font-serif hidden group-hover:block">查看命盘</span>
                    <button
                      onClick={(e) => triggerDeleteRecord(rec.id, e)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 cursor-pointer transition text-right"
                      title="删除此条"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Persistence Note */}
      <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1 mt-1 opacity-75">
        <Sparkles className="w-3 h-3 text-[#d4af37]" />
        <span>查询历史将本地安全缓存，尊重隐私且100%离线可用</span>
      </div>

    </div>
  );
}
