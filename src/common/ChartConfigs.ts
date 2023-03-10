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