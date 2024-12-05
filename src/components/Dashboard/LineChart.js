import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

const LineChart = ({ userGrowth }) => {
  const chartData = {
    labels: userGrowth.map((dataPoint) => dataPoint.date),
    datasets: [
      {
        label: "User Signups",
        data: userGrowth.map((dataPoint) => dataPoint.count),
        borderColor: "#1b3656",
        backgroundColor: "#dcbf79",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#1b3656",
          font: {
            family: "'Open Sauce One', Arial, sans-serif",
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;