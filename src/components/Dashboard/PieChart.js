import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: ["Paid Invoices", "Outstanding Invoices"],
    datasets: [
      {
        data: [data.paid_invoices, data.outstanding_invoices],
        backgroundColor: ["#5c7b78", "#dcbf79"],
        borderWidth: 1,
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

  return <Pie data={chartData} options={options} />;
};

export default PieChart;