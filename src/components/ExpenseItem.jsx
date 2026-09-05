function ExpenseItem({ expense, onDelete, onEdit }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">

      <div className="flex justify-between items-start">

        <div>
          <h3 className="font-semibold text-lg">
            {expense.title}
          </h3>

          <p className="text-sm text-gray-500">
            {expense.category} • {expense.paymentMethod}
          </p>
        </div>

        <p className="font-bold text-lg">
          ₹{expense.amount}
        </p>

      </div>

      <p className="text-sm text-gray-500 mt-2">
        {expense.date}
      </p>

      {expense.description && (
        <p className="text-sm mt-2">
          {expense.description}
        </p>
      )}
<div className="flex gap-3 mt-3">

  <button
    onClick={() => onEdit(expense)}
    className="text-blue-500 hover:text-blue-700"
  >
    Edit
  </button>

  <button
    onClick={() => onDelete(expense.id)}
    className="text-red-500 hover:text-red-700"
  >
    Delete
  </button>

</div>

    </div>
  );
}

export default ExpenseItem;