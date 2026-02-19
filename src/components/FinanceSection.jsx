import { useState } from 'react';
import { FINANCE_DATA, REVENUE_DATA, FINANCIAL_PLAN_DATA } from '../data/appData';
import { Icons } from './Icons';

function fmt(n) {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n.toLocaleString()}`;
}

/* ── Add Expense Form ───────────────────────────────────────── */
function AddExpenseForm({ projects, onAdd }) {
  const [amount,  setAmount]  = useState('');
  const [project, setProject] = useState(projects[0] || '');
  const [reason,  setReason]  = useState('');
  const MAX = 120;

  function handleSubmit() {
    if (!amount || !reason.trim()) return;
    onAdd({ amount: parseFloat(amount), project, reason: reason.trim() });
    setAmount('');
    setReason('');
  }

  return (
    <div className="card space-y-3">
      <div className="section-label">Add Expense</div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          Amount
        </label>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <span className="text-sm font-semibold text-gray-500 mr-1">$</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Project */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
          Project
        </label>
        <select
          value={project}
          onChange={e => setProject(e.target.value)}
          className="input-field"
        >
          {projects.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Reason */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Reason
          </label>
          <span className={`text-[10px] font-medium ${reason.length > MAX * 0.9 ? 'text-brand-orange' : 'text-gray-400'}`}>
            {reason.length}/{MAX}
          </span>
        </div>
        <textarea
          className="textarea-field"
          rows={2}
          maxLength={MAX}
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="What was this expense for?"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!amount || !reason.trim()}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Add Expense
      </button>
    </div>
  );
}

/* ── Expense List ───────────────────────────────────────────── */
function ExpenseList({ expenses }) {
  if (expenses.length === 0) {
    return (
      <div className="card text-center py-6">
        <div className="text-2xl mb-2">🧾</div>
        <div className="text-sm text-gray-500 font-medium">No expenses yet</div>
        <div className="text-xs text-gray-400 mt-1">Add your first expense above</div>
      </div>
    );
  }
  return (
    <div className="card space-y-3">
      {expenses.map((exp, i) => (
        <div key={exp.id || i} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-brand-orange">${exp.amount >= 1000 ? (exp.amount / 1000).toFixed(1) + 'k' : exp.amount}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                {exp.project}
              </span>
              <span className="text-[10px] text-gray-400 flex-shrink-0">{exp.date}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1 leading-snug">{exp.reason}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Project Grouping ───────────────────────────────────────── */
function ProjectList({ expenses }) {
  const grouped = expenses.reduce((acc, exp) => {
    if (!acc[exp.project]) acc[exp.project] = 0;
    acc[exp.project] += exp.amount;
    return acc;
  }, {});

  const entries = Object.entries(grouped);

  if (entries.length === 0) {
    return (
      <div className="card text-center py-6">
        <div className="text-2xl mb-2">📂</div>
        <div className="text-sm text-gray-500 font-medium">No project expenses yet</div>
      </div>
    );
  }

  return (
    <div className="card space-y-3">
      {entries.map(([proj, total]) => (
        <div key={proj} className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-orange"/>
            <span className="text-sm text-gray-700">{proj}</span>
          </div>
          <span className="text-sm font-bold text-gray-800">{fmt(total)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Add Revenue Form ───────────────────────────────────────── */
function AddRevenueForm({ sources, onAdd }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState(sources[0] || '');
  const [note,   setNote]   = useState('');
  const MAX = 120;

  function handleSubmit() {
    if (!amount) return;
    onAdd({ amount: parseFloat(amount), source, note: note.trim() });
    setAmount('');
    setNote('');
  }

  return (
    <div className="card space-y-3">
      <div className="section-label">Add Revenue</div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Amount</label>
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <span className="text-sm font-semibold text-gray-500 mr-1">$</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Source</label>
        <select value={source} onChange={e => setSource(e.target.value)} className="input-field">
          {sources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Note</label>
          <span className={`text-[10px] font-medium ${note.length > MAX * 0.9 ? 'text-brand-orange' : 'text-gray-400'}`}>
            {note.length}/{MAX}
          </span>
        </div>
        <textarea
          className="textarea-field"
          rows={2}
          maxLength={MAX}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Saturday lunch service"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!amount}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Add Revenue
      </button>
    </div>
  );
}

/* ── Revenue List ───────────────────────────────────────────── */
function RevenueList({ entries }) {
  if (entries.length === 0) {
    return (
      <div className="card text-center py-6">
        <div className="text-2xl mb-2">💵</div>
        <div className="text-sm text-gray-500 font-medium">No revenue logged yet</div>
        <div className="text-xs text-gray-400 mt-1">Add your first revenue entry above</div>
      </div>
    );
  }
  return (
    <div className="card space-y-3">
      {entries.map((entry, i) => (
        <div key={entry.id || i} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-brand-green">${entry.amount >= 1000 ? (entry.amount / 1000).toFixed(1) + 'k' : entry.amount}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold bg-green-50 text-green-600 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                {entry.source}
              </span>
              <span className="text-[10px] text-gray-400 flex-shrink-0">{entry.date}</span>
            </div>
            {entry.note && <div className="text-xs text-gray-600 mt-1 leading-snug">{entry.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Revenue Tab ────────────────────────────────────────────── */
function RevenueView() {
  const [entries, setEntries] = useState(REVENUE_DATA.entries);
  const projected = FINANCIAL_PLAN_DATA.projections[0].months[0].revenue;
  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  function handleAdd(newEntry) {
    setEntries(prev => [...prev, { ...newEntry, id: `r-${Date.now()}`, date: 'Today' }]);
  }

  return (
    <div className="space-y-3">
      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center shadow-none px-2">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Total</div>
          <div className="text-base font-bold text-brand-green">{fmt(total)}</div>
        </div>
        <div className="card text-center shadow-none px-2">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">This Month</div>
          <div className="text-base font-bold text-gray-800">{fmt(entries.filter(e => e.date === 'Today').reduce((s, e) => s + e.amount, 0))}</div>
        </div>
        <div className="card text-center shadow-none px-2">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Projected</div>
          <div className="text-base font-bold text-gray-400">{fmt(projected)}</div>
        </div>
      </div>

      <AddRevenueForm sources={REVENUE_DATA.sources} onAdd={handleAdd} />

      <div className="flex items-center justify-between px-1">
        <div className="section-label">Revenue Entries</div>
        {total > 0 && <span className="text-xs font-bold text-brand-green">{fmt(total)} total</span>}
      </div>

      <RevenueList entries={entries} />
    </div>
  );
}

/* ── Expenses Tab ───────────────────────────────────────────── */
function ExpensesView() {
  const [expSubView, setExpSubView] = useState('expense');
  const [expenses, setExpenses]     = useState(FINANCE_DATA.expenses);

  function handleAdd(newExp) {
    setExpenses(prev => [
      ...prev,
      { ...newExp, id: `e-${Date.now()}`, date: 'Today' },
    ]);
  }

  return (
    <div className="space-y-3">
      <AddExpenseForm projects={FINANCE_DATA.projects} onAdd={handleAdd} />

      {/* Project Expenses header + sub-toggle */}
      <div className="flex items-center justify-between px-1">
        <div className="section-label">Project Expenses</div>
        <div className="pill-toggle" style={{ padding: 2 }}>
          {[['expense', 'Expense'], ['project', 'Project']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setExpSubView(id)}
              className={`pill-tab text-[11px] py-1 px-3 ${expSubView === id ? 'pill-tab-active' : 'pill-tab-inactive'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {expSubView === 'expense' && <ExpenseList expenses={expenses} />}
      {expSubView === 'project' && <ProjectList expenses={expenses} />}
    </div>
  );
}

/* ── Dashboard Tab ──────────────────────────────────────────── */
function DashboardView() {
  const { budgetRequired, budgetAvailable, amountSpent, amountRemaining } = FINANCE_DATA;
  const stillNeed = budgetRequired - budgetAvailable;

  return (
    <div className="space-y-3">
      {/* Row 1: Budget Required | Budget Available */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center shadow-none">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Budget Required</div>
          <div className="text-xl font-bold text-gray-800">{fmt(budgetRequired)}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Estimated startup</div>
        </div>
        <div className="card text-center shadow-none">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Budget Available</div>
          <div className="text-xl font-bold text-brand-green">{fmt(budgetAvailable)}</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
              <Icons.Plus size={10} className="text-brand-green"/>
            </div>
            <span className="text-[10px] text-gray-400">Add funds</span>
          </div>
        </div>
      </div>

      {/* Still Need */}
      <div className="bg-white rounded-2xl p-4 border-2 border-orange-200 shadow-sm">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Still Need</div>
        <div className="text-3xl font-bold text-brand-orange">-{fmt(stillNeed)}</div>
        <div className="text-xs text-gray-400 mt-0.5">to reach your budget goal</div>
      </div>

      {/* Row 2: Amount Spent | Amount Remaining */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center shadow-none">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Amount Spent</div>
          <div className="text-xl font-bold text-red-500">{fmt(amountSpent)}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">So far</div>
        </div>
        <div className="card text-center shadow-none">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Amount Remaining</div>
          <div className="text-xl font-bold text-brand-indigo">{fmt(amountRemaining)}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Of required</div>
        </div>
      </div>

      {/* Add Budget Available CTA */}
      <button className="w-full rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 py-4 flex flex-col items-center gap-1.5 hover:border-brand-orange hover:bg-orange-50 transition-all active:scale-95">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          <Icons.Plus size={16} className="text-brand-orange"/>
        </div>
        <span className="text-sm font-semibold text-brand-orange">Add Budget Available</span>
        <span className="text-xs text-orange-400">Track funds you have secured</span>
      </button>
    </div>
  );
}

/* ── Main Export ────────────────────────────────────────────── */
export default function FinanceSection() {
  const [view, setView] = useState('expenses');

  return (
    <div className="flex flex-col h-full">
      {/* Pill toggle */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="pill-toggle">
          {[['expenses', 'Expenses'], ['revenue', 'Revenue'], ['dashboard', 'Dashboard']].map(([id, label]) => (
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

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {view === 'expenses'  && <ExpensesView />}
        {view === 'revenue'   && <RevenueView />}
        {view === 'dashboard' && <DashboardView />}
      </div>
    </div>
  );
}
