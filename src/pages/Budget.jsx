import { useState, useEffect } from "react";

import { getExpenses } from "../services/api";


function Budget() {

  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(() => {

    const savedBudget =
      localStorage.getItem("monthlyBudget");

    return savedBudget
      ? Number(savedBudget)
      : 0;

  });

  const [loading, setLoading] = useState(true);


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


  // Current month
  const currentDate = new Date();

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();


  // Calculate current month spending
  const monthlySpending = expenses
    .filter((expense) => {

      const expenseDate =
        new Date(expense.date);

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


  // Remaining budget
  const remainingBudget =
    monthlyBudget - monthlySpending;


  // Budget percentage
  const budgetPercentage =
    monthlyBudget > 0
      ? (monthlySpending / monthlyBudget) * 100
      : 0;


  // Budget status
  let budgetStatus = "No budget set";

  if (monthlyBudget > 0) {

    if (budgetPercentage >= 100) {

      budgetStatus = "Budget exceeded";

    } else if (budgetPercentage >= 80) {

      budgetStatus = "Approaching budget limit";

    } else {

      budgetStatus = "Within budget";

    }

  }


  // Handle budget change
  const handleBudgetChange = (e) => {

    const value = Number(e.target.value);

    setMonthlyBudget(value);

    localStorage.setItem(
      "monthlyBudget",
      value
    );

  };


  if (loading) {

    return (
      <div>

        <h1 className="text-3xl font-bold">
          Budget
        </h1>

        <p className="mt-6">
          Loading budget...
        </p>

      </div>
    );

  }


  return (

    <div>

      {/* Heading */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Monthly Budget
        </h1>

        <p className="mt-2 text-gray-600">
          Set and monitor your monthly
          spending limit.
        </p>

      </div>


      {/* Budget Input */}

      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-semibold mb-4">
          Set Your Budget
        </h2>


        <input
          type="number"
          min="0"
          value={monthlyBudget || ""}
          onChange={handleBudgetChange}
          placeholder="Enter monthly budget"
          className="w-full border rounded-lg p-3"
        />


        {/* Budget Details */}

        {monthlyBudget > 0 && (

          <div className="mt-6 space-y-4">


            {/* Budget */}

            <div className="flex justify-between">

              <span className="font-medium">
                Budget
              </span>

              <span>
                ₹{monthlyBudget.toLocaleString()}
              </span>

            </div>


            {/* Spent */}

            <div className="flex justify-between">

              <span className="font-medium">
                Spent
              </span>

              <span>
                ₹{monthlySpending.toLocaleString()}
              </span>

            </div>


            {/* Remaining */}

            <div className="flex justify-between">

              <span className="font-medium">

                {remainingBudget >= 0
                  ? "Remaining"
                  : "Over Budget"}

              </span>

              <span
                className={
                  remainingBudget >= 0
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >

                ₹{Math.abs(
                  remainingBudget
                ).toLocaleString()}

              </span>

            </div>


            {/* Percentage */}

            <div className="flex justify-between">

              <span className="font-medium">
                Used
              </span>

              <span>
                {budgetPercentage.toFixed(1)}%
              </span>

            </div>


            {/* Progress Bar */}

            <div>

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className={`h-4 rounded-full ${
                    budgetPercentage >= 100
                      ? "bg-red-600"
                      : budgetPercentage >= 80
                      ? "bg-yellow-500"
                      : "bg-green-600"
                  }`}
                  style={{
                    width: `${Math.min(
                      budgetPercentage,
                      100
                    )}%`
                  }}
                />

              </div>

            </div>


            {/* Status */}

            <p
              className={`font-semibold ${
                budgetPercentage >= 100
                  ? "text-red-600"
                  : budgetPercentage >= 80
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >

              {budgetStatus}

            </p>

          </div>

        )}

      </div>


      {/* No Budget Message */}

      {monthlyBudget === 0 && (

        <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl mt-6">

          <p className="text-blue-700">

            Set a monthly budget above to
            start tracking your spending.

          </p>

        </div>

      )}

    </div>

  );

}


export default Budget;