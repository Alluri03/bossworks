import { useState } from 'react';
import { buildPlanTasks, DEMO_ONBOARDING_DATA, FINANCIAL_PLAN_DATA, PITCH_DECK_SECTIONS } from '../data/appData';
import { Icons } from './Icons';

const PLAN_BUILDER_TASKS = buildPlanTasks(DEMO_ONBOARDING_DATA);

/* ─── AI_DRAFTS ──────────────────────────────────────────────── */
const AI_DRAFTS = {
  // Business Plan drafts
  'pb-0': {
    businessName: DEMO_ONBOARDING_DATA.businessName,
    location:     DEMO_ONBOARDING_DATA.location,
    tagline:      'The best ramen in South Austin — 12 minutes or less.',
  },
  'pb-1': {
    icp:     'Young professionals aged 25–38, household income $65k+, living or working within 3 miles of South Congress Ave. Foodie-curious, values authenticity and speed.',
    pains:   '1. No authentic tonkotsu ramen within 5 miles.  2. Long waits (45+ min) at competing ramen spots north of the river.  3. No quality late-night ramen option after 9 PM.',
    promise: 'The best ramen bowl in South Austin, ready in under 12 minutes — made with locally sourced Berkshire pork.',
  },
  'pb-2': {
    whatYouOffer: DEMO_ONBOARDING_DATA.businessIdea,
    menuItems:    'Tonkotsu Classic · Spicy Miso · Shoyu Chicken · Vegan Shio · Chef Special (rotating) · Kids Bowl. Starters: Gyoza, Karaage, Edamame, Chashu Bao. Drinks: Calpico, Japanese Craft Beer, Yuzu Lemonade.',
    packages:     'Dine-in (40 seats) · Takeout / Curbside · Catering packages for groups 10+ · DoorDash / Uber Eats delivery.',
    avgCheck:     '$22 per person including one add-on (egg, extra chashu, or noodle upgrade).',
  },
  'pb-3': {
    avgPrice:    '$16 for signature bowls. Range $13 (kids) – $19 (premium).',
    cogsRange:   '28–34%. Pork broth COGS ~30%, proteins ~32%, vegetables ~18%. Blended target: 30%.',
    grossMargin: 'Target 66–70% gross margin. Comparable Austin restaurants: 62–72%.',
  },
  'pb-5': {
    competitors:     '10 mapped. Direct: Ramen Tatsu-Ya (North Austin, 45 min away), Yume Wo Katare (Boston-style, cult). Indirect: Soup Peddler, Uchi, local pho shops.',
    gaps:            'No tonkotsu-first spot south of the river. No ramen with local sourcing story. No delivery-optimised ramen in 78704 zip code.',
    differentiation: 'Local Berkshire pork broth · open kitchen · South Austin neighborhood identity · delivery-first packaging · late-night hours (until midnight Fri/Sat).',
  },
  // Pitch Deck drafts
  'pd-1': {
    painStatement:       'Authentic Japanese ramen is unavailable in South Austin. Residents drive 30+ minutes for quality tonkotsu, settling for mediocre alternatives.',
    whoFaces:            'Young professionals aged 25–38 earning $65k+, living within 3 miles of South Congress Ave. Food-curious and brand-loyal once won.',
    currentAlternatives: 'Ramen Tatsu-Ya (North Austin, 45 min away), pho shops (not ramen), fast casual (not authentic). No delivery-optimized option in 78704.',
  },
  'pd-2': {
    solution:          'A tonkotsu-first ramen shop with locally sourced Berkshire pork, open-kitchen experience, and delivery-ready packaging — all in South Austin.',
    keyDifferentiator: 'Local sourcing story + late-night hours (until midnight Fri/Sat) + delivery-first packaging. No competitor does all three.',
    uniqueMechanism:   'House-made 18-hour pork broth with seasonal toppings. Supply chain locked in with 2 local farms within 60 miles.',
  },
  'pd-3': {
    tam: '$890M — US ramen restaurant market (2024 estimate)',
    sam: '$12M — South Austin food service market (78704 + adjacent zips, annual)',
    som: '$720K — projected Year 1 revenue at 70 covers/day avg over 12 months',
  },
  'pd-4': {
    revenueStreams: 'Dine-in (primary), Takeout/Delivery (DoorDash, Uber Eats), Catering (groups 10+)',
    pricing:       'Bowl $13–$19, Starters $6–$9, ATV $22. Delivery adds $2.50 packaging surcharge.',
    unitEconomics: 'Gross margin 66%. Break-even at Month 6 at ~70 covers/day. COGS target 30%.',
  },
  'pd-6': {
    founders:  '[Your name] — CEO/Operator, 8 years restaurant experience. Co-founder — Head Chef, trained in Tokyo.',
    advisors:  'Restaurant attorney (Austin), CPA with food service clients, former Tatsu-Ya GM as informal advisor.',
    keyHires:  'Head Chef (Day 1), 2x Line Cooks (Day 1), 3x FOH staff (Day 1), Delivery coordinator (Month 2).',
  },
  'pd-7': {
    amountSeeking: '$129,000 seed — covers fit-out ($35k), equipment ($45k), legal/licensing ($3.5k), working capital ($30k), marketing ($8k), tech ($4.5k).',
    equityOffered: 'Seeking grant/loan mix where possible. Angel equity: up to 15% for $75k+ check at $500k pre-money.',
    milestones:    'Sign lease (Month 1), Open (Month 3), Break-even (Month 6), $60k MRR (Month 12), second location feasibility (Month 18).',
  },
};

const STATUS_META = {
  complete:      { label: 'Complete',    cls: 'status-complete' },
  'in-progress': { label: 'In Progress', cls: 'status-progress' },
  todo:          { label: 'To Do',       cls: 'status-todo'     },
};

/* ─── SmartStepCard — for pb-7 Break-Even ───────────────────── */
function SmartStepCard({ task, isOpen, onToggle, onViewFullPlan }) {
  const { breakEvenMonth, assumptions } = FINANCIAL_PLAN_DATA;

  const fixedCosts   = assumptions.find(a => a.label === 'Monthly Fixed Costs')?.value || '—';
  const coversPerDay = assumptions.find(a => a.label === 'Covers/Day (Month 6)')?.value || '—';
  const avgPrice     = assumptions.find(a => a.label === 'Avg Bowl Price')?.value || '—';

  return (
    <div className="card">
      {/* Row header */}
      <button
        type="button"
        className="w-full flex items-center gap-3 text-left"
        onClick={onToggle}
      >
        <div className="step-num flex-shrink-0 bg-brand-green text-white">
          <Icons.Check size={13} className="text-white"/>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 leading-snug">{task.title}</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="status-complete">Complete</span>
            <span className="text-[10px] text-gray-400">· Powered by Financial Plan</span>
          </div>
        </div>

        <Icons.ChevronRight
          size={14}
          className={`text-gray-300 flex-shrink-0 transition-transform ${isOpen === true ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded body */}
      {isOpen === true && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-slide-down space-y-3">

          {/* Inline summary cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Monthly Fixed', value: fixedCosts,              color: 'text-brand-orange' },
              { label: 'Break-Even',    value: `Month ${breakEvenMonth}`, color: 'text-brand-green'  },
              { label: 'Covers/Day',    value: coversPerDay,             color: 'text-brand-indigo' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                <div className={`text-sm font-bold ${color}`}>{value}</div>
                <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>

          {/* Formula */}
          <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <div className="text-[10px] text-gray-400 mb-0.5">Formula</div>
            <div className="text-xs text-gray-600 font-mono">
              {fixedCosts} ÷ ({avgPrice} × 66%) ≈ {coversPerDay} covers/day
            </div>
          </div>

          {/* Auto-complete notice */}
          <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl p-2.5">
            <Icons.Sparkle size={13} className="text-brand-orange mt-0.5 flex-shrink-0"/>
            <p className="text-xs text-orange-700 leading-snug">
              Auto-filled from your Financial Plan. Edit assumptions there to update these numbers.
            </p>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onViewFullPlan(); }}
            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-brand-orange hover:bg-orange-50 transition-all group"
          >
            <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-orange">
              View full projections →
            </span>
            <Icons.ChevronRight size={14} className="text-gray-300 group-hover:text-brand-orange"/>
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── StepCard (regular) ─────────────────────────────────────── */
function StepCard({ task, stepNum, isOpen, onToggle }) {
  const [mode, setMode]           = useState(null);
  const [values, setValues]       = useState(() =>
    Object.fromEntries(task.fields.map(f => [f.key, f.value || '']))
  );
  const [aiDone, setAiDone]       = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const st   = STATUS_META[task.status];
  const done = task.status === 'complete';

  function handleAIDraft() {
    setAiLoading(true);
    setTimeout(() => {
      const drafts = AI_DRAFTS[task.id] || {};
      setValues(prev => {
        const next = { ...prev };
        task.fields.forEach(f => { if (drafts[f.key]) next[f.key] = drafts[f.key]; });
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
          : isOpen
            ? 'bg-brand-orange text-white'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {done ? <Icons.Check size={13} className="text-white"/> : stepNum}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 leading-snug">{task.title}</div>
          <div className="mt-1">
            <span className={st.cls}>{st.label}</span>
          </div>
        </div>

        <Icons.ChevronRight
          size={14}
          className={`text-gray-300 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-slide-down">

          {/* Mode picker */}
          {!done && mode === null && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode('self')}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-orange-200 rounded-xl px-3 py-2 hover:border-brand-orange hover:bg-orange-50 active:scale-95 transition-all"
              >
                <span className="text-xs">✍️</span>
                <span className="text-xs font-semibold text-gray-600">Fill in Yourself</span>
              </button>
              <button
                onClick={() => { setMode('ai'); handleAIDraft(); }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-brand-orange rounded-xl px-3 py-2 hover:bg-orange-600 active:scale-95 transition-all"
              >
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
              {task.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  <textarea
                    className="textarea-field"
                    rows={values[field.key]?.length > 80 ? 3 : 2}
                    value={values[field.key]}
                    onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={`Enter ${field.label.toLowerCase()}…`}
                  />
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

          {/* Completed read-only */}
          {done && (
            <div className="space-y-2.5">
              {task.fields.map(field => (
                <div key={field.key}>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{field.label}</div>
                  <div className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2 leading-relaxed">{field.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── PhaseGroup ─────────────────────────────────────────────── */
function PhaseGroup({ phase, tasks, startIndex, openStep, setOpenStep, onViewFullPlan }) {
  const done = tasks.filter(t => t.status === 'complete').length;
  return (
    <div>
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="section-label">{phase}</div>
        <span className="text-[10px] text-gray-400 font-medium">{done}/{tasks.length}</span>
      </div>
      <div className="space-y-2">
        {tasks.map((task, i) => {
          const taskId = task.id;
          const isOpen = openStep === taskId;
          const handleToggle = () => setOpenStep(prev => prev === taskId ? null : taskId);

          if (task.type === 'smart') {
            return (
              <SmartStepCard key={taskId} task={task} isOpen={isOpen} onToggle={handleToggle} onViewFullPlan={onViewFullPlan}/>
            );
          }
          return (
            <StepCard key={taskId} task={task} stepNum={startIndex + i + 1} isOpen={isOpen} onToggle={handleToggle}/>
          );
        })}
      </div>
    </div>
  );
}

/* ─── BusinessPlanView ───────────────────────────────────────── */
function BusinessPlanView({ onSwitchToFinancial }) {
  const [openStep, setOpenStep] = useState(null);

  const complete = PLAN_BUILDER_TASKS.filter(t => t.status === 'complete').length;
  const total    = PLAN_BUILDER_TASKS.length;
  const phases   = [...new Set(PLAN_BUILDER_TASKS.map(t => t.phase))];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-2 pb-3 flex-shrink-0 flex items-center justify-between">
        <div className="flex-1 mr-3">
          <div className="progress-bar">
            <div className="progress-fill bg-brand-orange" style={{ width: `${Math.round((complete / total) * 100)}%` }}/>
          </div>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{complete}/{total} steps</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {phases.map(phase => {
          const phaseTasks = PLAN_BUILDER_TASKS.filter(t => t.phase === phase);
          const startIndex = PLAN_BUILDER_TASKS.indexOf(phaseTasks[0]);
          return (
            <PhaseGroup key={phase} phase={phase} tasks={phaseTasks} startIndex={startIndex}
              openStep={openStep} setOpenStep={setOpenStep} onViewFullPlan={onSwitchToFinancial}/>
          );
        })}
        <div style={{ height: 8 }}/>
      </div>
    </div>
  );
}

/* ─── FinancialPlanView ──────────────────────────────────────── */
function fmtK(n) {
  const abs = Math.abs(n);
  const str = abs >= 1000 ? `$${(abs / 1000).toFixed(0)}k` : `$${abs}`;
  return n < 0 ? `-${str}` : str;
}

function FinancialPlanView() {
  const [period, setPeriod] = useState('1-12');
  const { estimatedBudget, breakEvenMonth, projections, assumptions } = FINANCIAL_PLAN_DATA;

  const periodData = projections.find(p => p.period === period);
  const months     = periodData ? periodData.months : [];

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 pt-2">

      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center shadow-none">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Estimated Budget</div>
          <div className="text-xl font-bold text-brand-orange">{fmtK(estimatedBudget)}</div>
        </div>
        <div className="card text-center shadow-none">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Break-Even</div>
          <div className="text-xl font-bold text-brand-green">Month {breakEvenMonth}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="section-label">Key Financial Projections</div>
          <div className="pill-toggle" style={{ padding: 2 }}>
            {[['1-12', '1-12 Mo'], ['13-24', '13-24 Mo']].map(([id, label]) => (
              <button key={id} onClick={() => setPeriod(id)}
                className={`pill-tab text-[10px] py-1 px-2 ${period === id ? 'pill-tab-active' : 'pill-tab-inactive'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 mb-2 px-1">
          {['Month', 'Revenue', 'Expenses', 'Net Profit'].map(h => (
            <div key={h} className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider text-center">{h}</div>
          ))}
        </div>

        <div className="space-y-1">
          {months.map(({ m, revenue, expenses, net }) => (
            <div key={m} className={`grid grid-cols-4 gap-1 rounded-xl px-1 py-1.5 ${net < 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className="text-[11px] font-bold text-gray-500 text-center">Mo {m}</div>
              <div className="text-[11px] font-semibold text-gray-700 text-center">{fmtK(revenue)}</div>
              <div className="text-[11px] font-semibold text-gray-700 text-center">{fmtK(expenses)}</div>
              <div className={`text-[11px] font-bold text-center ${net < 0 ? 'text-red-500' : 'text-brand-green'}`}>
                {fmtK(net)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-label mb-3">Business Assumptions</div>
        <div className="space-y-2.5">
          {assumptions.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-bold text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 8 }}/>
    </div>
  );
}

/* ─── SmartPitchSlideCard — pd-5 Financial Snapshot ─────────── */
function SmartPitchSlideCard({ section, isOpen, onToggle, onViewFullPlan }) {
  const { estimatedBudget, breakEvenMonth, projections } = FINANCIAL_PLAN_DATA;
  const yr1Revenue = projections.find(p => p.period === '1-12')?.months.reduce((s, m) => s + m.revenue, 0) || 0;

  return (
    <div className="card">
      <button type="button" className="w-full flex items-center gap-3 text-left" onClick={onToggle}>
        <div className="step-num flex-shrink-0 bg-brand-green text-white">
          <Icons.Check size={13} className="text-white"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 leading-snug">{section.title}</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="status-complete">Complete</span>
            <span className="text-[10px] text-gray-400">· Powered by Financial Plan</span>
          </div>
        </div>
        <Icons.ChevronRight size={14}
          className={`text-gray-300 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}/>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-slide-down space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Budget Need',  value: `$${(estimatedBudget/1000).toFixed(0)}k`, color: 'text-brand-orange' },
              { label: 'Break-Even',   value: `Month ${breakEvenMonth}`,                 color: 'text-brand-green'  },
              { label: 'Yr 1 Revenue', value: `$${(yr1Revenue/1000).toFixed(0)}k`,       color: 'text-brand-indigo' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                <div className={`text-sm font-bold ${color}`}>{value}</div>
                <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl p-2.5">
            <Icons.Sparkle size={13} className="text-brand-orange mt-0.5 flex-shrink-0"/>
            <p className="text-xs text-orange-700 leading-snug">
              Auto-filled from your Financial Plan. Edit assumptions there to update these numbers.
            </p>
          </div>

          <button type="button" onClick={e => { e.stopPropagation(); onViewFullPlan(); }}
            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-brand-orange hover:bg-orange-50 transition-all group">
            <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-orange">View full projections →</span>
            <Icons.ChevronRight size={14} className="text-gray-300 group-hover:text-brand-orange"/>
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── PitchSlideCard ─────────────────────────────────────────── */
function PitchSlideCard({ section, isOpen, onToggle }) {
  const [mode, setMode]           = useState(null);
  const [values, setValues]       = useState(() =>
    Object.fromEntries(section.fields.map(f => [f.key, f.value || '']))
  );
  const [aiDone, setAiDone]       = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const st   = STATUS_META[section.status];
  const done = section.status === 'complete';

  function handleAIDraft() {
    setAiLoading(true);
    setTimeout(() => {
      const drafts = AI_DRAFTS[section.id] || {};
      setValues(prev => {
        const next = { ...prev };
        section.fields.forEach(f => { if (drafts[f.key]) next[f.key] = drafts[f.key]; });
        return next;
      });
      setAiLoading(false);
      setAiDone(true);
    }, 1200);
  }

  return (
    <div className={`card transition-all ${done ? 'opacity-70' : ''}`}>
      <button className="w-full flex items-center gap-3 text-left" onClick={onToggle}>
        <div className={`step-num flex-shrink-0 text-xs ${done
          ? 'bg-brand-green text-white'
          : isOpen
            ? 'bg-brand-orange text-white'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {done ? <Icons.Check size={13} className="text-white"/> : section.slide}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 leading-snug">
            <span className="text-[10px] text-gray-400 font-medium">Slide {section.slide} · </span>
            {section.title}
          </div>
          <div className="mt-1"><span className={st.cls}>{st.label}</span></div>
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
              {section.fields.map(field => (
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
                <button className="btn-primary w-full">Save Slide</button>
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

          {/* Completed read-only */}
          {done && (
            <div className="space-y-2.5">
              {section.fields.map(field => (
                <div key={field.key}>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{field.label}</div>
                  <div className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2 leading-relaxed">{field.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── PitchDeckView ──────────────────────────────────────────── */
function PitchDeckView({ onSwitchToBusiness, onSwitchToFinancial }) {
  const [openSlide, setOpenSlide] = useState(null);

  const completedPlanSteps = PLAN_BUILDER_TASKS.filter(t => t.status === 'complete').length;
  const UNLOCK_THRESHOLD   = 3;
  const isUnlocked         = completedPlanSteps >= UNLOCK_THRESHOLD;

  const complete = PITCH_DECK_SECTIONS.filter(s => s.status === 'complete').length;
  const total    = PITCH_DECK_SECTIONS.length;

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center pb-12">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Icons.Lock size={28} className="text-gray-300"/>
        </div>
        <div className="text-base font-bold text-gray-700 mb-2">Unlock Your Pitch Deck</div>
        <div className="text-sm text-gray-400 leading-relaxed mb-5">
          Complete {UNLOCK_THRESHOLD} steps in your Business Plan to enable pitch deck creation.
        </div>
        <div className="w-full mb-2">
          <div className="progress-bar">
            <div className="progress-fill bg-brand-orange"
              style={{ width: `${Math.round((completedPlanSteps / UNLOCK_THRESHOLD) * 100)}%` }}/>
          </div>
        </div>
        <div className="text-xs text-gray-400 mb-6">{completedPlanSteps}/{UNLOCK_THRESHOLD} steps complete</div>
        <button onClick={onSwitchToBusiness} className="btn-ghost w-full">
          Go to Business Plan
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress strip */}
      <div className="px-4 pt-2 pb-3 flex-shrink-0 flex items-center justify-between">
        <div className="flex-1 mr-3">
          <div className="progress-bar">
            <div className="progress-fill bg-brand-orange" style={{ width: `${Math.round((complete / total) * 100)}%` }}/>
          </div>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{complete}/{total} slides</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {/* Info banner */}
        <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl p-3">
          <Icons.Sparkle size={13} className="text-brand-orange mt-0.5 flex-shrink-0"/>
          <p className="text-xs text-orange-700 leading-snug">
            Investor-ready pitch deck. Fill each slide manually or let the Assistant draft it.
          </p>
        </div>

        {/* Slides */}
        {PITCH_DECK_SECTIONS.map(section => {
          const isOpen     = openSlide === section.id;
          const handleToggle = () => setOpenSlide(prev => prev === section.id ? null : section.id);

          if (section.type === 'smart') {
            return (
              <SmartPitchSlideCard key={section.id} section={section}
                isOpen={isOpen} onToggle={handleToggle} onViewFullPlan={onSwitchToFinancial}/>
            );
          }
          return (
            <PitchSlideCard key={section.id} section={section} isOpen={isOpen} onToggle={handleToggle}/>
          );
        })}
        <div style={{ height: 8 }}/>
      </div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function PlanSection() {
  const [planTab, setPlanTab] = useState('business');

  return (
    <div className="flex flex-col h-full">
      {/* Pill toggle: Business | Financial | Pitch Deck */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="pill-toggle">
          {[
            ['business',  'Business'],
            ['financial', 'Financial'],
            ['pitch',     'Pitch Deck'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setPlanTab(id)}
              className={`pill-tab ${planTab === id ? 'pill-tab-active' : 'pill-tab-inactive'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {planTab === 'business'  && <BusinessPlanView onSwitchToFinancial={() => setPlanTab('financial')} />}
        {planTab === 'financial' && <FinancialPlanView />}
        {planTab === 'pitch'     && (
          <PitchDeckView
            onSwitchToBusiness={() => setPlanTab('business')}
            onSwitchToFinancial={() => setPlanTab('financial')}
          />
        )}
      </div>
    </div>
  );
}
