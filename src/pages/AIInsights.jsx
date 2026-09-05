import { useState } from "react";

function AIInsights() {

  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState(null);
const [recommendationLoading, setRecommendationLoading] =
  useState(false);

  const suggestedQuestions = [
    "Where am I spending the most?",
    "What is my highest expense?",
    "How can I reduce my spending?",
    "How much have I spent this month?"
  ];

const generateRecommendations = async () => {

  setRecommendationLoading(true);
  setError("");

  try {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/ai/recommendations",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );


    const data = await res.json();


    if (!res.ok) {
      throw new Error(
        data.message ||
        "Failed to generate recommendations"
      );
    }


    setRecommendations(data);

  } catch (error) {

    console.error(
      "Recommendation error:",
      error
    );

    setError(
      error.message ||
      "Unable to generate recommendations."
    );

  } finally {

    setRecommendationLoading(false);

  }

};


  const askAI = async (selectedQuestion = question) => {

    if (!selectedQuestion.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/ai/insights",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            question: selectedQuestion
          })
        }
      );


      const data = await res.json();


      if (!res.ok) {
        throw new Error(
          data.message || "AI request failed"
        );
      }


      console.log(
        "AI backend response:",
        data
      );


      setResponse(data);

    } catch (error) {

      console.error(
        "AI request failed:",
        error
      );

      setError(
        error.message ||
        "Unable to generate AI insight."
      );

    } finally {

      setLoading(false);

    }

  };


  const handleSuggestedQuestion = (item) => {

    setQuestion(item);

    askAI(item);

  };


  return (

    <div className="max-w-5xl mx-auto">

      {/* Page Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          AI Financial Insights
        </h1>

        <p className="mt-2 text-gray-600">
          Get personalized insights and recommendations
          based on your spending.
        </p>

      </div>


      {/* Question Card */}

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Ask about your finances
        </h2>


        <textarea
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Example: Where am I spending the most?"
          className="w-full border border-gray-300 rounded-lg p-4
                     focus:outline-none focus:ring-2
                     focus:ring-blue-500"
          rows="4"
        />


        <button
          onClick={() => askAI()}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white
                     px-6 py-3 rounded-lg
                     hover:bg-blue-700
                     disabled:opacity-50
                     disabled:cursor-not-allowed"
        >

          {loading
            ? "Analyzing..."
            : "Ask AI"}

        </button>


        {/* Error */}

        {error && (

          <div className="mt-4 bg-red-50 border
                          border-red-200 text-red-700
                          p-4 rounded-lg">

            ⚠ {error}

          </div>

        )}

      </div>


      {/* Suggested Questions */}

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Suggested Questions
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {suggestedQuestions.map(
            (item, index) => (

              <button
                key={index}
                onClick={() =>
                  handleSuggestedQuestion(item)
                }
                disabled={loading}
                className="text-left border
                           border-gray-200
                           p-4 rounded-lg
                           hover:bg-blue-50
                           hover:border-blue-300
                           transition
                           disabled:opacity-50"
              >

                💡 {item}

              </button>

            )
          )}

        </div>

      </div>


<div className="bg-white p-6 rounded-xl shadow-md mb-6">

  <h2 className="text-xl font-semibold mb-2">
    Smart Financial Analysis
  </h2>

  <p className="text-gray-600 mb-4">
    Let AI analyze your spending and provide
    personalized recommendations.
  </p>

  <button
    onClick={generateRecommendations}
    disabled={recommendationLoading}
    className="bg-green-600 text-white px-6 py-3
               rounded-lg hover:bg-green-700
               disabled:opacity-50"
  >

    {recommendationLoading
      ? "Analyzing Your Finances..."
      : "✨ Analyze My Spending"}

  </button>

</div>

{recommendations && !recommendationLoading && (

  <div className="bg-white rounded-xl shadow-md mb-6">

    <div className="bg-green-600 text-white p-5">

      <h2 className="text-xl font-semibold">
        🤖 AI Recommendations
      </h2>

    </div>


    <div className="p-6">

      <div className="bg-green-50
                      border border-green-200
                      rounded-lg p-5">

        <p className="text-gray-700
                      leading-relaxed
                      whitespace-pre-line">

          {recommendations.recommendations}

        </p>

      </div>

    </div>

  </div>

)}

      {/* Loading */}

      {loading && (

        <div className="bg-white p-6 rounded-xl
                        shadow-md mb-6">

          <div className="flex items-center gap-3">

            <div className="animate-spin rounded-full
                            h-6 w-6 border-b-2
                            border-blue-600">
            </div>

            <p className="text-gray-600">
              AI is analyzing your finances...
            </p>

          </div>

        </div>

      )}


      {/* AI Response */}

      {response && !loading && (

        <div className="bg-white rounded-xl shadow-md
                        overflow-hidden mb-6">

          {/* Header */}

          <div className="bg-blue-600 text-white p-5">

            <h2 className="text-xl font-semibold">
              🤖 AI Financial Insight
            </h2>

          </div>


          <div className="p-6">

            {/* Question */}

            <div className="mb-5">

              <p className="text-sm text-gray-500">
                Your question
              </p>

              <p className="font-medium mt-1">
                {response.question}
              </p>

            </div>


            {/* AI Answer */}

            <div className="bg-blue-50 border
                            border-blue-100
                            rounded-lg p-5">

              <p className="text-gray-700
                            leading-relaxed
                            whitespace-pre-line">

                {response.answer}

              </p>

            </div>


            {/* Financial Summary */}

            {response.financialSummary && (

              <div className="mt-6">

                <h3 className="text-lg font-semibold mb-4">
                  Financial Summary
                </h3>


                <div className="grid grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-4">


                  {/* Total */}

                  <div className="bg-gray-50
                                  p-4 rounded-lg">

                    <p className="text-sm
                                  text-gray-500">
                      Total Spending
                    </p>

                    <p className="text-xl
                                  font-bold mt-1">

                      ₹
                      {Number(
                        response.financialSummary
                          .totalSpending
                      ).toLocaleString()}

                    </p>

                  </div>


                  {/* Monthly */}

                  <div className="bg-gray-50
                                  p-4 rounded-lg">

                    <p className="text-sm
                                  text-gray-500">
                      This Month
                    </p>

                    <p className="text-xl
                                  font-bold mt-1">

                      ₹
                      {Number(
                        response.financialSummary
                          .monthlySpending
                      ).toLocaleString()}

                    </p>

                  </div>


                  {/* Transactions */}

                  <div className="bg-gray-50
                                  p-4 rounded-lg">

                    <p className="text-sm
                                  text-gray-500">
                      Transactions
                    </p>

                    <p className="text-xl
                                  font-bold mt-1">

                      {
                        response.financialSummary
                          .transactionCount
                      }

                    </p>

                  </div>


                  {/* Highest Category */}

                  <div className="bg-gray-50
                                  p-4 rounded-lg">

                    <p className="text-sm
                                  text-gray-500">
                      Top Category
                    </p>

                    <p className="text-xl
                                  font-bold mt-1">

                      {
                        response.financialSummary
                          .highestCategory
                          ? response.financialSummary
                              .highestCategory[0]
                          : "N/A"
                      }

                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </div>

  );

}

export default AIInsights;