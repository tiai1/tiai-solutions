export const salesTrend = [
  { month: 'Jan', actual: 120, plan: 100 },
  { month: 'Feb', actual: 135, plan: 110 },
  { month: 'Mar', actual: 128, plan: 120 },
  { month: 'Apr', actual: 155, plan: 130 },
  { month: 'May', actual: 162, plan: 140 },
  { month: 'Jun', actual: 170, plan: 150 },
];

export const marginBridge = [
  { label: 'Plan', value: 100 },
  { label: 'Q1 Variance', value: 15 },
  { label: 'Q2 Variance', value: -8 },
  { label: 'Q3 Variance', value: 12 },
  { label: 'Q4 Variance', value: -3 },
  { label: 'YTD Adjustments', value: 6 },
  { label: 'Actual', value: 122 },
];

export const forecastVsActual = [
  { month: 'Q1', forecast: 300, actual: 325 },
  { month: 'Q2', forecast: 320, actual: 315 },
  { month: 'Q3', forecast: 340, actual: 360 },
  { month: 'Q4', forecast: 360, actual: 355 },
];

export const kpiMetrics = [
  {
    value: '$2.4M',
    label: 'Revenue (YTD)',
    trend: 'up' as const,
    trendValue: '+12%',
    color: 'primary' as const,
  },
  {
    value: '24.5%',
    label: 'Gross Margin',
    trend: 'up' as const,
    trendValue: '+2.1%',
    color: 'accent' as const,
  },
  {
    value: '94%',
    label: 'Forecast Accuracy',
    trend: 'neutral' as const,
    color: 'success' as const,
  },
  {
    value: '15min',
    label: 'Report Generation',
    trend: 'neutral' as const,
    color: 'purple' as const,
  },
];
