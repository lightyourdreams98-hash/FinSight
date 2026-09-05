import ExpenseItem from "./ExpenseItem";

function ExpenseList({ expenses, onDelete, onEdit }) {
  return (
    <div className="mt-8">

      <h2 className="text-xl font-semibold mb-4">
        Recent Expenses
      </h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500">
          No expenses added yet.
        </p>
      ) : (
        <div className="space-y-3">

          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDelete={onDelete}
  onEdit={onEdit}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default ExpenseList;