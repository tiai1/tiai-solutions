import { FileSpreadsheet, BarChart3, Code, ClipboardList, TrendingUp, Calculator } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'Excel' | 'Power BI' | 'VBA' | 'Templates';
  features: string[];
  downloadUrl: string;
  fileSize: string;
  lastUpdated: string;
  icon: React.ReactNode;
  color: 'primary' | 'accent' | 'success' | 'purple' | 'orange' | 'blue';
  isPopular?: boolean;
}

export const tools: Tool[] = [
  {
    id: 'kpi-dashboard-template',
    name: 'KPI Dashboard Template',
    description: 'Complete Excel dashboard with dynamic charts, KPI scorecards, and automated refresh capabilities.',
    category: 'Excel',
    features: [
      'Dynamic chart generation',
      'Automated data refresh',
      'KPI scorecard with traffic lights',
      'Variance analysis',
      'Drill-down capabilities'
    ],
    downloadUrl: '/templates/kpi-dashboard-template.xlsx',
    fileSize: '2.1 MB',
    lastUpdated: '2024-01-15',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'primary',
    isPopular: true
  },
  {
    id: 'margin-analysis-toolkit',
    name: 'Margin Analysis Toolkit',
    description: 'Comprehensive margin bridge analysis with waterfall charts and scenario modeling capabilities.',
    category: 'Excel',
    features: [
      'Margin bridge waterfall charts',
      'Scenario comparison',
      'Cost driver analysis',
      'Price sensitivity modeling',
      'Automated variance explanations'
    ],
    downloadUrl: '/templates/margin-analysis-toolkit.xlsx',
    fileSize: '1.8 MB',
    lastUpdated: '2024-01-10',
    icon: <Calculator className="h-6 w-6" />,
    color: 'accent'
  },
  {
    id: 'power-bi-starter-kit',
    name: 'Power BI Starter Kit',
    description: 'Pre-built Power BI templates with common business metrics and DAX formulas for quick implementation.',
    category: 'Power BI',
    features: [
      'Financial KPI dashboard',
      'Sales performance tracker',
      'Custom DAX measures',
      'Responsive design',
      'Data model best practices'
    ],
    downloadUrl: '/templates/power-bi-starter-kit.pbit',
    fileSize: '3.2 MB',
    lastUpdated: '2024-01-12',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'success'
  },
  {
    id: 'vba-automation-library',
    name: 'VBA Automation Library',
    description: 'Collection of VBA modules for common automation tasks, report generation, and data processing.',
    category: 'VBA',
    features: [
      'Email automation modules',
      'Chart generation functions',
      'Data validation routines',
      'Report formatting macros',
      'Error handling framework'
    ],
    downloadUrl: '/templates/vba-automation-library.xlam',
    fileSize: '890 KB',
    lastUpdated: '2024-01-08',
    icon: <Code className="h-6 w-6" />,
    color: 'purple'
  },
  {
    id: 'budget-planning-model',
    name: 'Budget Planning Model',
    description: 'Dynamic budget model with variance analysis, rolling forecasts, and automated consolidation.',
    category: 'Excel',
    features: [
      'Rolling 12-month forecast',
      'Department consolidation',
      'Variance analysis',
      'Budget vs actual tracking',
      'Scenario planning'
    ],
    downloadUrl: '/templates/budget-planning-model.xlsx',
    fileSize: '1.5 MB',
    lastUpdated: '2024-01-05',
    icon: <ClipboardList className="h-6 w-6" />,
    color: 'blue'
  },
  {
    id: 'capex-tracking-system',
    name: 'CAPEX Tracking System',
    description: 'Complete capital expenditure tracking with project milestones, ROI calculations, and approval workflows.',
    category: 'Excel',
    features: [
      'Project milestone tracking',
      'ROI and NPV calculations',
      'Approval workflow management',
      'Budget vs actual analysis',
      'Executive summary reports'
    ],
    downloadUrl: '/templates/capex-tracking-system.xlsx',
    fileSize: '2.7 MB',
    lastUpdated: '2024-01-18',
    icon: <FileSpreadsheet className="h-6 w-6" />,
    color: 'orange'
  }
];

export const toolCategories = ['All', 'Excel', 'Power BI', 'VBA', 'Templates'];

export const toolStats = [
  {
    value: '10,000+',
    label: 'Downloads',
    description: 'Templates downloaded by professionals'
  },
  {
    value: '4.8/5',
    label: 'Average Rating',
    description: 'User satisfaction score'
  },
  {
    value: '50+',
    label: 'Hours Saved',
    description: 'Average time saved per template'
  }
];
