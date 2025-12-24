import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const API_BASE_URL = `${apiUrl}api/v1`;

/**
 * Fetch courses for a specific student.
 *
 * @param {string|number} studentId - The ID of the student.
 * @param {string} token - Authorization JWT token.
 * @returns {Promise<Object>} - The course list data.
 * @throws {Error} - If the request fails.
 */
export const fetchCourses = async (studentId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/course/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    throw new Error(
      error.response?.data?.message || "Unable to retrieve courses."
    );
  }
};
