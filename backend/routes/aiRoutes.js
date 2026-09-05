const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const {
  generateFinancialInsight
} = require("../services/aiService");


// ==========================================
// Create Financial Summary
// ==========================================

const createFinancialSummary = (expenses) => {

  // ==========================================
// Create Spending Trends
// ==========================================

const createSpendingTrends = (expenses) => {

  // ========================================
  // Monthly Spending
  // ========================================

  const monthlySpending = {};

  expenses.forEach((expense) => {

    const date = new Date(expense.date);

    const month = date.toLocaleString(
      "en-US",
      { month: "short" }
    );

    const year = date.getFullYear();

    const key = `${month} ${year}`;

    if (!monthlySpending[key]) {
      monthlySpending[key] = 0;
    }

    monthlySpending[key] +=
      Number(expense.amount);

  });


  // ========================================
  // Category Spending
  // ========================================

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


  // ========================================
  // Month-over-Month Trend
  // ========================================

  const months = Object.entries(
    monthlySpending
  );

  let monthlyChange = null;

  if (months.length >= 2) {

    const previousMonth =
      Number(months[months.length - 2][1]);

    const currentMonth =
      Number(months[months.length - 1][1]);


    if (previousMonth > 0) {

      monthlyChange =
        (
          (currentMonth - previousMonth)
          / previousMonth
        ) * 100;

    }

  }


  return {

    monthlySpending,

    categorySpending,

    monthlyChange

  };

};

  // Total spending
  const totalSpending = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );


  // Number of transactions
  const transactionCount = expenses.length;


  // ==========================================
  // Category Spending
  // ==========================================

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


  // ==========================================
  // Highest Spending Category
  // ==========================================

  let highestCategory = null;

  if (
    Object.keys(categorySpending).length > 0
  ) {

    highestCategory =
      Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])[0];

  }


  // ==========================================
  // Highest Individual Expense
  // ==========================================

  let highestExpense = null;

  if (expenses.length > 0) {

    highestExpense = expenses.reduce(
      (highest, expense) => {

        return Number(expense.amount) >
          Number(highest.amount)
          ? expense
          : highest;

      }
    );

  }


  // ==========================================
  // Current Month Spending
  // ==========================================

  const currentDate = new Date();

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();


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


  // ==========================================
  // Return Financial Summary
  // ==========================================

  return {

    totalSpending,

    transactionCount,

    categorySpending,

    highestCategory,

    highestExpense: highestExpense
      ? {
          title: highestExpense.title,

          amount: Number(
            highestExpense.amount
          ),

          category:
            highestExpense.category
        }
      : null,

    monthlySpending

  };

};


// ==========================================
// AI Insights Route
// ==========================================

router.post(
  "/insights",
  authMiddleware,
  async (req, res) => {

    try {

      // ======================================
      // Get Question
      // ======================================

      const { question } = req.body;


      // Validate question
      if (!question || !question.trim()) {

        return res.status(400).json({
          message: "Question is required"
        });

      }


      // ======================================
      // Get Logged-in User ID
      // ======================================

      const userId = req.user.id;

      console.log(
        "AI question:",
        question
      );

      console.log(
        "Logged-in user ID:",
        userId
      );


      // ======================================
      // Fetch ONLY This User's Expenses
      // ======================================

      const sql = `
        SELECT
          expenses.id,
          expenses.title,
          expenses.amount,
          categories.name AS category,
          expenses.date,
          expenses.payment_method,
          expenses.description

        FROM expenses

        JOIN categories
          ON expenses.category_id =
             categories.id

        WHERE expenses.user_id = ?

        ORDER BY expenses.date DESC
      `;


      const [expenses] =
        await db.promise().query(
          sql,
          [userId]
        );


      console.log(
        "User expenses found:",
        expenses.length
      );


      // ======================================
      // Create Financial Summary
      // ======================================

      const financialSummary =
        createFinancialSummary(expenses);


      console.log(
        "Financial summary:",
        financialSummary
      );


      // ======================================
      // Generate AI Insight
      // ======================================

      const aiAnswer =
        await generateFinancialInsight(
          question,
          financialSummary
        );


      console.log(
        "AI answer:",
        aiAnswer
      );


      // ======================================
      // Send Final Response
      // ======================================

      res.json({

        message:
          "AI insight generated successfully",

        question:
          question,

        userId:
          userId,

        financialSummary:
          financialSummary,

        answer:
          aiAnswer

      });


    } catch (error) {

      console.error(
        "AI route error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to generate AI insight",

        error:
          error.message

      });

    }

  }
);

// ==========================================
// Automatic AI Recommendations
// ==========================================

router.post(
  "/recommendations",
  authMiddleware,
  async (req, res) => {

    try {

      // Get logged-in user
      const userId = req.user.id;


      // ======================================
      // Fetch ONLY This User's Expenses
      // ======================================

      const sql = `
        SELECT
          expenses.id,
          expenses.title,
          expenses.amount,
          categories.name AS category,
          expenses.date,
          expenses.payment_method,
          expenses.description

        FROM expenses

        JOIN categories
          ON expenses.category_id =
             categories.id

        WHERE expenses.user_id = ?

        ORDER BY expenses.date DESC
      `;


      const [expenses] =
        await db.promise().query(
          sql,
          [userId]
        );


      // ======================================
      // Create Financial Summary
      // ======================================

      const financialSummary =
        createFinancialSummary(expenses);

      const spendingTrends =
  createSpendingTrends(expenses);
      // ======================================
      // Ask AI for Recommendations
      // ======================================

      const recommendationQuestion = `
Analyze my personal financial data and provide
useful financial recommendations.

Financial Summary:
${JSON.stringify(financialSummary, null, 2)}

Spending Trends:
${JSON.stringify(spendingTrends, null, 2)}

Please identify:

1. My highest spending category.
2. Whether my spending is increasing or decreasing.
3. Any category showing unusually high spending.
4. How I can reduce my expenses.
5. One practical action I should take.

Base your response ONLY on the financial data provided.

Keep the response concise, clear, and practical.
`;


      const recommendations =
        await generateFinancialInsight(
          recommendationQuestion,
          financialSummary
        );


      // ======================================
      // Send Response
      // ======================================

      res.json({

        message:
          "AI recommendations generated successfully",

        recommendations:
          recommendations,

        financialSummary:
          financialSummary

      });


    } catch (error) {

      console.error(
        "AI recommendation error:",
        error
      );


      res.status(500).json({

        message:
          "Failed to generate AI recommendations",

        error:
          error.message

      });

    }

  }
);
module.exports = router;