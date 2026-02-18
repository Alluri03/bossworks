export const PLAN_STAGES = {
  SHELL: 'shell',
  V05: 'v0.5',
  V10: 'v1.0',
};

export const TEAM_MEMBERS = [
  { id: 'u-1', name: 'Sarah',  initials: 'S', color: '#3B82F6' },
  { id: 'u-2', name: 'Mike',   initials: 'M', color: '#3B82F6' },
  { id: 'u-3', name: 'You',    initials: 'Y', color: '#3B82F6' },
];

export const TASK_TYPES = {
  INPUT: 'input',
  EXECUTION: 'execution',
  VALIDATION: 'validation',
};

export const PLAN_SHELL = {
  problem: 'Authentic Japanese ramen is unavailable in South Austin — residents travel 30+ min for quality ramen.',
  customer: 'Young professionals, families, and food enthusiasts in South Austin aged 22–45.',
  valueProp: 'Tonkotsu-first ramen shop with locally sourced pork, open-kitchen experience, and delivery.',
  locationThesis: 'South Congress Ave corridor — high foot traffic, underserved Asian dining.',
  pricingAssumption: 'Bowl $14–$18. Target ATV $22.',
  competitors: ['Ramen Tatsu-Ya', 'Uchi', 'Soup Peddler'],
  confidenceScore: 42,
};

// Business profile — single source of truth for app header + pre-fills
export const BUSINESS_PROFILE = {
  businessName: 'Ramen Shop',
  emoji: '🍜',
  location: 'South Austin, TX',
};

// Demo onboarding data (mirrors what real onboarding would collect)
export const DEMO_ONBOARDING_DATA = {
  businessName: 'Ramen Shop',
  businessIdea: 'An authentic Japanese ramen restaurant in South Austin serving tonkotsu-first bowls with locally sourced pork and an open-kitchen experience.',
  uniqueness: 'Only authentic ramen in South Austin — locally sourced pork, open kitchen, late-night hours.',
  location: 'South Austin, TX',
};

// Converts onboarding answers into a pre-filled plan tasks array
export function buildPlanTasks(onboarding = {}) {
  const {
    businessName = 'My Business',
    businessIdea = '',
    uniqueness = '',
    location = '',
  } = onboarding;

  return [
    // ── Brand Identity — name, location, tagline only ─────────────
    {
      id: 'pb-0',
      phase: 'Brand Identity',
      icon: '🏷️',
      type: TASK_TYPES.INPUT,
      title: 'Brand Identity',
      status: 'complete',
      fields: [
        { key: 'businessName', label: 'Business Name',       value: businessName },
        { key: 'location',     label: 'Location',            value: location },
        { key: 'tagline',      label: 'Tagline / One-liner', value: '' },
      ],
    },
    // ── Customer & Offer ─────────────────────────────────────────
    {
      id: 'pb-1',
      phase: 'Customer & Offer',
      icon: '👥',
      type: TASK_TYPES.INPUT,
      title: 'Ideal Customer Profile',
      status: 'complete',
      fields: [
        { key: 'icp',     label: 'Primary Customer',  value: 'Young professionals 25–38, $65k+ income, foodie-curious' },
        { key: 'pains',   label: 'Top 3 Pains',        value: 'No authentic ramen nearby; long waits at competition; no late-night option' },
        { key: 'promise', label: 'Core Promise',        value: 'Best bowl in South Austin, ready in 12 minutes' },
      ],
    },
    {
      id: 'pb-2',
      phase: 'Customer & Offer',
      icon: '🍜',
      type: TASK_TYPES.INPUT,
      title: 'Menu & Service Model',
      // businessIdea pre-fills the "What You Offer" field — directly answers what the business does
      status: businessIdea ? 'in-progress' : 'todo',
      fields: [
        { key: 'whatYouOffer', label: 'What You Offer',      value: businessIdea },
        { key: 'menuItems',    label: 'Core Menu / Services', value: '6 ramen bowls, 4 starters, 3 drinks, daily special' },
        { key: 'packages',     label: 'Service Channels',     value: 'Dine-in, Takeout, Catering (groups 10+)' },
        { key: 'avgCheck',     label: 'Target Avg Check',     value: '$22 per person' },
      ],
    },
    {
      id: 'pb-3',
      phase: 'Market & Competitors',
      icon: '🔍',
      type: TASK_TYPES.VALIDATION,
      title: 'Market & Competitor Analysis',
      status: 'in-progress',
      fields: [
        { key: 'marketSize',      label: 'Target Market Size', value: `~180,000 residents in ${location || 'your area'} catchment` },
        { key: 'competitors',     label: 'Mapped Competitors', value: '7 of 10 complete' },
        // uniqueness pre-fills Key Differentiator — that's exactly what the user described
        { key: 'differentiation', label: 'Key Differentiator', value: uniqueness || 'Local pork sourcing + open kitchen + late-night' },
      ],
    },
    {
      id: 'pb-4',
      phase: 'Location & Operations',
      icon: '📍',
      type: TASK_TYPES.INPUT,
      title: 'Location & Premises',
      status: 'in-progress',
      fields: [
        // location pre-fills Target Location — direct match
        { key: 'location',   label: 'Target Location',   value: location || 'South Congress Ave corridor' },
        { key: 'size',       label: 'Space Requirement', value: '1,200–1,800 sq ft, ground floor' },
        { key: 'fitOut',     label: 'Fit-Out Estimate',  value: '$28,000–$35,000' },
      ],
    },
  {
    id: 'pb-5',
    phase: 'Location & Operations',
    icon: '👨‍🍳',
    type: TASK_TYPES.INPUT,
    title: 'Team & Staffing Plan',
    status: 'todo',
    fields: [
      { key: 'founders',    label: 'Founders / Roles',    value: '' },
      { key: 'keyHires',    label: 'Key Hires (Day 1)',   value: '' },
      { key: 'laborCost',   label: 'Est. Monthly Labor',  value: '' },
    ],
  },
  {
    id: 'pb-6',
    phase: 'Unit Economics',
    icon: '💰',
    type: TASK_TYPES.INPUT,
    title: 'Price & COGS Assumptions',
    status: 'in-progress',
    fields: [
      { key: 'avgPrice',    label: 'Avg Bowl Price',        value: '$16' },
      { key: 'cogsRange',   label: 'COGS Range',            value: '28–34% (target 30%)' },
      { key: 'grossMargin', label: 'Gross Margin Target',   value: '66–72%' },
    ],
  },
  {
    id: 'pb-7',
    phase: 'Unit Economics',
    icon: '📊',
    type: 'smart',
    title: 'Break-Even Analysis',
    status: 'complete',
    smartLink: 'financial',
    fields: [],
  },
  {
    id: 'pb-8',
    phase: 'Legal & Compliance',
    icon: '⚖️',
    type: TASK_TYPES.INPUT,
    title: 'Legal & Licensing',
    status: 'in-progress',
    fields: [
      { key: 'entity',    label: 'Business Entity',      value: 'LLC — filing in progress' },
      { key: 'licenses',  label: 'Required Licenses',    value: '' },
      { key: 'timeline',  label: 'Filing Timeline',      value: '' },
    ],
  },
  {
    id: 'pb-9',
    phase: 'Go-to-Market',
    icon: '🚀',
    type: TASK_TYPES.INPUT,
    title: 'Marketing & Launch Strategy',
    status: 'todo',
    fields: [
      { key: 'channels',    label: 'Marketing Channels',   value: '' },
      { key: 'softLaunch',  label: 'Soft Launch Plan',     value: '' },
      { key: 'openingWeek', label: 'Opening Week Target',  value: '' },
    ],
  },
  ]; // end buildPlanTasks
}

// Legacy static export for any components not yet migrated
export const PLAN_BUILDER_TASKS = buildPlanTasks(DEMO_ONBOARDING_DATA);

export const EXECUTION_PROJECTS = [
  // ── Active now (can run while building the plan) ──────────────
  {
    id: 'ep-1',
    title: 'Market Research',
    icon: '🔍',
    color: '#10B981',
    status: 'in-progress',
    phase: 'active',
    unlockCondition: null,
    tasks: 5,
    completedTasks: 2,
    description: 'Competitor mapping, customer surveys, foot traffic analysis',
    owner: 'u-1',
    notifications: 2,
  },
  {
    id: 'ep-2',
    title: 'Location Scouting',
    icon: '📍',
    color: '#F59E0B',
    status: 'in-progress',
    phase: 'active',
    unlockCondition: null,
    tasks: 4,
    completedTasks: 1,
    description: 'Shortlist venues on South Congress, assess rent & fit-out costs',
    owner: 'u-3',
    notifications: 0,
  },
  {
    id: 'ep-3',
    title: 'Supplier Sourcing',
    icon: '🥩',
    color: '#06B6D4',
    status: 'todo',
    phase: 'active',
    unlockCondition: null,
    tasks: 4,
    completedTasks: 0,
    description: 'Call farms & distributors, get ingredient quotes, arrange tastings',
    owner: 'u-2',
    notifications: 1,
  },
  {
    id: 'ep-4',
    title: 'Legal Groundwork',
    icon: '⚖️',
    color: '#6366F1',
    status: 'in-progress',
    phase: 'active',
    unlockCondition: null,
    tasks: 3,
    completedTasks: 1,
    description: 'LLC formation, EIN, food handler & health permit research',
    owner: 'u-3',
    notifications: 0,
  },

  // ── Unlocked after plan is complete ──────────────────────────
  {
    id: 'ep-6',
    title: 'Brand Identity',
    icon: '🎨',
    color: '#EC4899',
    status: 'locked',
    phase: 'post-plan',
    unlockCondition: 'Complete Business Plan',
    tasks: 8,
    completedTasks: 0,
    description: 'Logo, colour palette, menu design, signage',
  },
  {
    id: 'ep-7',
    title: 'Lease & Fit-Out',
    icon: '🏗️',
    color: '#F59E0B',
    status: 'locked',
    phase: 'post-plan',
    unlockCondition: 'Complete Business Plan',
    tasks: 7,
    completedTasks: 0,
    description: 'Sign lease, kitchen build-out, equipment install',
  },
  {
    id: 'ep-8',
    title: 'Hiring & Training',
    icon: '👥',
    color: '#F97316',
    status: 'locked',
    phase: 'post-plan',
    unlockCondition: 'Complete Business Plan',
    tasks: 10,
    completedTasks: 0,
    description: 'Hire kitchen & FOH staff, run training before soft launch',
  },
  {
    id: 'ep-9',
    title: 'Technology & POS',
    icon: '💻',
    color: '#8B5CF6',
    status: 'locked',
    phase: 'post-plan',
    unlockCondition: 'Complete Business Plan',
    tasks: 5,
    completedTasks: 0,
    description: 'POS, online ordering, delivery platform integrations',
  },
  {
    id: 'ep-10',
    title: 'Marketing & Pre-Launch',
    icon: '📣',
    color: '#EF4444',
    status: 'locked',
    phase: 'post-plan',
    unlockCondition: 'Complete Brand Identity',
    tasks: 12,
    completedTasks: 0,
    description: 'Social media, PR, influencer outreach, soft launch event',
  },
  {
    id: 'ep-11',
    title: 'Funding Applications',
    icon: '💰',
    color: '#10B981',
    status: 'locked',
    phase: 'post-plan',
    unlockCondition: 'Complete Business Plan',
    tasks: 6,
    completedTasks: 0,
    description: 'Submit grants and SBA loan application with completed plan',
  },
];

export const FUNDING_OPPORTUNITIES = [
  {
    id: 'f-1',
    name: 'Texas Restaurant Association Foundation Grant',
    type: 'Grant',
    amount: '$10,000 – $25,000',
    match: 87,
    deadline: 'Mar 15, 2025',
    requirements: ['TX-based', 'Food service', 'Under $1M revenue', 'BIPOC/Women preferred'],
    status: 'Apply Now',
    color: '#10B981',
  },
  {
    id: 'f-2',
    name: 'City of Austin Small Business Program',
    type: 'Grant',
    amount: '$5,000 – $15,000',
    match: 79,
    deadline: 'Rolling',
    requirements: ['Austin-based', 'Under 50 employees', 'Under $5M revenue'],
    status: 'Apply Now',
    color: '#10B981',
  },
  {
    id: 'f-3',
    name: 'SBA 7(a) Startup Loan',
    type: 'Loan',
    amount: '$50k – $500k',
    match: 72,
    deadline: 'Rolling',
    requirements: ['US-based', 'Business plan required', 'Personal guarantee', 'Credit 650+'],
    status: 'Apply Now',
    color: '#F59E0B',
  },
  {
    id: 'f-4',
    name: 'National Restaurant Association Scholarship',
    type: 'Grant',
    amount: '$2,500 – $10,000',
    match: 65,
    deadline: 'Apr 1, 2025',
    requirements: ['Restaurant industry', 'Training/education focus'],
    status: 'Apply Now',
    color: '#10B981',
  },
  {
    id: 'f-5',
    name: 'Accion Opportunity Fund',
    type: 'Loan',
    amount: '$5k – $100k',
    match: 61,
    deadline: 'Rolling',
    requirements: ['Minority-owned preferred', 'Business plan', 'Bank statements 3 months'],
    status: 'Apply Now',
    color: '#6366F1',
  },
];

export const BUDGET_DATA = {
  startupCosts: [
    { category: 'Equipment & Kitchen', budgeted: 45000, actual: 0, status: 'estimated' },
    { category: 'Leasehold Improvements', budgeted: 30000, actual: 0, status: 'estimated' },
    { category: 'Legal & Licensing', budgeted: 3500, actual: 1200, status: 'in-progress' },
    { category: 'Branding & Marketing', budgeted: 8000, actual: 0, status: 'estimated' },
    { category: 'Technology & POS', budgeted: 4500, actual: 0, status: 'estimated' },
    { category: 'Initial Inventory', budgeted: 6000, actual: 0, status: 'estimated' },
    { category: 'Working Capital Reserve', budgeted: 15000, actual: 0, status: 'estimated' },
  ],
  monthlyFixed: [
    { category: 'Rent', budgeted: 6500, actual: 0 },
    { category: 'Labor (est.)', budgeted: 18000, actual: 0 },
    { category: 'Utilities', budgeted: 2200, actual: 0 },
    { category: 'Insurance', budgeted: 800, actual: 0 },
    { category: 'Technology', budgeted: 450, actual: 0 },
    { category: 'Marketing', budgeted: 1500, actual: 0 },
  ],
};

export const FINANCE_DATA = {
  budgetRequired: 129000,
  budgetAvailable: 0,
  amountSpent: 1200,
  amountRemaining: 127800,
  expenses: [
    { id: 'e-1', amount: 1200, project: 'Legal Formation', reason: 'LLC filing fee + registered agent', date: 'Jan 12' },
  ],
  projects: ['Legal Formation', 'Market Research', 'Brand Identity', 'Technology & POS', 'General'],
};

export const FINANCIAL_PLAN_DATA = {
  estimatedBudget: 129000,
  breakEvenMonth: 6,
  projections: [
    { period: '1-12', months: [
      { m: 1,  revenue: 22000, expenses: 31200, net: -9200  },
      { m: 2,  revenue: 31000, expenses: 29500, net:  1500  },
      { m: 3,  revenue: 38000, expenses: 30800, net:  7200  },
      { m: 4,  revenue: 42000, expenses: 30800, net: 11200  },
      { m: 5,  revenue: 46000, expenses: 31500, net: 14500  },
      { m: 6,  revenue: 51000, expenses: 32000, net: 19000  },
      { m: 7,  revenue: 53000, expenses: 32000, net: 21000  },
      { m: 8,  revenue: 55000, expenses: 32500, net: 22500  },
      { m: 9,  revenue: 56000, expenses: 33000, net: 23000  },
      { m: 10, revenue: 57000, expenses: 33000, net: 24000  },
      { m: 11, revenue: 58000, expenses: 33500, net: 24500  },
      { m: 12, revenue: 60000, expenses: 34000, net: 26000  },
    ]},
    { period: '13-24', months: [
      { m: 13, revenue: 62000, expenses: 35000, net: 27000 },
      { m: 14, revenue: 63000, expenses: 35000, net: 28000 },
      { m: 15, revenue: 65000, expenses: 36000, net: 29000 },
      { m: 16, revenue: 67000, expenses: 36000, net: 31000 },
      { m: 17, revenue: 68000, expenses: 36500, net: 31500 },
      { m: 18, revenue: 70000, expenses: 37000, net: 33000 },
      { m: 19, revenue: 72000, expenses: 37000, net: 35000 },
      { m: 20, revenue: 73000, expenses: 37500, net: 35500 },
      { m: 21, revenue: 75000, expenses: 38000, net: 37000 },
      { m: 22, revenue: 76000, expenses: 38000, net: 38000 },
      { m: 23, revenue: 78000, expenses: 39000, net: 39000 },
      { m: 24, revenue: 80000, expenses: 39000, net: 41000 },
    ]},
  ],
  assumptions: [
    { label: 'Avg Bowl Price',           value: '$16'     },
    { label: 'Gross Margin',             value: '66%'     },
    { label: 'Covers/Day (Month 1)',     value: '45'      },
    { label: 'Covers/Day (Month 6)',     value: '70'      },
    { label: 'Monthly Fixed Costs',      value: '$29,450' },
    { label: 'COGS %',                   value: '30%'     },
  ],
};

export const PITCH_DECK_SECTIONS = [
  {
    id: 'pd-1',
    slide: 1,
    title: 'Problem',
    status: 'todo',
    type: 'input',
    fields: [
      { key: 'painStatement',       label: 'The Problem',            value: '' },
      { key: 'whoFaces',            label: 'Who Faces This',         value: '' },
      { key: 'currentAlternatives', label: 'Current Alternatives',   value: '' },
    ],
  },
  {
    id: 'pd-2',
    slide: 2,
    title: 'Solution',
    status: 'todo',
    type: 'input',
    fields: [
      { key: 'solution',          label: 'Your Solution',            value: '' },
      { key: 'keyDifferentiator', label: 'Key Differentiator',       value: '' },
      { key: 'uniqueMechanism',   label: 'Unique Mechanism / Moat',  value: '' },
    ],
  },
  {
    id: 'pd-3',
    slide: 3,
    title: 'Market Size',
    status: 'todo',
    type: 'input',
    fields: [
      { key: 'tam', label: 'Total Addressable Market (TAM)', value: '' },
      { key: 'sam', label: 'Serviceable Market (SAM)',       value: '' },
      { key: 'som', label: 'Obtainable Market (SOM)',        value: '' },
    ],
  },
  {
    id: 'pd-4',
    slide: 4,
    title: 'Business Model',
    status: 'todo',
    type: 'input',
    fields: [
      { key: 'revenueStreams', label: 'Revenue Streams',  value: '' },
      { key: 'pricing',       label: 'Pricing Strategy', value: '' },
      { key: 'unitEconomics', label: 'Unit Economics',   value: '' },
    ],
  },
  {
    id: 'pd-5',
    slide: 5,
    title: 'Financial Snapshot',
    status: 'complete',
    type: 'smart',
    smartLink: 'financial',
    fields: [],
  },
  {
    id: 'pd-6',
    slide: 6,
    title: 'Team',
    status: 'todo',
    type: 'input',
    fields: [
      { key: 'founders',  label: 'Founders & Roles',   value: '' },
      { key: 'advisors',  label: 'Advisors / Mentors', value: '' },
      { key: 'keyHires',  label: 'Key Hires Planned',  value: '' },
    ],
  },
  {
    id: 'pd-7',
    slide: 7,
    title: 'The Ask',
    status: 'todo',
    type: 'input',
    fields: [
      { key: 'amountSeeking', label: 'Amount Seeking',      value: '' },
      { key: 'equityOffered', label: 'Equity / Terms',      value: '' },
      { key: 'milestones',    label: '12-Month Milestones', value: '' },
    ],
  },
];

export const FUNDING_APPLICATION_STEPS = {
  'f-1': [
    { id: 'fas-1-1', stepNum: 1, title: 'Business Plan Context', type: 'smart', status: 'complete', smartSource: 'plan' },
    {
      id: 'fas-1-2', stepNum: 2, title: 'Grant Application Essay', type: 'input', status: 'todo',
      fields: [
        { key: 'businessOverview', label: 'Business Overview (250 words)', value: '' },
        { key: 'communityImpact',  label: 'Community Impact Statement',    value: '' },
        { key: 'fundUseDetail',    label: 'How Will You Use These Funds?', value: '' },
      ],
    },
    {
      id: 'fas-1-3', stepNum: 3, title: 'Supporting Documents Checklist', type: 'input', status: 'todo',
      fields: [
        { key: 'taxId',      label: 'EIN / Tax ID',                                 value: '' },
        { key: 'bizAddress', label: 'Registered Business Address',                  value: '' },
        { key: 'ownerDemo',  label: 'Ownership Demographics (BIPOC/Women-owned?)',  value: '' },
      ],
    },
  ],
  'f-2': [
    { id: 'fas-2-1', stepNum: 1, title: 'Business Plan Context', type: 'smart', status: 'complete', smartSource: 'plan' },
    {
      id: 'fas-2-2', stepNum: 2, title: 'Austin Residency & Eligibility', type: 'input', status: 'todo',
      fields: [
        { key: 'austinAddress',  label: 'Austin Business Address',          value: '' },
        { key: 'employeeCount',  label: 'Current / Planned Employee Count', value: '' },
        { key: 'annualRevenue',  label: 'Last 12 Months Revenue (or $0)',   value: '' },
      ],
    },
    {
      id: 'fas-2-3', stepNum: 3, title: 'Program Application Narrative', type: 'input', status: 'todo',
      fields: [
        { key: 'businessNeed', label: 'What Is Your Biggest Business Need?', value: '' },
        { key: 'fundImpact',   label: 'How Will Funding Help You Grow?',     value: '' },
        { key: 'jobCreation',  label: 'Jobs You Plan to Create',             value: '' },
      ],
    },
  ],
  'f-3': [
    { id: 'fas-3-1', stepNum: 1, title: 'Business Plan Context', type: 'smart', status: 'complete', smartSource: 'plan' },
    {
      id: 'fas-3-2', stepNum: 2, title: 'Personal Financial Statement', type: 'input', status: 'todo',
      fields: [
        { key: 'personalAssets',      label: 'Personal Assets (summary)',      value: '' },
        { key: 'personalLiabilities', label: 'Personal Liabilities (summary)', value: '' },
        { key: 'creditScore',         label: 'Credit Score Range',             value: '' },
      ],
    },
    {
      id: 'fas-3-3', stepNum: 3, title: 'Business Plan Narrative', type: 'input', status: 'todo',
      fields: [
        { key: 'executiveSummary', label: 'Executive Summary (SBA Format)', value: '' },
        { key: 'managementTeam',   label: 'Management Team Experience',     value: '' },
        { key: 'repaymentPlan',    label: 'Loan Repayment Plan',            value: '' },
      ],
    },
    {
      id: 'fas-3-4', stepNum: 4, title: 'Collateral Documentation', type: 'input', status: 'todo',
      fields: [
        { key: 'collateralAssets',  label: 'Assets Offered as Collateral',     value: '' },
        { key: 'personalGuarantee', label: 'Personal Guarantee Statement',     value: '' },
        { key: 'bankStatements',    label: 'Bank Statements (3 months notes)', value: '' },
      ],
    },
  ],
  'f-4': [
    { id: 'fas-4-1', stepNum: 1, title: 'Business Plan Context', type: 'smart', status: 'complete', smartSource: 'plan' },
    {
      id: 'fas-4-2', stepNum: 2, title: 'Education & Training Proposal', type: 'input', status: 'todo',
      fields: [
        { key: 'trainingGoal',   label: 'Training / Education Goal',      value: '' },
        { key: 'programDetails', label: 'Program Name & Institution',     value: '' },
        { key: 'industryImpact', label: 'How This Improves Your Business', value: '' },
      ],
    },
    {
      id: 'fas-4-3', stepNum: 3, title: 'Personal Statement', type: 'input', status: 'todo',
      fields: [
        { key: 'background',      label: 'Restaurant Industry Background', value: '' },
        { key: 'careerGoals',     label: 'Career Goals',                   value: '' },
        { key: 'scholarshipNeed', label: 'Why You Need This Scholarship',  value: '' },
      ],
    },
  ],
  'f-5': [
    { id: 'fas-5-1', stepNum: 1, title: 'Business Plan Context', type: 'smart', status: 'complete', smartSource: 'plan' },
    {
      id: 'fas-5-2', stepNum: 2, title: 'Executive Summary', type: 'input', status: 'todo',
      fields: [
        { key: 'businessDescription', label: 'Business Description (2–3 sentences)', value: '' },
        { key: 'marketOpportunity',   label: 'Market Opportunity',                   value: '' },
        { key: 'competitiveEdge',     label: 'Competitive Edge',                     value: '' },
      ],
    },
    {
      id: 'fas-5-3', stepNum: 3, title: 'Financials & Bank History', type: 'input', status: 'todo',
      fields: [
        { key: 'bankStatements',    label: 'Bank Account History (3 months)',       value: '' },
        { key: 'minorityOwnership', label: 'Minority Ownership % (if applicable)', value: '' },
        { key: 'loanPurpose',       label: 'Specific Loan Purpose',                value: '' },
      ],
    },
  ],
};

export const FUNDING_CHAT = [
  {
    id: 'msg-1',
    role: 'assistant',
    dateLabel: true,
    text: "Hi! I'm your Funding Assistant. I can help you find grants, loans, and investment opportunities for Ramen Shop.",
    contextNote: 'Based on: South Austin, TX · Food Service · Pre-revenue startup',
    question: {
      prompt: 'What type of funding are you looking for?',
      options: ['Grants (free money)', 'SBA / Bank Loans', 'Angel Investment', 'All of the above'],
    },
  },
];
