require("dotenv").config();

const {
  generateFinancialInsight
} = require("./services/aiService");


async function testAIService() {

  try {

    console.log("Testing AI Service...\n");


    const financialSummary = {

      totalSpending: 25000,

      transactionCount: 15,

      categorySpending: {
        Food: 8000,
        Travel: 5000,
        Shopping: 4000,
        Bills: 3000
      },

      highestCategory: [
        "Food",
        8000
      ],

      highestExpense: {
        title: "Restaurant",
        amount: 2500,
        category: "Food"
      },

      monthlySpending: 12000

    };


    const answer =
      await generateFinancialInsight(

        "Where am I spending the most?",

        financialSummary

      );


    console.log("\nAI ANSWER:\n");

    console.log(answer);


    console.log(
      "\nAI Service is working successfully!"
    );


  } catch (error) {

    console.error(
      "\nAI Service test failed:"
    );

    console.error(error.message);

  }

}


testAIService();