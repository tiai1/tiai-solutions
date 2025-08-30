import React from 'react';
import { BarChart3, Bot, Brain, Calculator, FileText, Database, Zap } from 'lucide-react';

export const services = {
  tiers: [
    {
      title: 'Essentials',
      description: 'Foundation for data-driven decisions',
      features: [
        {
          title: 'KPI Tree Development',
          description: 'Define and structure your key metrics'
        },
        {
          title: 'Monthly Dashboards',
          description: 'Performance tracking and variance analysis'
        },
        {
          title: 'Data Cleanup',
          description: 'Standardize and validate data sources'
        },
        {
          title: 'Basic Reporting',
          description: 'Automated monthly and quarterly reports'
        }
      ],
      icon: React.createElement(BarChart3, { className: "h-8 w-8" }),
      color: 'primary',
      ctaText: 'Get Started',
      isPopular: false,
    },
    {
      title: 'Automation',
      description: 'Streamlined workflows and processes',
      features: [
        {
          title: 'Scheduled Refresh',
          description: 'Automated data updates and alerts'
        },
        {
          title: 'Power Query Pipelines',
          description: 'ETL processes for data transformation'
        },
        {
          title: 'VBA Tooling',
          description: 'Custom automation for Excel workflows'
        },
        {
          title: 'Power Automate Flows',
          description: 'Workflow automation across systems'
        }
      ],
      icon: React.createElement(Bot, { className: "h-8 w-8" }),
      color: 'primary',
      ctaText: 'Start Automation',
      isPopular: true,
    },
    {
      title: 'Decision Systems',
      description: 'Advanced analytics and optimization',
      features: [
        {
          title: 'Margin Simulators',
          description: 'Price and discount optimization models'
        },
        {
          title: 'Scenario Planners',
          description: 'What-if analysis and forecasting'
        },
        {
          title: 'Smart Alerting',
          description: 'Predictive alerts and notifications'
        },
        {
          title: 'Advanced Analytics',
          description: 'ML-powered insights and predictions'
        }
      ],
      icon: React.createElement(Brain, { className: "h-8 w-8" }),
      color: 'accent',
      ctaText: 'Explore Systems',
      isPopular: false,
    }
  ],

  capabilities: [
    {
      title: 'KPI Dashboards',
      description: 'Real-time performance tracking with automated data refresh and alerts.',
      features: [
        { title: 'Revenue & margin tracking', description: 'Monitor key financial metrics' },
        { title: 'Forecast vs actual analysis', description: 'Compare predictions to results' },
        { title: 'Exception reporting', description: 'Automated alerts for variances' }
      ],
      icon: React.createElement(BarChart3, { className: "h-6 w-6" }),
      color: 'primary'
    },
    {
      title: 'Automated Reporting',
      description: 'Scheduled reports delivered automatically to stakeholders.',
      features: [
        { title: 'Weekly performance reports', description: 'Automated weekly summaries' },
        { title: 'PowerPoint automation', description: 'Auto-generated presentations' },
        { title: 'Email distribution', description: 'Automated report delivery' }
      ],
      icon: React.createElement(FileText, { className: "h-6 w-6" }),
      color: 'accent'
    },
    {
      title: 'Cost & Margin Insight',
      description: 'Deep dive analytics on profitability and cost drivers.',
      features: [
        { title: 'Margin bridge analysis', description: 'Waterfall analysis of changes' },
        { title: 'Cost center tracking', description: 'Department-level cost monitoring' },
        { title: 'Price optimization', description: 'Data-driven pricing strategies' }
      ],
      icon: React.createElement(Calculator, { className: "h-6 w-6" }),
      color: 'purple'
    },
    {
      title: 'Project & CAPEX Control',
      description: 'Comprehensive project tracking and capital expenditure management.',
      features: [
        { title: 'Budget vs actual tracking', description: 'Real-time budget monitoring' },
        { title: 'Milestone monitoring', description: 'Project progress tracking' },
        { title: 'ROI calculations', description: 'Return on investment analysis' }
      ],
      icon: React.createElement(Zap, { className: "h-6 w-6" }),
      color: 'success'
    }
  ]
};

export const faqItems = [
  {
    question: 'How quickly can I see results from automation?',
    answer: 'Most clients see immediate time savings within the first week of implementation. Full ROI is typically realized within 2-3 months as processes become fully automated and insights drive better decisions.'
  },
  {
    question: 'Do you work with existing Excel and Power BI systems?',
    answer: 'Absolutely! We specialize in enhancing your current tools rather than replacing them. Our automation builds on familiar platforms like Excel, Power BI, and VBA, ensuring your team can easily adopt and maintain the solutions.'
  },
  {
    question: 'What level of technical knowledge is required from my team?',
    answer: 'None! Our solutions are designed for business users, not technical specialists. We provide comprehensive training and documentation so your team can confidently use and maintain the automated systems.'
  },
  {
    question: 'How do you ensure data accuracy and reliability?',
    answer: 'We implement multiple validation layers, automated error checking, and reconciliation processes. Every automation includes built-in quality controls and audit trails to ensure data integrity.'
  },
  {
    question: 'Can the automation be customized for our specific industry?',
    answer: 'Yes! Our solutions are highly customizable and have been successfully implemented across manufacturing, retail, chemical processing, and service industries. We adapt our frameworks to your specific KPIs and business processes.'
  },
  {
    question: 'What ongoing support do you provide?',
    answer: 'We offer comprehensive support including system monitoring, regular health checks, updates for changing business needs, and training for new team members. Our goal is long-term partnership, not just implementation.'
  }
];
