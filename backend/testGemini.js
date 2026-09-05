require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


async function testGemini() {

  try {

    console.log("Testing Gemini API...");

    const response = await ai.models.generateContent({

      model: "gemini-3.6-flash",

      contents:
        "Explain in one sentence what personal expense tracking means."

    });

    console.log("\nGemini response:");
    console.log(response.text);

    console.log("\nGemini API is working successfully!");

  } catch (error) {

    console.error("\nGemini API test failed:");

    console.error(error.message);

  }

}


testGemini();