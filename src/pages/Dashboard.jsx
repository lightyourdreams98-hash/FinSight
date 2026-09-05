import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getExpenses } from "../services/api";


function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch expenses
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


  // Current month spending
  const currentDate = new Date();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();


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


  if (loading) {

    return (
      <div>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-6">
          Loading dashboard...
        </p>

      </div>
    );

  }


  return (

    <div>

      {/* Welcome */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">

          Welcome, {user?.name}

        </h1>

        <p className="mt-2 text-gray-600">

          Here's an overview of your
          personal finances.

        </p>

      </div>


      {/* Summary Cards */}

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


      {/* Quick Actions */}

      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


          <button
            onClick={() => navigate("/expenses")}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700"
          >
            Manage Expenses
          </button>


          <button
            onClick={() => navigate("/analytics")}
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700"
          >
            View Analytics
          </button>


          <button
            onClick={() => navigate("/budget")}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700"
          >
            Manage Budget
          </button>


          <button
            onClick={() => navigate("/expenses")}
            className="bg-gray-700 text-white p-4 rounded-lg hover:bg-gray-800"
          >
            Add Expense
          </button>

        </div>

      </div>

      {/* Recent Expenses */}

<div className="bg-white p-6 rounded-xl shadow-md mt-8">

  <div className="flex justify-between items-center mb-4">

    <h2 className="text-xl font-semibold">
      Recent Expenses
    </h2>

    <button
      onClick={() => navigate("/expenses")}
      className="text-blue-600 hover:text-blue-800 font-medium"
    >
      View all →
    </button>

  </div>


  {expenses.length === 0 ? (

    <p className="text-gray-500">
      No expenses added yet.
    </p>

  ) : (

    <div className="space-y-3">

      {expenses
        .slice(0, 5)
        .map((expense) => (

          <div
            key={expense.id}
            className="flex justify-between items-center border-b pb-3 last:border-b-0"
          >

            <div>

              <p className="font-medium">
                {expense.title}
              </p>

              <p className="text-sm text-gray-500">
                {expense.category}
              </p>

            </div>


            <div className="text-right">

              <p className="font-semibold">
                ₹{Number(expense.amount).toLocaleString()}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(expense.date).toLocaleDateString()}
              </p>

            </div>

          </div>

        ))}

    </div>

  )}

</div>

    </div>


  );

}

export default Dashboard;