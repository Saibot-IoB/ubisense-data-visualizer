export const DefaultBubbleChartConfig = {
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
    },
  },
  scales: {
    y: {
      reverse: true,
      beginAtZero: true,
      max: 11,
      min: 0,
      type: "linear" as const,
      grid: {
        display: false
      }
    },
    x: {
      max: 23,
      min: 0,
      type: "linear" as const,
      grid: {
        display: false
      }
    },
  },
  animation: {
    duration: 0,
  },
  responsive: true,
  maintainAspectRatio: false
};

export const defaultLineChartConfig = {
  spanGaps: true,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};