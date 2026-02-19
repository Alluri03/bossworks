import { useState } from 'react';
import PlanSection from './components/PlanSection';
import TrackSection from './components/TrackSection';
import FundingSection from './components/FundingSection';
import FinanceSection from './components/FinanceSection';
import { Icons } from './components/Icons';
import { BUSINESS_PROFILE, EXECUTION_PROJECTS } from './data/appData';

// Count total active notifications across all track projects
const TRACK_NOTIFICATIONS = EXECUTION_PROJECTS
  .filter(p => p.status === 'active')
  .reduce((sum, p) => sum + (p.notifications || 0), 0);

const AI_HINTS = {
  plan:    'Ask me to help fill in any step of your plan…',
  track:   'I can break down any project into tasks…',
  finance: 'Ask me to estimate costs for your setup…',
};

const NAV_ITEMS = [
  { id: 'plan',    label: 'Plan',    Icon: Icons.Plan    },
  { id: 'track',   label: 'Track',   Icon: Icons.Track   },
  { id: 'finance', label: 'Budget', Icon: Icons.Finance },
  { id: 'funding', label: 'Funding', Icon: Icons.Funding },
];

/* ── AI prompt bar ──────────────────────────────────────────── */
function AIPromptBar({ section }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="ai-bar flex-shrink-0">
      <div className={`flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2 border transition-all ${focused ? 'border-brand-orange ring-2 ring-orange-100' : 'border-gray-200'}`}>
        <Icons.Sparkle size={14} className="text-brand-orange flex-shrink-0"/>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { if (!value) setFocused(false); }}
          placeholder={AI_HINTS[section]}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
        />
        {value && (
          <button
            onClick={() => setValue('')}
            className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 hover:bg-orange-600 active:scale-90 transition-all"
          >
            <Icons.Send size={13} className="text-white"/>
          </button>
        )}
      </div>
      {focused && !value && (
        <div className="mt-2 flex gap-1.5 flex-wrap animate-fade-in">
          {['Fill in this step', 'Suggest next step', 'Find competitors', 'Estimate costs'].map(hint => (
            <button
              key={hint}
              onMouseDown={() => setValue(hint)}
              className="text-[11px] font-medium bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-brand-orange px-2.5 py-1 rounded-full transition-all"
            >
              {hint}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main App ───────────────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState('plan');

  const renderSection = () => {
    switch (activeTab) {
      case 'plan':    return <PlanSection />;
      case 'track':   return <TrackSection />;
      case 'finance': return <FinanceSection />;
      case 'funding': return <FundingSection />;
      default:        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Phone frame */}
      <div
        className="relative flex flex-col bg-gray-50 overflow-hidden shadow-2xl"
        style={{ width: 393, height: 852, borderRadius: 44, border: '6px solid #1a1a1a' }}
      >
        {/* ── Orange header ── */}
        <div className="header-bg flex-shrink-0">
          {/* status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-0">
            <span className="text-xs font-semibold text-white/90">9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-2 rounded-sm border border-white/60 relative">
                <div className="absolute inset-0.5 right-1 bg-white/80 rounded-sm"/>
              </div>
            </div>
          </div>

          {/* business identity row */}
          <div className="flex items-center justify-between px-4 pt-3 pb-4">
            <div className="flex items-center gap-3">
              {/* Logo circle */}
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-sm">
                <span className="text-xl">{BUSINESS_PROFILE.emoji}</span>
              </div>
              <div>
                <div className="text-base font-bold text-white leading-tight">{BUSINESS_PROFILE.businessName}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="text-[11px] text-white/70">{BUSINESS_PROFILE.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Free plan badge */}
              <div className="bg-white/20 border border-white/30 rounded-full px-2.5 py-1">
                <span className="text-[10px] font-bold text-white">Free Plan</span>
              </div>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                <span className="text-sm font-bold text-white">S</span>
              </div>
            </div>
          </div>
        </div>


        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-hidden">
          {renderSection()}
        </div>

        {/* ── AI bar (hidden on Funding — it has its own chat input) ── */}
        {activeTab !== 'funding' && <AIPromptBar section={activeTab} />}

        {/* ── Bottom nav ── */}
        <div className="bg-white border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center">
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const active = activeTab === id;
              const hasNotif = id === 'track' && TRACK_NOTIFICATIONS > 0;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex flex-col items-center py-2 transition-all ${active ? 'text-brand-orange' : 'text-gray-400'}`}
                >
                  {/* Icon with iOS-style notification dot */}
                  <div className="relative mb-0.5">
                    <Icon size={22}/>
                    {hasNotif && !active && (
                      <div className="absolute -top-1 -right-1.5 flex items-center justify-center
                                      bg-red-500 rounded-full border-[1.5px] border-white
                                      min-w-[16px] h-[16px] px-[3px]">
                        <span className="text-white font-bold leading-none" style={{ fontSize: 9 }}>
                          {TRACK_NOTIFICATIONS}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold">{label}</span>
                  {/* iOS-style active dot below label */}
                  <div className={`mt-0.5 w-1 h-1 rounded-full transition-all ${active ? 'bg-brand-orange' : 'bg-transparent'}`}/>
                </button>
              );
            })}
          </div>
          <div style={{ height: 6 }}/>
        </div>
      </div>
    </div>
  );
}
