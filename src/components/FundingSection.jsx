import { useState, useRef, useEffect } from 'react';
import {
  FUNDING_CHAT, FUNDING_OPPORTUNITIES, FUNDING_APPLICATION_STEPS,
  FINANCIAL_PLAN_DATA, FUNDING_PROJECTS, FUNDING_PROJECT_TASKS,
} from '../data/appData';
import { Icons } from './Icons';

/* ─── Funding AI drafts ──────────────────────────────────────── */
const FUNDING_AI_DRAFTS = {
  'fas-1-2': {
    businessOverview: 'Ramen Shop is a tonkotsu-first Japanese restaurant opening on South Congress Ave, Austin TX. We serve locally sourced Berkshire pork broth ramen with dine-in, takeout, and catering. Our target customer is the food-curious young professional aged 25–38 in South Austin who currently has no authentic ramen option within 5 miles.',
    communityImpact:  'We will hire 8–10 South Austin residents, source from 2 local farms within 60 miles, and become an anchor tenant supporting foot traffic on SoCo. We plan to participate in Austin Food & Wine Festival and partner with local schools for culinary apprenticeships.',
    fundUseDetail:    'Funds will cover kitchen fit-out ($35k), equipment ($45k), and working capital for the first 3 months of operations while we scale to break-even at Month 6.',
  },
  'fas-1-3': {
    taxId:      'EIN application in progress with IRS (Form SS-4 submitted Jan 2025)',
    bizAddress: '1234 South Congress Ave, Austin, TX 78704 (lease pending signature)',
    ownerDemo:  'Founder is an immigrant entrepreneur (Asian-American). Business will be >51% minority-owned.',
  },
  'fas-2-2': {
    austinAddress:  '1234 South Congress Ave, Austin, TX 78704',
    employeeCount:  '0 current (pre-open). Planned: 10 FTE within 90 days of opening.',
    annualRevenue:  '$0 (pre-revenue startup, opening Q2 2025)',
  },
  'fas-3-2': {
    personalAssets:      'Primary residence equity ~$180k, savings $42k, retirement accounts $65k. Total: ~$287k.',
    personalLiabilities: 'Mortgage balance $310k, auto loan $8k, student loans $0. Total: ~$318k.',
    creditScore:         '715 (Experian, pulled Jan 2025)',
  },
  'fas-5-2': {
    businessDescription: 'Ramen Shop is a tonkotsu-first Japanese restaurant opening in South Austin, TX serving house-made 18-hour pork broth ramen bowls with local Berkshire pork. We combine dine-in, takeout, and third-party delivery to serve the underserved South Congress corridor.',
    marketOpportunity:   'No authentic ramen restaurant exists within 5 miles of our target location. The South Austin food market generates $12M annually with no Japanese-first operator. We project $720k Year 1 revenue at 70 covers/day.',
    competitiveEdge:     'Local pork sourcing story, open-kitchen format, late-night hours (until midnight Fri/Sat), and delivery-optimized packaging — no competitor offers all four.',
  },
};

/* ─── Purple theme constants ─────────────────────────────────── */
const PURPLE = '#7C3AED';
const PRIORITY_DOT_FUNDING = { high: 'bg-red-400', medium: 'bg-violet-400', low: 'bg-gray-300' };

/* ─── Chat sub-components ────────────────────────────────────── */
function EmbeddedQuestion({ question, selectedOption, onSelect, onContinue }) {
  return (
    <div className="mt-3 bg-white rounded-xl border border-gray-200 p-3">
      <div className="text-sm font-semibold text-gray-800 mb-2">{question.prompt}</div>
      <div className="space-y-2">
        {question.options.map(opt => {
          const isSelected = selectedOption === opt;
          return (
            <button key={opt} onClick={() => onSelect(opt)}
              className={`w-full flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all text-left ${
                isSelected ? 'border-brand-orange bg-orange-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'border-brand-orange' : 'border-gray-300'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-brand-orange"/>}
              </div>
              <span className={`text-sm ${isSelected ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{opt}</span>
            </button>
          );
        })}
      </div>
      {selectedOption && (
        <button onClick={onContinue} className="btn-primary w-full mt-3">Continue</button>
      )}
    </div>
  );
}

function DateSeparator({ label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-100"/>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-px bg-gray-100"/>
    </div>
  );
}

function AssistantMessage({ msg, selectedOption, onSelect, onContinue }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 shadow-sm">
        <Icons.Sparkle size={14} className="text-white"/>
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5">
          <p className="text-sm text-gray-800 leading-relaxed">{msg.text}</p>
          {msg.contextNote && <p className="text-xs italic text-gray-400 mt-1">{msg.contextNote}</p>}
          {msg.question && (
            <EmbeddedQuestion question={msg.question} selectedOption={selectedOption}
              onSelect={onSelect} onContinue={onContinue}/>
          )}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ text }) {
  return (
    <div className="flex justify-end">
      <div className="bg-brand-orange text-white rounded-2xl rounded-tr-sm px-3 py-2 text-sm max-w-[80%] leading-relaxed shadow-sm">
        {text}
      </div>
    </div>
  );
}

/* ─── FundingChatView (existing chat, wrapped) ───────────────── */
function FundingChatView({ onBack }) {
  const [messages,         setMessages]         = useState(FUNDING_CHAT);
  const [input,            setInput]            = useState('');
  const [selectedOption,   setSelectedOption]   = useState(null);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleContinue() {
    if (!selectedOption) return;
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: selectedOption },
      {
        id: `asst-${Date.now()}`, role: 'assistant',
        text: `Great choice! Let me find the best ${selectedOption.toLowerCase()} opportunities for your Ramen Shop in South Austin. I'll look at your business profile and match you with the most relevant options.`,
        contextNote: null, question: null,
      },
    ]);
    setQuestionAnswered(true);
    setSelectedOption(null);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text },
      {
        id: `asst-reply-${Date.now()}`, role: 'assistant',
        text: "Thanks for that! I'm researching funding options tailored to your profile. I'll have some recommendations for you shortly.",
        contextNote: null, question: null,
      },
    ]);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Back header */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <Icons.ChevronRight size={14} className="rotate-180"/>
          Funding Hub
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-4">
        {messages.length > 0 && messages[0].dateLabel && <DateSeparator label="Today"/>}
        {messages.map(msg => {
          if (msg.role === 'assistant') {
            const isFirstQ = msg.question && !questionAnswered;
            return (
              <AssistantMessage key={msg.id} msg={msg}
                selectedOption={isFirstQ ? selectedOption : null}
                onSelect={isFirstQ ? setSelectedOption : null}
                onContinue={isFirstQ ? handleContinue : null}/>
            );
          }
          if (msg.role === 'user') return <UserMessage key={msg.id} text={msg.text}/>;
          return null;
        })}
        <div ref={messagesEndRef}/>
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`flex-1 flex items-center gap-2 bg-gray-50 border rounded-2xl px-3 py-2.5 transition-all ${input ? 'border-brand-orange ring-2 ring-orange-100' : 'border-gray-200'}`}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Ask about grants, loans, investors…"
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"/>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-all">
              <Icons.Mic size={15} className="text-gray-400"/>
            </button>
          </div>
          <button onClick={handleSend}
            className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 hover:bg-orange-600 active:scale-90 transition-all shadow-sm">
            <Icons.Send size={15} className="text-white"/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── FundingProjectCard ─────────────────────────────────────── */
function FundingProjectCard({ project, onClick }) {
  const pct = project.totalTasks > 0
    ? Math.round((project.completedTasks / project.totalTasks) * 100) : 0;
  const statusLabel = project.status === 'in-progress' ? 'In Progress' : 'To Do';
  const statusStyle = project.status === 'in-progress'
    ? 'bg-violet-50 text-violet-700' : 'bg-gray-100 text-gray-400';

  return (
    <div
      className="card cursor-pointer hover:shadow-md active:scale-[0.98] transition-all relative flex-shrink-0 flex flex-col"
      style={{ width: 160, scrollSnapAlign: 'start', borderTop: `3px solid ${PURPLE}` }}
      onClick={onClick}
    >
      {project.notifications > 0 && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center
                        bg-red-500 rounded-full border-[1.5px] border-white
                        min-w-[16px] h-[16px] px-[3px]">
          <span className="text-white font-bold leading-none" style={{ fontSize: 9 }}>
            {project.notifications}
          </span>
        </div>
      )}
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
           style={{ backgroundColor: `${PURPLE}18` }}>
        <Icons.Funding size={16} style={{ color: PURPLE }}/>
      </div>
      {/* Name */}
      <div className="text-[13px] font-semibold text-gray-800 leading-snug mb-1.5" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {project.name}
      </div>
      {/* Status badge */}
      <span className={`badge text-[10px] self-start mb-2 ${statusStyle}`}>{statusLabel}</span>
      {/* Progress */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400">{project.completedTasks}/{project.totalTasks} tasks</span>
          <span className="text-[10px] font-bold" style={{ color: PURPLE }}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: PURPLE }}/>
        </div>
      </div>
    </div>
  );
}

/* ─── FundingTaskRow ─────────────────────────────────────────── */
function FundingTaskRow({ task, done, onToggle }) {
  const isExtractPlan = task.title === 'Extract Business Plan';
  return (
    <div className={`card flex items-start gap-3 transition-all ${done ? 'opacity-50' : ''}`}>
      <button
        className="w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 transition-all"
        style={{ backgroundColor: done ? PURPLE : 'transparent', borderColor: done ? PURPLE : '#D1D5DB' }}
        onClick={onToggle}
      >
        {done && <Icons.Check size={10} className="text-white"/>}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium leading-snug mb-1.5 ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </div>
        <div className="flex items-center gap-2">
          {isExtractPlan && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${PURPLE}15`, color: PURPLE }}>
              From Business Plan
            </span>
          )}
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT_FUNDING[task.priority]}`}/>
          <span className="text-[10px] text-gray-400 capitalize">{task.priority}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── FundingProjectDetailView ───────────────────────────────── */
function FundingProjectDetailView({ project, onBack, onExplore }) {
  const tasks = FUNDING_PROJECT_TASKS[project.id] || [];
  const [done, setDone] = useState(() =>
    Object.fromEntries(tasks.filter(t => t.status === 'done').map(t => [t.id, true]))
  );
  const completedCount = tasks.filter(t => done[t.id]).length;
  const pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...tasks].sort((a, b) => {
    const aDone = !!done[a.id], bDone = !!done[b.id];
    if (aDone !== bDone) return aDone ? 1 : -1;
    return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 pt-3">
        <button onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <Icons.ChevronRight size={14} className="rotate-180"/>
          Funding Projects
        </button>

        {/* Summary card */}
        <div className="card" style={{ borderLeft: `3px solid ${PURPLE}` }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="font-bold text-gray-800 leading-snug flex-1">{project.name}</div>
            <span className="badge text-[10px]"
                  style={{ backgroundColor: `${PURPLE}15`, color: PURPLE }}>{project.type}</span>
          </div>
          <div className="text-xs text-gray-400 mb-3">
            {project.amount} &middot; Due {project.deadline}
          </div>
          <div className="flex items-center gap-2">
            <div className="progress-bar flex-1">
              <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: PURPLE }}/>
            </div>
            <span className="text-[11px] font-bold" style={{ color: PURPLE }}>{pct}%</span>
            <span className="text-[11px] text-gray-400">{completedCount}/{tasks.length}</span>
          </div>
        </div>

        <div className="section-label px-1">Tasks</div>

        {sorted.map(task => (
          <FundingTaskRow key={task.id} task={task} done={!!done[task.id]}
            onToggle={() => setDone(prev => ({ ...prev, [task.id]: !prev[task.id] }))}/>
        ))}

        {/* Explore CTA card */}
        <div className="card" style={{ borderLeft: `3px solid ${PURPLE}` }}>
          <div className="flex items-center gap-2 mb-2">
            <Icons.Sparkle size={14} style={{ color: PURPLE }}/>
            <span className="text-sm font-semibold text-gray-800">Find More Funding</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Explore more grants, loans, and opportunities matched to your business.
          </p>
          <button onClick={onExplore}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white active:scale-95 transition-all"
            style={{ backgroundColor: PURPLE }}>
            <Icons.Sparkle size={13} className="text-white"/>
            Explore Funding Opportunities
          </button>
        </div>
        <div style={{ height: 8 }}/>
      </div>
    </div>
  );
}

/* ─── FundingCard ────────────────────────────────────────────── */
const TYPE_COLORS = {
  Grant:       'bg-green-50 text-green-600',
  Loan:        'bg-amber-50 text-amber-700',
  Scholarship: 'bg-indigo-50 text-indigo-600',
};

function matchScoreStyle(score) {
  if (score >= 80) return 'bg-green-50 text-green-600';
  if (score >= 65) return 'bg-orange-50 text-brand-orange';
  return 'bg-gray-100 text-gray-400';
}

function statusClass(status) {
  if (status === 'Apply Now') return 'status-complete';
  if (status === 'Needs Plan v1.0' || status === 'Needs Plan v0.5') return 'status-progress';
  return 'status-todo';
}

function FundingCard({ opportunity, onClick }) {
  return (
    <div className="card cursor-pointer hover:shadow-md active:scale-[0.98] transition-all" onClick={onClick}>
      {/* Top row: type badge + match */}
      <div className="flex items-center justify-between mb-1.5">
        <span className={`badge ${TYPE_COLORS[opportunity.type] || 'bg-gray-100 text-gray-500'}`}>
          {opportunity.type}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${matchScoreStyle(opportunity.match)}`}>
          {opportunity.match}% Match
        </span>
      </div>

      {/* Name */}
      <div className="text-sm font-semibold text-gray-800 leading-snug mb-1">{opportunity.name}</div>

      {/* Amount + deadline row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gray-700">{opportunity.amount}</span>
        <span className="text-[10px] text-gray-400">·</span>
        <span className="text-xs text-gray-400">Due {opportunity.deadline}</span>
      </div>

      {/* Status + chevron */}
      <div className="flex items-center justify-between">
        <span className={statusClass(opportunity.status)}>{opportunity.status}</span>
        <Icons.ChevronRight size={14} className="text-gray-300"/>
      </div>
    </div>
  );
}

/* ─── FundingHubView ─────────────────────────────────────────── */
function FundingHubView({ onExplore, onSelectFunding, onSelectProject }) {
  const [activeTab, setActiveTab] = useState('Grants');
  const tabTypeMap = { Grants: 'Grant', Loans: 'Loan', Investment: null };
  const filtered = activeTab === 'Investment'
    ? []
    : FUNDING_OPPORTUNITIES.filter(opp => opp.type === tabTypeMap[activeTab]);
  const sorted = [...filtered].sort((a, b) => b.match - a.match);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">

        {/* Funding Projects — horizontal scroll */}
        <div className="pt-4 pb-2">
          <div className="section-label px-5 mb-2">Funding Projects</div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide"
               style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {FUNDING_PROJECTS.map(proj => (
              <FundingProjectCard key={proj.id} project={proj} onClick={() => onSelectProject(proj)}/>
            ))}
          </div>
        </div>

        {/* Explore Funding CTA */}
        <div className="px-4 pb-3">
          <button onClick={onExplore}
            className="w-full flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5
                       hover:border-brand-orange hover:bg-orange-50 transition-all active:scale-[0.98]">
            <Icons.Sparkle size={14} className="text-brand-orange flex-shrink-0"/>
            <span className="flex-1 text-sm text-gray-400 text-left">Ask AI to find more opportunities...</span>
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Icons.Send size={13} className="text-white"/>
            </div>
          </button>
        </div>

        {/* Tab bar */}
        <div className="px-4">
          <div className="flex border-b border-gray-200">
            {['Grants', 'Loans', 'Investment'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'text-gray-900 border-b-2 border-gray-900 -mb-px'
                    : 'text-gray-400 hover:text-gray-600'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="px-4 pt-3 pb-4 space-y-3">
          {sorted.length > 0 && (
            <div className="text-xs text-gray-500 font-medium px-1">
              {sorted.length} {sorted.length === 1 ? 'opportunity' : 'opportunities'} matched to your business
            </div>
          )}
          {activeTab === 'Investment' && (
            <div className="card flex flex-col items-center py-8 text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm font-semibold text-gray-600 mb-1">Investment Coming Soon</div>
              <div className="text-xs text-gray-400 leading-relaxed">
                We're building connections to angel investors and VCs.
              </div>
            </div>
          )}
          {sorted.map(opp => (
            <FundingCard key={opp.id} opportunity={opp} onClick={() => onSelectFunding(opp)}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── FundingContextCard (Step 1 — always expanded) ─────────── */
function FundingContextCard() {
  const { estimatedBudget, breakEvenMonth } = FINANCIAL_PLAN_DATA;

  const contextFields = [
    { label: 'Business',     value: 'Ramen Shop — South Austin, TX' },
    { label: 'Model',        value: 'Dine-in · Takeout · Catering' },
    { label: 'Target',       value: 'Young professionals 25–38' },
    { label: 'Break-Even',   value: `Month ${breakEvenMonth} at ~70 covers/day` },
    { label: 'Budget Need',  value: `$${(estimatedBudget/1000).toFixed(0)},000 total` },
  ];

  return (
    <div className="card border-l-4 border-brand-green">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="step-num flex-shrink-0 bg-brand-green text-white">
            <Icons.Check size={13} className="text-white"/>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">Step 1: Business Plan Context</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Auto-pulled from your plan</div>
          </div>
        </div>
        <span className="status-complete">Complete</span>
      </div>

      {/* Context fields */}
      <div className="space-y-1.5 mb-3">
        {contextFields.map(({ label, value }) => (
          <div key={label} className="flex gap-2">
            <span className="text-[11px] text-gray-400 font-medium w-20 flex-shrink-0">{label}</span>
            <span className="text-[11px] text-gray-700">{value}</span>
          </div>
        ))}
      </div>

      {/* Orange banner */}
      <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl p-2.5">
        <Icons.Sparkle size={12} className="text-brand-orange mt-0.5 flex-shrink-0"/>
        <p className="text-xs text-orange-700 leading-snug">
          This context is automatically shared with your application. Keep your Business Plan updated.
        </p>
      </div>
    </div>
  );
}

/* ─── FundingStepCard (Steps 2+) ─────────────────────────────── */
function FundingStepCard({ step, isOpen, onToggle }) {
  const [mode, setMode]           = useState(null);
  const [values, setValues]       = useState(() =>
    Object.fromEntries((step.fields || []).map(f => [f.key, f.value || '']))
  );
  const [aiDone, setAiDone]       = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const done = step.status === 'complete';

  function handleAIDraft() {
    setAiLoading(true);
    setTimeout(() => {
      const drafts = FUNDING_AI_DRAFTS[step.id] || {};
      setValues(prev => {
        const next = { ...prev };
        (step.fields || []).forEach(f => { if (drafts[f.key]) next[f.key] = drafts[f.key]; });
        return next;
      });
      setAiLoading(false);
      setAiDone(true);
    }, 1200);
  }

  return (
    <div className={`card transition-all ${done ? 'opacity-70' : ''}`}>
      <button className="w-full flex items-center gap-3 text-left" onClick={onToggle}>
        <div className={`step-num flex-shrink-0 ${done
          ? 'bg-brand-green text-white'
          : isOpen ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400'
        }`}>
          {done ? <Icons.Check size={13} className="text-white"/> : step.stepNum}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 leading-snug">{step.title}</div>
          <div className="mt-1">
            <span className={done ? 'status-complete' : 'status-todo'}>{done ? 'Complete' : 'To Do'}</span>
          </div>
        </div>
        <Icons.ChevronRight size={14}
          className={`text-gray-300 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}/>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-slide-down">
          {/* Mode picker */}
          {!done && mode === null && (
            <div className="flex gap-2 mb-4">
              <button onClick={() => setMode('self')}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-orange-200 rounded-xl px-3 py-2 hover:border-brand-orange hover:bg-orange-50 active:scale-95 transition-all">
                <span className="text-xs">✍️</span>
                <span className="text-xs font-semibold text-gray-600">Fill in Yourself</span>
              </button>
              <button onClick={() => { setMode('ai'); handleAIDraft(); }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-brand-orange rounded-xl px-3 py-2 hover:bg-orange-600 active:scale-95 transition-all">
                <Icons.Sparkle size={12} className="text-white"/>
                <span className="text-xs font-semibold text-white">Consult Assistant</span>
              </button>
            </div>
          )}

          {/* AI loading */}
          {mode === 'ai' && aiLoading && (
            <div className="flex items-center gap-2 py-4 justify-center animate-fade-in">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand-orange"
                    style={{ animation: `bounce 0.8s ${i * 0.15}s infinite alternate` }}/>
                ))}
              </div>
              <span className="text-sm text-gray-400">Drafting with AI…</span>
            </div>
          )}

          {/* Fields */}
          {(mode === 'self' || (mode === 'ai' && !aiLoading)) && (
            <div className="space-y-3">
              {(step.fields || []).map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  <textarea className="textarea-field"
                    rows={values[field.key]?.length > 80 ? 3 : 2}
                    value={values[field.key]}
                    onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={`Enter ${field.label.toLowerCase()}…`}/>
                </div>
              ))}

              {mode === 'ai' && aiDone && (
                <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl p-2.5">
                  <Icons.Sparkle size={13} className="text-brand-orange mt-0.5 flex-shrink-0"/>
                  <p className="text-xs text-orange-700">AI draft added. Edit any field before saving.</p>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button className="btn-primary w-full">Save Step</button>
                {mode === 'ai' && (
                  <button onClick={() => { setMode('self'); setAiDone(false); }}
                    className="w-full text-center text-xs text-brand-orange font-medium py-1 hover:underline transition-all">
                    ✍️ Edit manually instead
                  </button>
                )}
                {mode === 'self' && (
                  <button onClick={() => { setMode('ai'); setAiDone(false); handleAIDraft(); }}
                    className="w-full text-center text-xs text-brand-orange font-medium py-1 hover:underline transition-all">
                    ✨ Use assistant instead
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Expert data ────────────────────────────────────────────── */
const EXPERTS = [
  {
    id: 'e-1',
    name: 'Maria Gonzalez',
    initials: 'MG',
    color: '#8B5CF6',
    title: 'SBA & Grant Specialist',
    rating: 4.9,
    reviews: 127,
    specialties: ['SBA Loans', 'Restaurant Grants', 'TX Programs'],
    bio: '12 years helping food service entrepreneurs in Texas secure funding.',
  },
  {
    id: 'e-2',
    name: 'James Park',
    initials: 'JP',
    color: '#0EA5E9',
    title: 'Restaurant Finance Advisor',
    rating: 4.8,
    reviews: 94,
    specialties: ['Angel Investment', 'Business Valuation', 'Pitch Prep'],
    bio: 'Former restaurant operator turned finance advisor. Raised $4M+ for clients.',
  },
  {
    id: 'e-3',
    name: 'Aisha Thompson',
    initials: 'AT',
    color: '#10B981',
    title: 'BIPOC Business Funding Expert',
    rating: 5.0,
    reviews: 63,
    specialties: ['BIPOC Grants', 'Austin Programs', 'Minority Loans'],
    bio: 'Specialist in minority-owned business funding and City of Austin programs.',
  },
  {
    id: 'e-4',
    name: 'Carlos Rivera',
    initials: 'CR',
    color: '#F59E0B',
    title: 'Small Business Loan Broker',
    rating: 4.7,
    reviews: 218,
    specialties: ['Bank Loans', 'Collateral Planning', 'Credit Building'],
    bio: 'Broker with access to 30+ lenders specializing in food & hospitality.',
  },
];

const TIME_SLOTS = [
  { id: 'ts-1', day: 'Mon, Feb 24', times: ['9:00 AM', '10:30 AM', '2:00 PM'] },
  { id: 'ts-2', day: 'Tue, Feb 25', times: ['11:00 AM', '3:30 PM', '4:00 PM'] },
  { id: 'ts-3', day: 'Wed, Feb 26', times: ['9:30 AM', '1:00 PM'] },
];

/* ─── ExpertModal (3-screen flow) ───────────────────────────── */
function ExpertModal({ onClose }) {
  // screen: 'list' → 'slots' → 'confirmed'
  const [screen,          setScreen]         = useState('list');
  const [selectedExpert,  setSelectedExpert] = useState(null);
  const [selectedSlot,    setSelectedSlot]   = useState(null); // { day, time }

  /* ── Screen 3: Confirmed ── */
  if (screen === 'confirmed') {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}/>
        <div className="modal-sheet p-6">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
              <Icons.Check size={26} className="text-brand-green"/>
            </div>
            <div className="text-base font-bold text-gray-800 mb-1">You're Booked!</div>
            <div className="text-sm text-gray-500 leading-relaxed mb-1">
              {selectedSlot?.day} at {selectedSlot?.time}
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-4">
              with {selectedExpert?.name}
            </div>
            <div className="bg-gray-50 rounded-xl p-3 w-full mb-5 text-left space-y-1.5">
              {['Calendar invite sent to your email', 'Video link included in invite', 'Bring your draft application'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Icons.Check size={9} className="text-brand-green"/>
                  </div>
                  <span className="text-xs text-gray-600">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="btn-ghost w-full">Done</button>
          </div>
        </div>
      </>
    );
  }

  /* ── Screen 2: Time Slots ── */
  if (screen === 'slots') {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}/>
        <div className="modal-sheet p-5">
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4"/>

          {/* Back + expert mini-header */}
          <button onClick={() => setScreen('list')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors">
            <Icons.ChevronRight size={14} className="rotate-180"/>
            All Experts
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-base flex-shrink-0"
              style={{ backgroundColor: selectedExpert.color }}>
              {selectedExpert.initials}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800">{selectedExpert.name}</div>
              <div className="text-xs text-gray-400">{selectedExpert.title}</div>
            </div>
          </div>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Available Times
          </div>

          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 280 }}>
            {TIME_SLOTS.map(group => (
              <div key={group.id}>
                <div className="text-xs font-semibold text-gray-500 mb-1.5">{group.day}</div>
                <div className="flex flex-wrap gap-2">
                  {group.times.map(time => {
                    const isSelected = selectedSlot?.day === group.day && selectedSlot?.time === time;
                    return (
                      <button key={time}
                        onClick={() => setSelectedSlot({ day: group.day, time })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-brand-orange text-white border-brand-orange'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
                        }`}>
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={() => selectedSlot && setScreen('confirmed')}
              className={`btn-primary w-full mb-2 ${!selectedSlot ? 'opacity-40 cursor-not-allowed' : ''}`}>
              Confirm Booking
            </button>
            <button onClick={onClose} className="btn-ghost w-full">Maybe Later</button>
          </div>
        </div>
      </>
    );
  }

  /* ── Screen 1: Expert List ── */
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}/>
      <div className="modal-sheet p-5">
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4"/>
        <div className="text-base font-bold text-gray-800 mb-0.5">Choose a Funding Expert</div>
        <div className="text-xs text-gray-400 mb-4">Certified advisors specialising in food service funding</div>

        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 380 }}>
          {EXPERTS.map(expert => (
            <button key={expert.id}
              onClick={() => { setSelectedExpert(expert); setScreen('slots'); }}
              className="w-full flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-3 py-3 hover:border-brand-orange hover:bg-orange-50 active:scale-[0.98] transition-all text-left">

              {/* Avatar */}
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: expert.color }}>
                {expert.initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{expert.name}</span>
                  <span className="text-[11px] font-semibold text-amber-500">★ {expert.rating}</span>
                </div>
                <div className="text-[11px] text-gray-400 mb-1">{expert.title}</div>
                <div className="flex flex-wrap gap-1">
                  {expert.specialties.slice(0,2).map(s => (
                    <span key={s} className="text-[9px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <Icons.ChevronRight size={14} className="text-gray-300 flex-shrink-0"/>
            </button>
          ))}
        </div>

        <button onClick={onClose} className="btn-ghost w-full mt-3">Maybe Later</button>
      </div>
    </>
  );
}

/* ─── FundingDetailView ──────────────────────────────────────── */
function FundingDetailView({ funding, onBack }) {
  const [openStep,     setOpenStep]     = useState(null);
  const [expertOpen,   setExpertOpen]   = useState(false);

  const steps = FUNDING_APPLICATION_STEPS[funding.id] || [];
  const appSteps = steps.filter(s => s.type !== 'smart'); // Steps 2+

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 pt-3">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <Icons.ChevronRight size={14} className="rotate-180"/>
          All Funding
        </button>

        {/* Header card */}
        <div className="card">
          <div className="font-bold text-gray-800 leading-snug mb-2">{funding.name}</div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${TYPE_COLORS[funding.type] || 'bg-gray-100 text-gray-500'}`}>{funding.type}</span>
            <span className="text-xs font-bold text-gray-700">{funding.amount}</span>
            <span className="text-[10px] text-gray-400">·</span>
            <span className="text-xs text-gray-400">Due {funding.deadline}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${matchScoreStyle(funding.match)}`}>
              {funding.match}% Match
            </span>
          </div>
        </div>

        {/* Section label */}
        <div className="section-label px-1">Application Steps</div>

        {/* Step 1: Context card */}
        <FundingContextCard/>

        {/* Steps 2+ */}
        {appSteps.map(step => {
          const isOpen = openStep === step.id;
          return (
            <FundingStepCard key={step.id} step={step} isOpen={isOpen}
              onToggle={() => setOpenStep(prev => prev === step.id ? null : step.id)}/>
          );
        })}

        {/* Expert CTA card */}
        <div className="card border-l-4 border-brand-indigo">
          {/* Avatar stack + label */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex -space-x-2 flex-shrink-0">
              {EXPERTS.map((e, i) => (
                <div key={e.id}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center font-bold text-white text-[11px] flex-shrink-0"
                  style={{ backgroundColor: e.color, zIndex: EXPERTS.length - i }}>
                  {e.initials}
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800">Talk to a Funding Expert</div>
              <div className="text-xs text-gray-400">{EXPERTS.length} certified advisors available</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 leading-snug mb-3">
            Get personalized help with your {funding.type} application. Pick an expert and book a time that works for you.
          </div>
          <button onClick={() => setExpertOpen(true)} className="btn-primary w-full">
            Book a 30-Min Consult →
          </button>
        </div>

        <div style={{ height: 8 }}/>
      </div>

      {/* Expert modal */}
      {expertOpen && (
        <ExpertModal onClose={() => setExpertOpen(false)}/>
      )}
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function FundingSection() {
  const [view,            setView]           = useState('hub');
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  if (view === 'chat') {
    return <FundingChatView onBack={() => setView('hub')}/>;
  }

  if (view === 'detail' && selectedFunding) {
    return (
      <FundingDetailView
        funding={selectedFunding}
        onBack={() => { setView('hub'); setSelectedFunding(null); }}
      />
    );
  }

  if (view === 'project-detail' && selectedProject) {
    return (
      <FundingProjectDetailView
        project={selectedProject}
        onBack={() => { setView('hub'); setSelectedProject(null); }}
        onExplore={() => { setView('chat'); setSelectedProject(null); }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <FundingHubView
        onExplore={() => setView('chat')}
        onSelectFunding={opp => { setSelectedFunding(opp); setView('detail'); }}
        onSelectProject={proj => { setSelectedProject(proj); setView('project-detail'); }}
      />
    </div>
  );
}
