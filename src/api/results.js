import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const API_BASE_URL = `${apiUrl}api/v1`;

/**
 * Fetch academic results for a student.
 *
 * @param {string|number} studentId - The ID of the student.
 * @param {string} token - Authorization JWT token.
 * @returns {Promise<Object>} - The student result data.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchResults = async (studentId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/result/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch student results:", error);
    throw new Error(
      error.response?.data?.message || "Unable to retrieve results."
    );
  }
};
