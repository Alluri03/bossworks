import { useState } from 'react';
import { EXECUTION_PROJECTS, TASK_TYPES, TEAM_MEMBERS } from '../data/appData';
import { Icons } from './Icons';

const ORANGE = '#E8722A';

/* ── Team lookup ────────────────────────────────────────────── */
const memberById = id => TEAM_MEMBERS.find(m => m.id === id) || null;

/* ── Avatar ─────────────────────────────────────────────────── */
// Always uses the member's own color — never the project color
function Avatar({ memberId }) {
  const member = memberById(memberId);
  if (!member) return null;
  return (
    <div
      className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-white text-[9px] flex-shrink-0"
      style={{ backgroundColor: member.color }}
      title={member.name}
    >
      {member.initials}
    </div>
  );
}

/* Tasks keyed by project id */
const PROJECT_TASKS = {
  'ep-1': [
    { id: 't1-1', title: 'Survey 20 potential customers on ramen preferences',  type: TASK_TYPES.VALIDATION, status: 'in-progress', priority: 'high',   assignee: 'u-1', notifications: 1 },
    { id: 't1-2', title: 'Map 10 direct & indirect competitors',                 type: TASK_TYPES.VALIDATION, status: 'in-progress', priority: 'high',   assignee: 'u-1', notifications: 0 },
    { id: 't1-3', title: 'Define catchment area and foot-traffic estimate',      type: TASK_TYPES.INPUT,      status: 'todo',        priority: 'medium', assignee: 'u-3', notifications: 1 },
    { id: 't1-4', title: 'Analyse competitor pricing and menu gaps',             type: TASK_TYPES.VALIDATION, status: 'todo',        priority: 'medium', assignee: 'u-1', notifications: 0 },
    { id: 't1-5', title: 'Identify underserved day-parts (lunch / late-night)',  type: TASK_TYPES.VALIDATION, status: 'todo',        priority: 'low',    assignee: 'u-3', notifications: 0 },
  ],
  'ep-2': [
    { id: 't2-1', title: 'Shortlist 5 venues on South Congress corridor',        type: TASK_TYPES.INPUT,      status: 'in-progress', priority: 'high',   assignee: 'u-3', notifications: 0 },
    { id: 't2-2', title: 'Record sq ft, asking rent, and fit-out condition',     type: TASK_TYPES.INPUT,      status: 'todo',        priority: 'high',   assignee: 'u-3', notifications: 0 },
    { id: 't2-3', title: 'Check zoning and health-permit eligibility per site',  type: TASK_TYPES.VALIDATION, status: 'todo',        priority: 'medium', assignee: 'u-2', notifications: 0 },
    { id: 't2-4', title: 'Estimate leasehold improvement cost per site',         type: TASK_TYPES.INPUT,      status: 'todo',        priority: 'medium', assignee: 'u-3', notifications: 0 },
  ],
  'ep-3': [
    { id: 't3-1', title: 'Get 3 quotes for Berkshire pork from local farms',     type: TASK_TYPES.INPUT,      status: 'todo',        priority: 'high',   assignee: 'u-2', notifications: 1 },
    { id: 't3-2', title: 'Source noodle supplier and get sample pricing',        type: TASK_TYPES.INPUT,      status: 'todo',        priority: 'medium', assignee: 'u-2', notifications: 0 },
    { id: 't3-3', title: 'Arrange ingredient tasting with top 2 suppliers',      type: TASK_TYPES.VALIDATION, status: 'todo',        priority: 'medium', assignee: 'u-1', notifications: 0 },
    { id: 't3-4', title: 'Confirm backup suppliers for key ingredients',         type: TASK_TYPES.INPUT,      status: 'todo',        priority: 'low',    assignee: 'u-2', notifications: 0 },
  ],
  'ep-4': [
    { id: 't4-1', title: 'Register LLC with Texas Secretary of State',           type: TASK_TYPES.INPUT,      status: 'in-progress', priority: 'high',   assignee: 'u-3', notifications: 0 },
    { id: 't4-2', title: 'Apply for EIN from IRS',                               type: TASK_TYPES.INPUT,      status: 'todo',        priority: 'high',   assignee: 'u-3', notifications: 0 },
    { id: 't4-3', title: 'Research food handler permits and health inspections', type: TASK_TYPES.VALIDATION, status: 'todo',        priority: 'medium', assignee: 'u-2', notifications: 0 },
  ],
};

const PRIORITY_DOT = { high: 'bg-red-400', medium: 'bg-brand-orange', low: 'bg-gray-300' };

/* ── Project card ──────────────────────────────────────────── */
function ProjectCard({ project, onClick }) {
  const isLocked = project.status === 'locked';
  const pct      = project.tasks > 0 ? Math.round((project.completedTasks / project.tasks) * 100) : 0;
  const owner    = memberById(project.owner);

  if (isLocked) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-3">
        {/* Lock badge */}
        <div className="w-8 h-8 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
          <Icons.Lock size={14} className="text-gray-400"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-400 truncate">{project.title}</div>
          <div className="text-[11px] text-gray-400 truncate mt-0.5">{project.description}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">

          {/* Title row */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-gray-800 truncate">{project.title}</span>
          </div>

          {/* Description — single line */}
          <div className="text-[11px] text-gray-400 truncate mb-2">{project.description}</div>

          {/* Progress row */}
          <div className="flex items-center gap-2 mb-2">
            <div className="progress-bar flex-1">
              <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: ORANGE }}/>
            </div>
            <span className="text-[11px] font-bold flex-shrink-0" style={{ color: ORANGE }}>{pct}%</span>
            <span className="text-[11px] text-gray-400 flex-shrink-0">{project.completedTasks}/{project.tasks}</span>
          </div>

          {/* Owner + notification — same bottom row */}
          <div className="flex items-center justify-between">
            {owner && (
              <div className="flex items-center gap-1.5">
                <Avatar memberId={project.owner}/>
                <span className="text-[11px] text-gray-500">{owner.name}</span>
              </div>
            )}
            {project.notifications > 0 && (
              <div className="flex items-center gap-1 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"/>
                <span className="text-[10px] font-semibold text-red-500">
                  {project.notifications} update{project.notifications > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        <Icons.ChevronRight size={14} className="text-gray-300 flex-shrink-0"/>
      </div>
    </div>
  );
}

/* ── Task row ──────────────────────────────────────────────── */
function TaskRow({ task, projectTitle, done, onToggle }) {
  const assignee = memberById(task.assignee);

  return (
    <div className={`card flex items-start gap-3 transition-all ${done ? 'opacity-50' : ''}`}>
      <button
        className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
          done ? 'bg-brand-green border-brand-green' : 'border-gray-300 hover:border-brand-orange'
        }`}
        onClick={onToggle}
      >
        {done && <Icons.Check size={10} className="text-white"/>}
      </button>

      <div className="flex-1 min-w-0">
        {/* Task title */}
        <div className={`text-sm font-medium leading-snug mb-1.5 ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </div>

        {/* Meta row — project tag · priority */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: `${ORANGE}18`, color: ORANGE }}
          >
            {projectTitle}
          </span>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority]}`}/>
          <span className="text-[10px] text-gray-400 capitalize flex-shrink-0">{task.priority}</span>
        </div>

        {/* Assignee + notification — mirrors project card bottom row */}
        <div className="flex items-center justify-between">
          {assignee && (
            <div className="flex items-center gap-1.5">
              <Avatar memberId={task.assignee}/>
              <span className="text-[11px] text-gray-500">{assignee.name}</span>
            </div>
          )}
          {task.notifications > 0 && (
            <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"/>
              <span className="text-[10px] font-semibold text-blue-500">{task.notifications}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── All tasks view (flat) ─────────────────────────────────── */
function AllTasksView({ activeProjects }) {
  const [done, setDone] = useState({});

  const allTasks = activeProjects.flatMap(proj =>
    (PROJECT_TASKS[proj.id] || []).map(t => ({ ...t, projectTitle: proj.title }))
  );

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const statusOrder   = { 'in-progress': 0, todo: 1 };
  const sorted = [...allTasks].sort((a, b) => {
    if (done[a.id] !== done[b.id]) return done[a.id] ? 1 : -1;
    const sd = (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2);
    if (sd !== 0) return sd;
    return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
  });

  return (
    <div className="space-y-2">
      {sorted.map(task => (
        <TaskRow
          key={task.id}
          task={task}
          projectTitle={task.projectTitle}
          done={!!done[task.id]}
          onToggle={() => setDone(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
        />
      ))}
      <button className="w-full card border-dashed border-gray-200 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-brand-orange hover:border-brand-orange transition-all mt-1">
        <Icons.Plus size={14}/>
        Add Task
      </button>
    </div>
  );
}

/* ── Project detail ────────────────────────────────────────── */
function ProjectDetail({ project, onBack }) {
  const tasks = PROJECT_TASKS[project.id] || [];
  const owner = memberById(project.owner);
  const [done, setDone] = useState({});

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const statusOrder   = { 'in-progress': 0, todo: 1 };
  const sorted = [...tasks].sort((a, b) => {
    if (done[a.id] !== done[b.id]) return done[a.id] ? 1 : -1;
    const sd = (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2);
    if (sd !== 0) return sd;
    return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
  });

  const completedCount = tasks.filter(t => done[t.id] || t.status === 'complete').length;
  const pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <Icons.ChevronRight size={14} className="rotate-180"/>
        All Projects
      </button>

      {/* Project summary card — no icon, matches project card layout */}
      <div className="card">
        <div className="font-bold text-gray-800 mb-0.5">{project.title}</div>
        <div className="text-xs text-gray-400 mb-3 leading-snug">{project.description}</div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-3">
          <div className="progress-bar flex-1">
            <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: ORANGE }}/>
          </div>
          <span className="text-[11px] font-bold flex-shrink-0" style={{ color: ORANGE }}>{pct}%</span>
          <span className="text-[11px] text-gray-400 flex-shrink-0">{completedCount}/{tasks.length}</span>
        </div>

        {/* Owner row — same pattern as project card */}
        {owner && (
          <div className="flex items-center gap-1.5">
            <Avatar memberId={project.owner}/>
            <span className="text-[11px] text-gray-500">Owner · {owner.name}</span>
          </div>
        )}
      </div>

      <div className="section-label px-1">Tasks</div>
      <div className="space-y-2">
        {sorted.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            projectTitle={project.title}
            done={!!done[task.id]}
            onToggle={() => setDone(prev => ({ ...prev, [task.id]: !prev[task.id] }))}
          />
        ))}
      </div>

      <button className="w-full card border-dashed border-gray-200 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-brand-orange hover:border-brand-orange transition-all">
        <Icons.Plus size={14}/>
        Add Task
      </button>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────── */
export default function TrackSection() {
  const [view,             setView]            = useState('projects');
  const [selectedProject, setSelectedProject]  = useState(null);

  const activeProjects = EXECUTION_PROJECTS.filter(p => p.phase === 'active');
  const lockedProjects = EXECUTION_PROJECTS.filter(p => p.phase === 'post-plan');

  if (selectedProject) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Pill toggle */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="pill-toggle">
          {[['projects', 'Projects'], ['tasks', 'Tasks']].map(([id, label]) => (
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
        {view === 'projects' && (
          <>
            {activeProjects.map(p => (
              <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />
            ))}

<div className="section-label px-1 mt-2">Execution Phase: Unlocks When Plan is Complete</div>
            {lockedProjects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </>
        )}

        {view === 'tasks' && (
          <AllTasksView activeProjects={activeProjects} />
        )}
      </div>
    </div>
  );
}
