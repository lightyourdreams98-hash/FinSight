require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");


const app = express();
//const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ]
}));

const PORT = 5000;

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Expense Tracker API is running");
// });

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});