import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  const generateRandomData = () => {
    const successRate = Math.floor(Math.random() * 20) + 75;
    const failureRate = 100 - successRate;
    const deploymentFrequency = Math.floor(Math.random() * 10) + 8;
    const buildTime = (Math.random() * 5 + 5).toFixed(1);

    const buildTimeTrend = Array.from({ length: 7 }, (_, i) => ({
      date: `04-0${i + 2}`,
      time: Math.floor(Math.random() * 6) + 9,
    }));

    const deployments = [
      { month: '04-02', count: Math.floor(Math.random() * 20) + 35 },
      { month: '04-03', count: Math.floor(Math.random() * 20) + 35 },
      { month: '04-04', count: Math.floor(Math.random() * 20) + 35 },
      { month: '04-05', count: Math.floor(Math.random() * 20) + 35 },
      { month: '04-06', count: Math.floor(Math.random() * 20) + 35 },
      { month: '04-07', count: Math.floor(Math.random() * 20) + 35 },
      { month: '04-08', count: Math.floor(Math.random() * 20) + 35 },
    ];

    const successVsFailure = [
      { label: 'Success', value: successRate },
      { label: 'Failure', value: failureRate },
    ];

    const alerts = [
      'Investigate recent failures',
      'Watch build performance',
      'Deployment latency spike',
      'Test coverage drop',
      'Pipeline warning threshold exceeded',
    ].sort(() => 0.5 - Math.random()).slice(0, 2);

    return {
      metrics: {
        successRate,
        deploymentFrequency,
        buildTime: parseFloat(buildTime),
        failureRate,
      },
      buildTimeTrend,
      deployments,
      successVsFailure,
      alerts,
    };
  };

  const [data, setData] = useState(generateRandomData());
  const [prevData, setPrevData] = useState(null);
  const [filter, setFilter] = useState('7');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('neutral');

  const generateStatusMessage = (oldData, newData) => {
    if (!oldData) return '';

    const improvements = [];
    const declines = [];

    if (newData.metrics.successRate > oldData.metrics.successRate) {
      improvements.push(`Success rate improved to ${newData.metrics.successRate}%`);
    } else if (newData.metrics.successRate < oldData.metrics.successRate) {
      declines.push(`Success rate declined to ${newData.metrics.successRate}%`);
    }

    if (newData.metrics.buildTime < oldData.metrics.buildTime) {
      improvements.push(`Build time improved to ${newData.metrics.buildTime}m`);
    } else if (newData.metrics.buildTime > oldData.metrics.buildTime) {
      declines.push(`Build time increased to ${newData.metrics.buildTime}m`);
    }

    if (newData.metrics.failureRate < oldData.metrics.failureRate) {
      improvements.push(`Failure rate down to ${newData.metrics.failureRate}%`);
    } else if (newData.metrics.failureRate > oldData.metrics.failureRate) {
      declines.push(`Failure rate up to ${newData.metrics.failureRate}%`);
    }

    if (improvements.length > 0 && declines.length === 0) {
      return improvements[0];
    } else if (declines.length > 0 && improvements.length === 0) {
      return declines[0];
    } else if (improvements.length > 0 && declines.length > 0) {
      return `Mixed signals: ${improvements[0]} but ${declines[0].toLowerCase()}`;
    } else {
      return 'Metrics remain stable.';
    }
  };

  const refreshData = () => {
    const newData = generateRandomData();
    const message = generateStatusMessage(data, newData);
    const improvements = 
      (newData.metrics.successRate > data.metrics.successRate ||
        newData.metrics.buildTime < data.metrics.buildTime) &&
      newData.metrics.failureRate < data.metrics.failureRate;

    setStatusMessage(message);
    setStatusType(improvements ? 'good' : newData.metrics.successRate >= 80 ? 'neutral' : 'warning');
    setPrevData(data);
    setData(newData);
  };

  const totalDeployments = data.deployments.reduce((sum, item) => sum + item.count, 0);
  const totalFailures = Math.round((data.metrics.failureRate / 100) * totalDeployments);

  const lineData = {
    labels: data.buildTimeTrend.map((d) => d.date),
    datasets: [
      {
        label: 'Build Time (min)',
        data: data.buildTimeTrend.map((d) => d.time),
        borderColor: 'rgba(56, 189, 248, 1)',
        backgroundColor: 'rgba(56, 189, 248, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
      },
    ],
  };

  const barData = {
    labels: data.deployments.map((d) => d.month),
    datasets: [
      {
        label: 'Deployments',
        data: data.deployments.map((d) => d.count),
        backgroundColor: 'rgba(34, 211, 238, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: data.successVsFailure.map((d) => d.label),
    datasets: [
      {
        data: data.successVsFailure.map((d) => d.value),
        backgroundColor: ['#22c55e', '#f97316'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.12)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.12)' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="rounded-[2rem] border border-slate-700/70 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Smart DevOps Analytics</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-6">
                <h1 className="text-4xl font-semibold tracking-tight text-white">Dashboard</h1>
                <span className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300 ring-1 ring-slate-700">Monitor build health, deployment cadence, and failure trends at a glance.</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 shadow-lg shadow-slate-950/20">
                <span className="mr-2 font-medium text-slate-100">Filter:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent text-sm text-slate-100 outline-none"
                >
                  <option value="7">Last 7 days</option>
                  <option value="10">Last 10 days</option>
                </select>
              </div>
              <button
                onClick={refreshData}
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-2 text-sm font-semibold text-slate-950 transition duration-300 hover:bg-cyan-400"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </header>

        {statusMessage && (
          <div
            className={`rounded-[1.5rem] border p-4 shadow-lg transition-all duration-500 ${
              statusType === 'good'
                ? 'border-green-500/30 bg-green-500/10 text-green-200'
                : statusType === 'warning'
                ? 'border-orange-500/30 bg-orange-500/10 text-orange-200'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200'
            }`}
          >
            <p className="text-sm font-medium">
              {statusType === 'good' ? '✓ Good progress: ' : statusType === 'warning' ? '⚠ Needs attention: ' : 'ℹ Status: '}
              {statusMessage}
            </p>
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-6 shadow-lg transition duration-300 hover:shadow-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Build Success Rate</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-4xl font-semibold text-white">{data.metrics.successRate}%</p>
              <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm text-cyan-300">Trend</span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-6 shadow-lg transition duration-300 hover:shadow-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Deployment Frequency</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-4xl font-semibold text-white">{data.metrics.deploymentFrequency}.9/day</p>
              <span className="rounded-full bg-blue-500/15 px-3 py-1 text-sm text-blue-300">Average</span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-6 shadow-lg transition duration-300 hover:shadow-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Average Build Time</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-4xl font-semibold text-white">{data.metrics.buildTime}m</p>
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-sm text-violet-300">Minutes</span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-700/70 bg-slate-950/80 p-6 shadow-lg transition duration-300 hover:shadow-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Failure Rate</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-4xl font-semibold text-white">{data.metrics.failureRate}%</p>
              <span className="rounded-full bg-orange-500/15 px-3 py-1 text-sm text-orange-300">{data.alerts.length} alerts</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.75fr_1fr]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-700/70 bg-slate-950/90 p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4 pb-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Build Time Trend</p>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Last {filter} days</span>
                </div>
                <div className="h-[280px] overflow-hidden rounded-3xl bg-slate-900/90 p-4">
                  <Line data={lineData} options={chartOptions} />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700/70 bg-slate-950/90 p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4 pb-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Deployment Frequency</p>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Deployments per day</span>
                </div>
                <div className="h-[280px] overflow-hidden rounded-3xl bg-slate-900/90 p-4">
                  <Bar data={barData} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-slate-700/70 bg-slate-950/90 p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4 pb-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Success vs Failure</p>
                  <span className="text-xs text-slate-400">Build quality ratio</span>
                </div>
                <div className="h-[300px] overflow-hidden rounded-3xl bg-slate-900/90 p-4">
                  <Pie data={pieData} options={chartOptions} />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700/70 bg-slate-950/90 p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4 pb-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Insights</p>
                  <span className="text-xs rounded-full bg-slate-800 px-3 py-1 text-slate-300">SMART</span>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-5 text-slate-300">
                  <p className="text-base leading-7">
                    {data.metrics.buildTime < 8
                      ? 'Performance is stable. Keep checking regularly.'
                      : 'Build time is slightly elevated. Investigate pipeline bottlenecks.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-orange-400/10 bg-orange-500/10 p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">!</div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-orange-200/80">Warning Alerts</p>
                  <h2 className="mt-3 text-xl font-semibold text-white">Potential risk areas to review.</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-slate-200">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-semibold text-white">Investigate recent failures</p>
                  <p className="mt-2 text-sm text-slate-400">There are {filter} days with failed deployments in the selected window.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-semibold text-white">Watch build performance</p>
                  <p className="mt-2 text-sm text-slate-400">Average build time is {data.metrics.buildTime} minutes.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700/70 bg-slate-950/90 p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Data Summary</p>
              <p className="mt-3 text-slate-300">Using a fixed dataset with sample DevOps metrics, built for visualization and quick review.</p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-3xl bg-slate-900/90 px-4 py-4">
                  <span className="text-sm text-slate-400">Selected window</span>
                  <span className="font-semibold text-white">{filter} days</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-900/90 px-4 py-4">
                  <span className="text-sm text-slate-400">Total Deployments</span>
                  <span className="font-semibold text-white">{totalDeployments}</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-900/90 px-4 py-4">
                  <span className="text-sm text-slate-400">Total Failures</span>
                  <span className="font-semibold text-white">{totalFailures}</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-900/90 px-4 py-4">
                  <span className="text-sm text-slate-400">Success ratio</span>
                  <span className="font-semibold text-white">{data.metrics.successRate}%</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default App;
