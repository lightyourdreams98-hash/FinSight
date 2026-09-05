import { useState, useEffect } from "react";

function ExpenseForm({
  setExpenses,
  editingExpense,
  setEditingExpense
}) {

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category_id: "",
    date: "",
    paymentMethod: "",
    description: ""
  });


  // Load selected expense into form
  useEffect(() => {

    if (editingExpense) {

      setFormData({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category_id: editingExpense.category_id || "",
        date: editingExpense.date,
        paymentMethod: editingExpense.payment_method || "",
        description: editingExpense.description || ""
      });

    }

  }, [editingExpense]);


  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  // Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");


    const expenseData = {
      title: formData.title,
      amount: Number(formData.amount),
      category_id: Number(formData.category_id),
      date: formData.date,
      payment_method: formData.paymentMethod,
      description: formData.description
    };


    try {

      // =========================
      // ADD EXPENSE
      // =========================

      if (!editingExpense) {

        const response = await fetch(
          "http://localhost:5000/api/expenses",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(expenseData)
          }
        );


        const data = await response.json();


        if (!response.ok) {

          alert(data.message);
          return;

        }


        console.log(
          "Expense added:",
          data
        );

      }


      // =========================
      // EDIT EXPENSE
      // =========================

      else {

        const response = await fetch(
          `http://localhost:5000/api/expenses/${editingExpense.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(expenseData)
          }
        );


        const data = await response.json();


        if (!response.ok) {

          alert(data.message);
          return;

        }


        console.log(
          "Expense updated:",
          data
        );

      }


      // =========================
      // RELOAD EXPENSES
      // =========================

      const updatedResponse = await fetch(
        "http://localhost:5000/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const updatedExpenses =
        await updatedResponse.json();


      setExpenses(updatedExpenses);


      // Clear form

      setFormData({
        title: "",
        amount: "",
        category_id: "",
        date: "",
        paymentMethod: "",
        description: ""
      });


      // Exit edit mode

      setEditingExpense(null);


    } catch (error) {

      console.error(
        "Expense error:",
        error
      );

    }

  };


  return (

    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-xl font-semibold mb-4">

        {editingExpense
          ? "Edit Expense"
          : "Add Expense"}

      </h2>


      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >


        {/* Title */}

        <div>

          <label className="block mb-1">
            Expense Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Dinner"
            className="w-full border rounded-lg p-2"
            required
          />

        </div>


        {/* Amount */}

        <div>

          <label className="block mb-1">
            Amount
          </label>

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g. 500"
            className="w-full border rounded-lg p-2"
            required
          />

        </div>


        {/* Category */}

        <div>

          <label className="block mb-1">
            Category
          </label>

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          >

            <option value="">
              Select Category
            </option>

            <option value="1">
              Food
            </option>

            <option value="2">
              Travel
            </option>

            <option value="3">
              Shopping
            </option>

            <option value="4">
              Bills
            </option>

            <option value="5">
              Entertainment
            </option>

            <option value="6">
              Education
            </option>

            <option value="7">
              Health
            </option>

            <option value="8">
              Other
            </option>

          </select>

        </div>


        {/* Date */}

        <div>

          <label className="block mb-1">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />

        </div>


        {/* Payment Method */}

        <div>

          <label className="block mb-1">
            Payment Method
          </label>

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          >

            <option value="">
              Select Payment Method
            </option>

            <option value="Cash">
              Cash
            </option>

            <option value="UPI">
              UPI
            </option>

            <option value="Credit Card">
              Credit Card
            </option>

            <option value="Debit Card">
              Debit Card
            </option>

            <option value="Net Banking">
              Net Banking
            </option>

          </select>

        </div>


        {/* Description */}

        <div>

          <label className="block mb-1">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description"
            className="w-full border rounded-lg p-2"
            rows="3"
          />

        </div>


        {/* Button */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >

          {editingExpense
            ? "Update Expense"
            : "Add Expense"}

        </button>


      </form>

    </div>

  );

}

export default ExpenseForm;