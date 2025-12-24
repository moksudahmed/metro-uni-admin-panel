import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/admin`;

export const fetchAdmin = async (token) => {
  try {
    
    const response = await axios.get(`${API_URL}/reset-password`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/json",
      },
    });

    return response.data;

  } catch (error) {
    console.error("❌ Failed to fetch student record:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.message ||
      "Unable to retrieve student record. Please try again."
    );
  }
};
