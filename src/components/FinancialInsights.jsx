function FinancialInsights({
  expenses,
  monthlyBudget = 0
}) {

  if (!expenses || expenses.length === 0) {

    return (
      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-semibold mb-4">
          Financial Insights
        </h2>

        <p className="text-gray-500">
          Add some expenses to generate
          financial insights.
        </p>

      </div>
    );

  }


  // Total spending

  const totalSpending = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );


  // Category spending

  const categorySpending = {};

  expenses.forEach((expense) => {

    const category =
      expense.category || "Other";

    if (!categorySpending[category]) {
      categorySpending[category] = 0;
    }

    categorySpending[category] +=
      Number(expense.amount);

  });


  // Highest category

  const highestCategory =
    Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])[0];


  // Current month

  const currentDate = new Date();

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();


  const monthlySpending =
    expenses
      .filter((expense) => {

        const date =
          new Date(expense.date);

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );

      })
      .reduce(
        (total, expense) =>
          total + Number(expense.amount),
        0
      );


  // Budget percentage

  const budgetPercentage =
    monthlyBudget > 0
      ? (monthlySpending / monthlyBudget) * 100
      : 0;


  return (

    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-xl font-semibold mb-5">
        Financial Insights
      </h2>


      <div className="space-y-4">


        {/* Total spending */}

        <div className="bg-gray-50 p-4 rounded-lg">

          <p className="font-medium">

            💰 Your total spending is{" "}

            <span className="font-bold">
              ₹{totalSpending.toLocaleString()}
            </span>

            .

          </p>

        </div>


        {/* Highest category */}

        {highestCategory && (

          <div className="bg-gray-50 p-4 rounded-lg">

            <p className="font-medium">

              📊 Your highest spending category
              is{" "}

              <span className="font-bold">
                {highestCategory[0]}
              </span>

              {" "}with{" "}

              <span className="font-bold">
                ₹{highestCategory[1].toLocaleString()}
              </span>

              {" "}spent.

            </p>

          </div>

        )}


        {/* Budget insight */}

        {monthlyBudget > 0 && (

          <div
            className={`p-4 rounded-lg ${
              budgetPercentage >= 100
                ? "bg-red-50 text-red-700"
                : budgetPercentage >= 80
                ? "bg-yellow-50 text-yellow-700"
                : "bg-green-50 text-green-700"
            }`}
          >

            <p className="font-medium">

              {budgetPercentage >= 100
                ? "⚠️ You have exceeded your monthly budget."
                : budgetPercentage >= 80
                ? "⚠️ You are approaching your monthly budget limit."
                : "🎯 You are currently within your monthly budget."
              }

            </p>


            <p className="text-sm mt-1">

              You have used{" "}

              <span className="font-bold">
                {budgetPercentage.toFixed(1)}%
              </span>

              {" "}of your monthly budget.

            </p>

          </div>

        )}


        {/* Monthly spending */}

        <div className="bg-gray-50 p-4 rounded-lg">

          <p className="font-medium">

            📅 Your spending this month is{" "}

            <span className="font-bold">
              ₹{monthlySpending.toLocaleString()}
            </span>

            .

          </p>

        </div>


      </div>

    </div>

  );

}


export default FinancialInsights;