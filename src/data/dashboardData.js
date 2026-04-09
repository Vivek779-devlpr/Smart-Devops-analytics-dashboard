export const dashboardData = {
  metrics: {
    successRate: 85,
    deploymentFrequency: 12,
    buildTime: 8.5,
    failureRate: 15
  },
  buildTimeTrend: [
    { date: '2024-01-01', time: 10 },
    { date: '2024-01-02', time: 9 },
    { date: '2024-01-03', time: 8 },
    { date: '2024-01-04', time: 7 },
    { date: '2024-01-05', time: 8.5 },
    { date: '2024-01-06', time: 9 },
    { date: '2024-01-07', time: 8 }
  ],
  deployments: [
    { month: 'Jan', count: 10 },
    { month: 'Feb', count: 12 },
    { month: 'Mar', count: 8 },
    { month: 'Apr', count: 15 },
    { month: 'May', count: 11 },
    { month: 'Jun', count: 13 }
  ],
  successVsFailure: [
    { label: 'Success', value: 85 },
    { label: 'Failure', value: 15 }
  ],
  alerts: [
    'Build time exceeded threshold',
    'Deployment failure in staging'
  ]
};