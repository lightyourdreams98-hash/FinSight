import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";


function MonthlySpendingChart({ expenses }) {

  const monthlySpending = {};

  expenses.forEach((expense) => {

    const date = new Date(expense.date);

    const month = date.toLocaleString(
      "default",
      {
        month: "short"
      }
    );

    if (!monthlySpending[month]) {
      monthlySpending[month] = 0;
    }

    monthlySpending[month] += Number(
      expense.amount
    );

  });


  const chartData = Object.entries(
    monthlySpending
  ).map(([month, amount]) => ({
    month,
    amount
  }));


  if (chartData.length === 0) {

    return (
      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-semibold mb-4">
          Monthly Spending
        </h2>

        <p className="text-gray-500">
          No spending data available.
        </p>

      </div>
    );

  }


  return (

    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-xl font-semibold mb-6">
        Monthly Spending
      </h2>


      <div className="w-full h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
            />

            <YAxis />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString()}`
              }
            />

            <Bar
              dataKey="amount"
              name="Spending"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}


export default MonthlySpendingChart;