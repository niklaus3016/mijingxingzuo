import { ArrowLeft } from 'lucide-react';
import { PrivacyPolicyContent } from './PrivacyModal';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage = ({ onBack }: PrivacyPolicyPageProps) => {
  return (
    <div className="min-h-screen bg-[#050508]">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-[#0c0c14]/95 backdrop-blur-md border-b border-[#d4af37]/20 px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-[#d4af37]">隐私政策</h1>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        <PrivacyPolicyContent />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
