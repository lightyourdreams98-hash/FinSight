import { useState, useEffect } from "react";

import CategoryChart from "../components/CategoryChart";
import MonthlySpendingChart from "../components/MonthlySpendingChart";
import FinancialInsights from "../components/FinancialInsights";
import { getExpenses } from "../services/api";


function Analytics() {

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);


const [monthlyBudget, setMonthlyBudget] = useState(() => {
  const savedBudget = localStorage.getItem("monthlyBudget");

  return savedBudget
    ? Number(savedBudget)
    : 0;
});
  // Fetch user's expenses
  useEffect(() => {

    const loadExpenses = async () => {

      try {

        const data = await getExpenses();

        setExpenses(data);

      } catch (error) {

        console.error(
          "Failed to fetch expenses:",
          error.message
        );

      } finally {

        setLoading(false);

      }

    };

    loadExpenses();

  }, []);


  // Total spending
  const totalSpending = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );


  // Number of transactions
  const transactionCount = expenses.length;


  // Highest expense
  const highestExpense =
    expenses.length > 0
      ? Math.max(
          ...expenses.map(
            (expense) => Number(expense.amount)
          )
        )
      : 0;


  // Current month and year
  const currentDate = new Date();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();


  // Current month spending
  const monthlySpending = expenses
    .filter((expense) => {

      const expenseDate = new Date(
        expense.date
      );

      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );

    })
    .reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );


  // Category-wise spending
  const categorySpending = expenses.reduce(
    (accumulator, expense) => {

      const category =
        expense.category || "Other";

      if (!accumulator[category]) {
        accumulator[category] = 0;
      }

      accumulator[category] +=
        Number(expense.amount);

      return accumulator;

    },
    {}
  );


  // Convert category object into chart data
  const categoryData = Object.entries(
    categorySpending
  ).map(([category, amount]) => ({
    category,
    amount
  }));


  // Loading
  if (loading) {

    return (
      <div>

        <h1 className="text-3xl font-bold mb-2">
          Analytics
        </h1>

        <p className="mt-8">
          Loading analytics...
        </p>

      </div>
    );

  }


  return (

    <div>

      {/* Page Heading */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Financial Analytics
        </h1>

        <p className="mt-2 text-gray-600">
          Analyze your spending and understand
          your financial habits.
        </p>

      </div>


      {/* Analytics Summary */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">


        {/* Total Spending */}

        <div className="bg-white p-5 rounded-xl shadow-md">

          <p className="text-gray-500">
            Total Spending
          </p>

          <h2 className="text-2xl font-bold mt-2">
            ₹{totalSpending.toLocaleString()}
          </h2>

        </div>


        {/* This Month */}

        <div className="bg-white p-5 rounded-xl shadow-md">

          <p className="text-gray-500">
            This Month
          </p>

          <h2 className="text-2xl font-bold mt-2">
            ₹{monthlySpending.toLocaleString()}
          </h2>

        </div>


        {/* Transactions */}

        <div className="bg-white p-5 rounded-xl shadow-md">

          <p className="text-gray-500">
            Transactions
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {transactionCount}
          </h2>

        </div>


        {/* Highest Expense */}

        <div className="bg-white p-5 rounded-xl shadow-md">

          <p className="text-gray-500">
            Highest Expense
          </p>

          <h2 className="text-2xl font-bold mt-2">
            ₹{highestExpense.toLocaleString()}
          </h2>

        </div>

      </div>


      {/* Spending By Category */}

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Spending by Category
        </h2>


        {categoryData.length === 0 ? (

          <p className="text-gray-500">
            No category data available.
          </p>

        ) : (

          <div className="space-y-3">

            {categoryData.map((item) => (

              <div
                key={item.category}
                className="flex justify-between items-center"
              >

                <span className="font-medium">
                  {item.category}
                </span>

                <span className="font-semibold">
                  ₹{item.amount.toLocaleString()}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* Category Chart */}

      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-semibold mb-4">
          Category Distribution
        </h2>

        {categoryData.length === 0 ? (

          <p className="text-gray-500">
            No data available for chart.
          </p>

        ) : (

          <CategoryChart
            categoryData={categoryData}
          />

        )}

      </div>

      <MonthlySpendingChart
  expenses={expenses}
/>

<div className="mt-8">
  <FinancialInsights
    expenses={expenses}
    monthlyBudget={monthlyBudget}
  />
</div>

    </div>

  );

}


export default Analytics;