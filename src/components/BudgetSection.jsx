import { useState } from 'react';
import { BUDGET_DATA } from '../data/appData';

const STATUS_STYLES = {
  estimated:   { bg: 'bg-gray-100',   text: 'text-gray-500',        label: 'Est.' },
  'in-progress':{ bg: 'bg-orange-50', text: 'text-brand-orange',    label: 'Active' },
  confirmed:   { bg: 'bg-green-50',   text: 'text-green-600',       label: 'Confirmed' },
};

function fmt(n) { return n >= 1000 ? `$${(n/1000).toFixed(0)}k` : `$${n.toLocaleString()}`; }

function BudgetRow({ item }) {
  const st  = STATUS_STYLES[item.status] || STATUS_STYLES.estimated;
  const pct = item.actual > 0 ? Math.round((item.actual / item.budgeted) * 100) : 0;
  return (
    <div className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
      <div className="flex items-start justify-between mb-1.5">
        <span className="text-sm text-gray-700">{item.category}</span>
        <div className="flex items-center gap-2">
          <span className={`badge ${st.bg} ${st.text}`}>{st.label}</span>
          <span className="text-sm font-bold text-gray-800">{fmt(item.budgeted)}</span>
        </div>
      </div>
      {item.actual > 0 && (
        <>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Actual: {fmt(item.actual)}</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(pct,100)}%`, backgroundColor: pct > 90 ? '#EF4444' : '#22C55E' }}/>
          </div>
        </>
      )}
    </div>
  );
}

function StartupView() {
  const total = BUDGET_DATA.startupCosts.reduce((a,b) => a + b.budgeted, 0);
  const spent = BUDGET_DATA.startupCosts.reduce((a,b) => a + b.actual,   0);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center shadow-none">
          <div className="text-2xl font-bold text-gray-800">{fmt(total)}</div>
          <div className="text-xs text-gray-400 mt-0.5">Total Est. Startup</div>
        </div>
        <div className="card text-center shadow-none">
          <div className="text-2xl font-bold text-brand-orange">{fmt(spent)}</div>
          <div className="text-xs text-gray-400 mt-0.5">Spent So Far</div>
        </div>
      </div>
      <div className="card">
        <div className="section-label mb-3">Startup Cost Breakdown</div>
        <div className="space-y-3">
          {BUDGET_DATA.startupCosts.map(item => <BudgetRow key={item.category} item={item}/>)}
        </div>
      </div>
      <div className="card">
        <div className="section-label mb-3">Distribution</div>
        <div className="space-y-2">
          {BUDGET_DATA.startupCosts.map(item => {
            const pct = Math.round((item.budgeted / total) * 100);
            return (
              <div key={item.category} className="flex items-center gap-2">
                <div className="text-xs text-gray-500 w-32 truncate">{item.category}</div>
                <div className="flex-1 progress-bar">
                  <div className="progress-fill bg-brand-orange" style={{ width: `${pct}%` }}/>
                </div>
                <div className="text-xs text-gray-400 w-7 text-right">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MonthlyView() {
  const total           = BUDGET_DATA.monthlyFixed.reduce((a,b) => a + b.budgeted, 0);
  const breakEvenCovers = Math.ceil(total / (16 * 0.66));
  const perDay          = Math.ceil(breakEvenCovers / 26);
  return (
    <div className="space-y-3">
      <div className="card">
        <div className="section-label mb-2">Monthly Fixed Costs</div>
        <div className="text-3xl font-bold text-gray-800 mb-0.5">{fmt(total)}<span className="text-base text-gray-400 font-normal">/mo</span></div>
        <div className="text-xs text-gray-400 mb-4">Estimate only — confirmed after lease &amp; hiring</div>
        <div className="space-y-2.5">
          {BUDGET_DATA.monthlyFixed.map(item => (
            <div key={item.category} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.category}</span>
              <span className="text-sm font-bold text-gray-800">{fmt(item.budgeted)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="section-label mb-3">Break-Even Estimate</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            [`~${breakEvenCovers}`, 'Covers/Month', 'text-brand-orange'],
            [`~${perDay}`,           'Covers/Day',   'text-brand-indigo'],
            ['$16',                  'Avg Bowl',     'text-brand-orange'],
            ['66%',                  'Gross Margin', 'text-brand-green'],
          ].map(([v, l, c]) => (
            <div key={l} className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <div className={`text-xl font-bold ${c}`}>{v}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="text-xs text-gray-400 mb-1">Formula</div>
          <div className="text-xs text-gray-600 font-mono">{fmt(total)} ÷ ($16 × 66%) ≈ {breakEvenCovers} covers/mo</div>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const startupTotal = BUDGET_DATA.startupCosts.reduce((a,b) => a + b.budgeted, 0);
  const monthlyTotal = BUDGET_DATA.monthlyFixed.reduce((a,b) => a + b.budgeted,  0);
  return (
    <div className="space-y-3">
      <div className="card">
        <div className="section-label mb-3">Financial Snapshot</div>
        {[
          { label: 'Startup Capital Needed', value: fmt(startupTotal), note: 'Estimated',         color: 'text-brand-orange' },
          { label: 'Monthly Burn (Fixed)',    value: fmt(monthlyTotal), note: 'Pre-revenue',       color: 'text-red-500'      },
          { label: 'Runway at Startup',       value: '3–4 mo',          note: 'With $30k reserve', color: 'text-brand-indigo' },
          { label: 'Target Break-Even',       value: 'Month 6',         note: '70 covers/day',    color: 'text-brand-green'  },
        ].map(({ label, value, note, color }) => (
          <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <div>
              <div className="text-sm font-medium text-gray-700">{label}</div>
              <div className="text-xs text-gray-400">{note}</div>
            </div>
            <div className={`text-lg font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="section-label mb-3">Revenue Projections</div>
        {[
          { period: 'Month 1 (soft launch)', low: 18000, high: 28000 },
          { period: 'Month 3',               low: 32000, high: 45000 },
          { period: 'Month 6',               low: 42000, high: 55000 },
          { period: 'Year 1 Total',           low: 380000, high: 520000 },
        ].map(({ period, low, high }) => (
          <div key={period} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-600">{period}</span>
            <span className="text-sm font-bold text-gray-800">{fmt(low)} – {fmt(high)}</span>
          </div>
        ))}
        <p className="text-xs text-gray-400 mt-3">Ranges tighten to ±15% after lease, vendor quotes, and staffing plan are confirmed.</p>
      </div>
    </div>
  );
}

export default function BudgetSection() {
  const [view, setView] = useState('startup');
  return (
    <div className="flex flex-col h-full">
      {/* Pill toggle */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="pill-toggle">
          {[['startup','Startup'],['monthly','Monthly'],['dashboard','Dashboard']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`pill-tab ${view === id ? 'pill-tab-active' : 'pill-tab-inactive'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {view === 'startup'   && <StartupView/>}
        {view === 'monthly'   && <MonthlyView/>}
        {view === 'dashboard' && <DashboardView/>}
      </div>
    </div>
  );
}
