import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { FC } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface PriceAreaChartProps {
  data: Array<{ date: string; price1: number; price2: number; price3: number; price4: number; price5: number }>;
}

const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const PriceAreaChart: FC<PriceAreaChartProps> = ({ data }) => {
  const labels = data.map((item) => item.date);
  const price1Values = data.map((item) => item.price1);
  const price2Values = data.map((item) => item.price2);
  const price3Values = data.map((item) => item.price3);
  const price4Values = data.map((item) => item.price4);
  const price5Values = data.map((item) => item.price5);

  const getChange = (values: number[], index: number): string => {
    if (index === 0) return "N/A";
    const change = calculateChange(values[index], values[index - 1]);
    return `${change.toFixed(2)}%`;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Price 1",
        data: price1Values,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Price 2",
        data: price2Values,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
      },
      {
        label: "Price 3",
        data: price3Values,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "Price 4",
        data: price4Values,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
      },
      {
        label: "Price 5",
        data: price5Values,
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        fill: true,
        pointBackgroundColor: "rgba(255, 206, 86, 1)",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "가격 추이",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            const value = `$${context.raw}`;
            const change = getChange(chartData.datasets[context.datasetIndex].data, context.dataIndex);
            return `${label}${value} (${change})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "일자",
        },
      },
      y: {
        title: {
          display: true,
          text: "달러/$",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default PriceAreaChart;
