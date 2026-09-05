const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


const generateFinancialInsight = async (
  question,
  financialSummary
) => {

  const prompt = `
You are an AI-powered personal financial assistant.

Your job is to analyze a user's personal expense
data and provide clear, practical and easy-to-understand
financial insights.

IMPORTANT RULES:
- Only use the financial data provided below.
- Do not invent expenses or financial information.
- Do not make assumptions about missing data.
- Give practical suggestions.
- Keep the response concise but useful.
- Use Indian Rupee (₹) when discussing money.
- Do not provide professional investment or financial advice.

USER QUESTION:
${question}


USER FINANCIAL SUMMARY:

Total Spending:
₹${financialSummary.totalSpending}

Number of Transactions:
${financialSummary.transactionCount}

Category Spending:
${JSON.stringify(
  financialSummary.categorySpending,
  null,
  2
)}

Highest Spending Category:
${JSON.stringify(
  financialSummary.highestCategory
)}

Highest Individual Expense:
${JSON.stringify(
  financialSummary.highestExpense,
  null,
  2
)}

Current Month Spending:
₹${financialSummary.monthlySpending}


Based on this information, answer the user's question.
`;


  const response = await ai.models.generateContent({

    model: "gemini-3.6-flash",

    contents: prompt

  });


  return response.text;
};


module.exports = {
  generateFinancialInsight
};