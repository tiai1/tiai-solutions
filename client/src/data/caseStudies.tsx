import React from 'react';
import { Factory, Calculator, Coins, BarChart3, TrendingUp, Clock } from 'lucide-react';

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  industry: string;
  description: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  technologies: string[];
  icon: React.ReactNode;
  color: 'primary' | 'accent' | 'success' | 'purple';
  timeline: string;
  clientQuote?: {
    text: string;
    author: string;
    role: string;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'ammonia-transfer-kpi',
    title: 'Ammonia Transfer KPI Suite',
    subtitle: 'Automated Weekly Reporting System',
    industry: 'Chemical Processing',
    description: 'Comprehensive automation solution for weekly performance reporting with PowerPoint export and VBA interface for a major chemical processing facility.',
    challenge: 'The client was spending 15+ hours weekly manually collecting data from multiple sources, creating charts, and formatting PowerPoint presentations for leadership reviews. Data inconsistencies and human errors were common.',
    solution: 'We developed an integrated VBA system that automatically pulls data from their ERP, performs calculations, generates charts, and exports formatted PowerPoint presentations. The system includes exception reporting and automated email distribution.',
    results: [
      {
        metric: 'Time Saved',
        value: '15 hours/week',
        description: 'Reduced from manual to automated process'
      },
      {
        metric: 'Accuracy Improvement',
        value: '99.5%',
        description: 'Eliminated manual calculation errors'
      },
      {
        metric: 'Report Delivery',
        value: 'Automated',
        description: 'Scheduled weekly distribution to stakeholders'
      }
    ],
    technologies: ['VBA', 'Power Query', 'PowerPoint API', 'Excel Automation'],
    icon: React.createElement(Factory, { className: "h-8 w-8" }),
    color: 'primary',
    timeline: '6 weeks',
    clientQuote: {
      text: 'This automation transformed our weekly reporting process. What used to take our team nearly two days now happens automatically every Monday morning.',
      author: 'Sarah Chen',
      role: 'Finance Director'
    }
  },
  {
    id: 'b2c-margin-simulator',
    title: 'B2C Margin Simulator',
    subtitle: 'Interactive Pricing Optimization Tool',
    industry: 'Retail & E-commerce',
    description: 'Advanced Excel-based simulator for discount and pricing analysis with volume mix optimization for retail decision-making.',
    challenge: 'The retail client needed to quickly evaluate pricing scenarios considering volume discounts, product mix changes, and competitive positioning. Manual calculations were time-consuming and error-prone.',
    solution: 'We created an interactive Excel model with VBA automation that allows real-time scenario testing. The simulator includes Monte Carlo analysis, sensitivity testing, and automated report generation for different pricing strategies.',
    results: [
      {
        metric: 'Margin Improvement',
        value: '+3.2%',
        description: 'Optimized pricing strategy impact'
      },
      {
        metric: 'Scenarios Modeled',
        value: '500+',
        description: 'Different pricing combinations tested'
      },
      {
        metric: 'Decision Speed',
        value: 'Real-time',
        description: 'Instant scenario evaluation'
      }
    ],
    technologies: ['Excel VBA', 'Monte Carlo', 'Optimization', 'Scenario Analysis'],
    icon: React.createElement(Calculator, { className: "h-8 w-8" }),
    color: 'accent',
    timeline: '8 weeks',
    clientQuote: {
      text: 'The margin simulator completely changed how we approach pricing decisions. We can now test hundreds of scenarios in minutes instead of days.',
      author: 'Michael Rodriguez',
      role: 'VP Operations'
    }
  },
  {
    id: 'capex-controller-toolkit',
    title: 'CAPEX Controller Toolkit',
    subtitle: 'Comprehensive Project Tracking System',
    industry: 'Manufacturing',
    description: 'End-to-end capital expenditure tracking system with QBR data models, project KPI monitoring, and automated cost control reporting.',
    challenge: 'The manufacturing client was managing 150+ capital projects with limited visibility into budget performance, timeline adherence, and ROI tracking. Monthly QBR preparation took weeks.',
    solution: 'We developed a comprehensive Power BI solution with automated data integration from their project management and financial systems. The toolkit includes real-time dashboards, automated variance alerts, and one-click QBR report generation.',
    results: [
      {
        metric: 'Projects Tracked',
        value: '150+',
        description: 'Simultaneous project monitoring'
      },
      {
        metric: 'Budget Variance',
        value: '±2%',
        description: 'Improved budget accuracy'
      },
      {
        metric: 'QBR Preparation',
        value: '2 hours',
        description: 'Reduced from 2 weeks to 2 hours'
      }
    ],
    technologies: ['Power BI', 'DAX', 'SQL', 'Azure Data Factory'],
    icon: React.createElement(Coins, { className: "h-8 w-8" }),
    color: 'success',
    timeline: '12 weeks',
    clientQuote: {
      text: 'The CAPEX toolkit gave us unprecedented visibility into our project portfolio. We can now make informed decisions about resource allocation and project prioritization.',
      author: 'Jennifer Walsh',
      role: 'CFO'
    }
  }
];

export const caseStudyStats = [
  {
    value: '50+',
    label: 'Projects Completed',
    description: 'Successful automation implementations'
  },
  {
    value: '200+',
    label: 'Hours Saved Weekly',
    description: 'Across all client implementations'
  },
  {
    value: '95%',
    label: 'Client Satisfaction',
    description: 'Based on post-implementation surveys'
  },
  {
    value: '3.2x',
    label: 'Average ROI',
    description: 'Return on automation investment'
  }
];
