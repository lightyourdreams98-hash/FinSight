import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function CategoryChart({ categoryData }) {

  const data = {
    labels: categoryData.map(
      (item) => item.category
    ),

    datasets: [
      {
        label: "Spending",

        data: categoryData.map(
          (item) => item.amount
        ),

        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#f59e0b",
          "#dc2626",
          "#9333ea",
          "#0891b2",
          "#ea580c",
          "#4f46e5"
        ],

        borderColor: "#ffffff",

        borderWidth: 2
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-xl font-semibold mb-4">
        Spending by Category
      </h2>

      {categoryData.length === 0 ? (

        <p className="text-gray-500">
          No category data available.
        </p>

      ) : (

        <div className="max-w-md mx-auto">
          <Doughnut data={data} />
        </div>

      )}

    </div>
  );
}

export default CategoryChart;