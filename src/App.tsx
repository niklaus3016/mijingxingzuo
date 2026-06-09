import React, { useState } from 'react';
import { matchConstellationByDate, getConstellationById } from './data/constellations';
import { AppSettings, HistoryRecord, ConstellationData } from './types';
import ConstellationWheel from './components/ConstellationWheel';
import DateQuery from './components/DateQuery';
import EncyclopediaView from './components/EncyclopediaView';
import HistoryList from './components/HistoryList';
import MyProfile from './components/MyProfile';
import { PrivacyModal, AgreementModal, PrivacyPolicyContent, UserAgreementContent, DeclineModal } from './components/PrivacyModal';
import { Compass, BookOpen, Clock, User, Sparkles, Star } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'encyclopedia' | 'history' | 'my'>('home');
  
  // Privacy policy acceptance state
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(() => {
    return localStorage.getItem('mystic_const_privacy_accepted') === 'true';
  });
  
  // Modal states for agreement/privacy details
  const [showAgreementModal, setShowAgreementModal] = useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  
  // App preferences persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('mystic_const_settings');
    return saved ? JSON.parse(saved) : { myConstellationId: '', theme: 'dark' };
  });

  // Search History List (Latest 10)
  const [historyList, setHistoryList] = useState<HistoryRecord[]>(() => {
    const saved = localStorage.getItem('mystic_const_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Current focal constellation
  const [currentConstellation, setCurrentConstellation] = useState<ConstellationData>(() => {
    // Default: match based on today's actual calendar date (Dynamic season first load!)
    const today = new Date();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();
    return matchConstellationByDate(mm, dd);
  });

  // Sync settings of theme/home constellation back to storage
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('mystic_const_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Add a search record to history state
  const handleSearchResult = (constellation: ConstellationData, queryLabel: string, isLunar: boolean) => {
    setCurrentConstellation(constellation);
    
    const newRecord: HistoryRecord = {
      id: `record-${Date.now()}`,
      queryDate: queryLabel,
      isLunar,
      constellationId: constellation.id,
      constellationName: constellation.basic.name,
      timestamp: Date.now()
    };

    setHistoryList(prev => {
      // Eliminate duplicates pointing to identical date AND constellation combination
      const duplicateKey = `${constellation.id}-${queryLabel}`;
      const filtered = prev.filter(p => `${p.constellationId}-${p.queryDate}` !== duplicateKey);
      const updated = [newRecord, ...filtered].slice(0, 10);
      localStorage.setItem('mystic_const_history', JSON.stringify(updated));
      return updated;
    });

    // Jump directly to view star chart
    setActiveTab('home');
    
    // Automatically trigger visual focus anchors
    setTimeout(() => {
      const card = document.getElementById('constellation-star-wheel-card');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Actions for selecting past history logs
  const handleSelectHistory = (rec: HistoryRecord) => {
    const found = getConstellationById(rec.constellationId);
    if (found) {
      setCurrentConstellation(found);
      setActiveTab('home');
    }
  };

  // Action for deleting specific logs
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistoryList(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('mystic_const_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Clear all histories
  const handleClearHistoryAll = () => {
    setHistoryList([]);
    localStorage.removeItem('mystic_const_history');
  };

  // One-click home direct jump
  const handleViewConstellationDirect = (id: string) => {
    const found = getConstellationById(id);
    if (found) {
      setCurrentConstellation(found);
      setActiveTab('home');
    }
  };

  // Privacy policy handlers
  const handlePrivacyAccept = () => {
    localStorage.setItem('mystic_const_privacy_accepted', 'true');
    setHasAcceptedPrivacy(true);
  };

  const handlePrivacyDecline = () => {
    setShowDeclineModal(true);
  };

  const handleDeclineCancel = () => {
    setShowDeclineModal(false);
  };

  const handleDeclineConfirm = () => {
    // User declined - show a message and close
    setShowDeclineModal(false);
    // In a real app, you might redirect or close the app
    alert('您已拒绝隐私政策，无法使用本应用。');
  };

  const handleOpenAgreement = () => {
    setShowAgreementModal('agreement');
  };

  const handleOpenPrivacy = () => {
    setShowAgreementModal('privacy');
  };

  const handleCloseAgreementModal = () => {
    setShowAgreementModal(null);
  };

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center p-0 md:p-6 transition-all duration-300 bg-[#050508] md:bg-[#0c0c14]" id="core-application-wrapper">

      {/* Privacy Policy Modal - shown if user hasn't accepted */}
      {!hasAcceptedPrivacy && (
        <PrivacyModal
          onAccept={handlePrivacyAccept}
          onDecline={handlePrivacyDecline}
          onOpenAgreement={handleOpenAgreement}
          onOpenPrivacy={handleOpenPrivacy}
        />
      )}

      {/* Agreement/Privacy Detail Modal */}
      {showAgreementModal && (
        <AgreementModal
          onClose={handleCloseAgreementModal}
          title={showAgreementModal === 'agreement' ? '用户服务协议' : '隐私政策'}
          content={showAgreementModal === 'agreement' ? <UserAgreementContent /> : <PrivacyPolicyContent />}
        />
      )}

      {/* Decline Confirmation Modal */}
      {showDeclineModal && (
        <DeclineModal
          onCancel={handleDeclineCancel}
          onConfirm={handleDeclineConfirm}
        />
      )}

      {/* Main App Content - only shown after privacy acceptance */}
      {hasAcceptedPrivacy && (
        <>

      {/* Smartphone Outer Chassis Simulation for desktop view */}
      <div className="w-full max-w-md h-full md:h-[840px] md:max-h-[95vh] rounded-none md:rounded-[40px] shadow-none md:shadow-2xl overflow-hidden flex flex-col border-0 md:border-8 relative transition-all duration-300 bg-[#050508] text-[#e0e0e0] border-[#1a1a2e]" id="smartphone-bezel-device">
        
        {/* Ambient Top Glow when in dark mode */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#2a1b4d_0%,transparent_60%)] opacity-40 pointer-events-none z-0" />

        {/* Smartphone Status Bar Simulator (Visible only on desktop framing) */}
        <div className="hidden md:flex items-center justify-between px-6 py-2 select-none text-[10px] font-mono tracking-wider opacity-60 pointer-events-none mt-1 z-10">
          <span>{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
          <div className="w-16 h-4 bg-slate-900/80 rounded-full border border-slate-800 flex items-center justify-center mx-2 transform scale-90">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Global Floating Header */}
        <header className="px-4 py-3.5 pb-2.5 flex items-center justify-between border-b transition-colors duration-300 border-[#d4af37]/20 text-[#e0e0e0] bg-[#050508]/60 backdrop-blur-md z-10 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            <div className="flex flex-col text-left">
              <h1 className="text-lg font-serif font-black tracking-wider leading-none text-[#d4af37]">秘境星座</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct view of favorite home star shortcut if configured */}
            {settings.myConstellationId && (
              <button 
                onClick={() => handleViewConstellationDirect(settings.myConstellationId)}
                className="text-[10px] border px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 cursor-pointer transition animate-pulse text-[#d4af37] border-[#d4af37]/30 bg-[#d4af37]/5 hover:bg-[#d4af37]/10"
                title="直达我的星座"
              >
                <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
                <span>主星</span>
              </button>
            )}
          </div>
        </header>

        {/* Primary Scrollable Scroll Viewport */}
        <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-3 relative flex flex-col gap-5 pb-24" id="main-scrolling-content-portal">
          
          {/* Home Module Tab Panel */}
          {activeTab === 'home' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Home favorite star banner callout */}
              {settings.myConstellationId && settings.myConstellationId !== currentConstellation.id && (
                <div 
                  onClick={() => handleViewConstellationDirect(settings.myConstellationId)}
                  className="p-2 bg-yellow-500/5 border border-yellow-500/20 hover:bg-yellow-500/10 cursor-pointer rounded-xl flex items-center justify-between text-xs px-3 transition animate-pulse"
                >
                  <span className="text-yellow-400 text-[11px] font-semibold flex items-center gap-1.5 text-left">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>设置生效下：点击一键直达您的专属星盘</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">✨ 点击直达</span>
                </div>
              )}

              {/* Responsive interactive star-wheel rendering */}
              <ConstellationWheel constellation={currentConstellation} />

              {/* Home-tab secondary navigation trigger */}
              <div className="flex grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setActiveTab('encyclopedia')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-center font-bold relative flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>查看其百科全书</span>
                </button>
              </div>

              {/* Calendar search modules right below */}
              <DateQuery onSearchResult={handleSearchResult} />
            </div>
          )}

          {/* Complete Encyclopedia Portal Tab Panel */}
          {activeTab === 'encyclopedia' && (
            <div className="animate-fade-in flex flex-col gap-1">
              <EncyclopediaView 
                initialConstellation={currentConstellation} 
                onConstellationChange={(c) => setCurrentConstellation(c)}
              />
            </div>
          )}

          {/* History Search Logs Tab Panel */}
          {activeTab === 'history' && (
            <div className="animate-fade-in">
              <HistoryList 
                records={historyList} 
                onSelectRecord={handleSelectHistory} 
                onDeleteRecord={handleDeleteHistory}
                onClearAll={handleClearHistoryAll}
              />
            </div>
          )}

          {/* Settings & Core Metadata Tab Panel */}
          {activeTab === 'my' && (
            <div className="animate-fade-in">
              <MyProfile 
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onViewConstellation={handleViewConstellationDirect}
              />
            </div>
          )}

          {/* Spacer to guarantee scroll headroom above absolute bottom navigation */}
          <div className="h-28 w-full shrink-0" aria-hidden="true" />

        </div>

        {/* Immersive Smartphone Bottom Floating Dock/Navigation */}
        <nav className="absolute bottom-0 inset-x-0 py-2.5 px-4 flex items-center justify-around border-t transition-all duration-300 z-30 select-none bg-[#0c0c14]/95 border-[#d4af37]/20 shadow-[0_-10px_25px_rgba(0,0,0,0.6)] text-[#e0e0e0]" id="primary-dock-nav">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 flex-1 transition cursor-pointer ${
              activeTab === 'home' 
                ? 'text-[#d4af37] font-bold scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
            id="tab-home-btn"
          >
            <Compass className="w-[18px] h-[18px]" />
            <span className="text-[10px] tracking-tight">星盘查询</span>
          </button>

          <button 
            onClick={() => setActiveTab('encyclopedia')}
            className={`flex flex-col items-center gap-1 flex-1 transition cursor-pointer ${
              activeTab === 'encyclopedia' 
                ? 'text-[#d4af37] font-bold scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
            id="tab-wiki-btn"
          >
            <BookOpen className="w-[18px] h-[18px]" />
            <span className="text-[10px] tracking-tight">星座百科</span>
          </button>

          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 flex-1 transition cursor-pointer ${
              activeTab === 'history' 
                ? 'text-[#d4af37] font-bold scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
            id="tab-history-btn"
          >
            <Clock className="w-[18px] h-[18px]" />
            <span className="text-[10px] tracking-tight">查询历史</span>
          </button>

          <button 
            onClick={() => setActiveTab('my')}
            className={`flex flex-col items-center gap-1 flex-1 transition cursor-pointer ${
              activeTab === 'my' 
                ? 'text-[#d4af37] font-bold scale-105' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
            id="tab-profile-btn"
          >
            <User className="w-[18px] h-[18px]" />
            <span className="text-[10px] tracking-tight">秘境设定</span>
          </button>

        </nav>

        {/* Small Home indicator bar for Android simulator design */}
        <div className="absolute bottom-1 inset-x-0 flex justify-center pointer-events-none z-40 select-none pb-0.5">
          <div className="w-28 h-1 rounded-full bg-slate-800" />
        </div>

      </div>
        </>
      )}

    </div>
  );
}
