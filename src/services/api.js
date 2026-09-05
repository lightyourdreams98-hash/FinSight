const API_URL = "http://localhost:5000/api";


// Get JWT token
const getToken = () => {
  return localStorage.getItem("token");
};


// Common request function
const apiRequest = async (endpoint, options = {}) => {

  const token = getToken();

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`
        }),
        ...options.headers
      }
    }
  );


  const data = await response.json();


  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }


  return data;
};


// GET expenses
export const getExpenses = () => {
  return apiRequest("/expenses");
};


// ADD expense
export const createExpense = (expense) => {
  return apiRequest("/expenses", {
    method: "POST",

    body: JSON.stringify(expense)
  });
};


// UPDATE expense
export const updateExpense = (id, expense) => {
  return apiRequest(`/expenses/${id}`, {
    method: "PUT",

    body: JSON.stringify(expense)
  });
};


// DELETE expense
export const deleteExpense = (id) => {
  return apiRequest(`/expenses/${id}`, {
    method: "DELETE"
  });
};