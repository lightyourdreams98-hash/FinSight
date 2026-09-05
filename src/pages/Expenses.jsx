import { useState, useEffect } from "react";

import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

import {
  getExpenses,
  deleteExpense
} from "../services/api";


function Expenses() {

  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
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


  // Delete expense
  const handleDelete = async (id) => {

    try {

      await deleteExpense(id);

      setExpenses((prevExpenses) =>
        prevExpenses.filter(
          (expense) => expense.id !== id
        )
      );

    } catch (error) {

      console.error(
        "Failed to delete expense:",
        error.message
      );

    }

  };


  // Select expense for editing
  const handleEdit = (expense) => {

    setEditingExpense(expense);

  };


  return (

    <div>

      <h1 className="text-3xl font-bold mb-2">
        Expenses
      </h1>

      <p className="text-gray-600 mb-6">
        Add, edit and manage your expenses.
      </p>


      {/* Expense Form */}

      <ExpenseForm
        setExpenses={setExpenses}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />


      {/* Loading */}

      {loading ? (

        <p className="mt-8">
          Loading expenses...
        </p>

      ) : (

        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      )}

    </div>

  );

}

export default Expenses;