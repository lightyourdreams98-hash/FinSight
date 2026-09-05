const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();



  router.get("/", authMiddleware, (req, res) => {

  const sql = `
    SELECT
      expenses.id,
      expenses.title,
      expenses.amount,
      expenses.category_id,
categories.name AS category,
expenses.date,
      expenses.payment_method,
      expenses.description
    FROM expenses
    JOIN categories
      ON expenses.category_id = categories.id
    WHERE expenses.user_id = ?
    ORDER BY expenses.date DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch expenses"
      });
    }

    res.json(results);
  });
});

router.post("/", authMiddleware, (req, res) => {

  const {
    title,
    amount,
    category_id,
    date,
    payment_method,
    description
  } = req.body;

  if (!title || !amount || !category_id || !date || !payment_method) {
    return res.status(400).json({
      message: "Required fields are missing"
    });
  }

  const sql = `
    INSERT INTO expenses
    (
      user_id,
      title,
      amount,
      category_id,
      date,
      payment_method,
      description
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    req.user.id,
    title,
    amount,
    category_id,
    date,
    payment_method,
    description || null
  ];

  db.query(sql, values, (err, result) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to create expense"
      });
    }

    res.status(201).json({
      message: "Expense created successfully",
      expenseId: result.insertId
    });
  });
});


router.put("/:id", authMiddleware, (req, res) => {

  const expenseId = req.params.id;

  const {
    title,
    amount,
    category_id,
    date,
    payment_method,
    description
  } = req.body;

  if (!title || !amount || !category_id || !date || !payment_method) {
    return res.status(400).json({
      message: "Required fields are missing"
    });
  }

  const sql = `
    UPDATE expenses
    SET
      title = ?,
      amount = ?,
      category_id = ?,
      date = ?,
      payment_method = ?,
      description = ?
    WHERE id = ?
      AND user_id = ?
  `;

  const values = [
    title,
    amount,
    category_id,
    date,
    payment_method,
    description || null,
    expenseId,
    req.user.id
  ];

  db.query(sql, values, (err, result) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to update expense"
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    res.json({
      message: "Expense updated successfully"
    });
  });
});

router.delete("/:id", authMiddleware, (req, res) => {

  const expenseId = req.params.id;

  const sql = `
    DELETE FROM expenses
    WHERE id = ?
      AND user_id = ?
  `;

  db.query(
    sql,
    [expenseId, req.user.id],
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to delete expense"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Expense not found"
        });
      }

      res.json({
        message: "Expense deleted successfully"
      });
    }
  );
});
module.exports = router;