import api from "./client";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}/api/v1/admin`;


export const fetchStudents3 = async () => {
  const res = await api.get("/students");
  return res.data;
};

export const fetchStudents = async (token) => {
  try {
    
    const response = await axios.get(`${API_URL}/students`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/json",
      },
    });
    console.log(response);
    return response.data;

  } catch (error) {
    console.error("❌ Failed to fetch student record:", error.response?.data || error.message);

    throw new Error(
      error.response?.data?.message ||
      "Unable to retrieve student record. Please try again."
    );
  }
};


export const fetchStudentRecord = async (student_id, token) => {
  try {
    if (!student_id) {
      throw new Error("Student ID is required.");
    }

   /* if (!token) {
      throw new Error("Authentication token is missing.");
    }*/
    
    const response = await axios.get(`${API_URL}/students/${student_id}`, {
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

export const fetchStudentPhoto = async (student_id, token) => {
  const fallbackPhoto = "/default-avatar.jpg";

  if (!student_id) {
    console.error("❌ Student ID is missing.");
    return fallbackPhoto;
  }

  /*if (!token) {
    console.error("❌ Token is missing.");
    return fallbackPhoto;
  }*/

  try {
    const photoUrl = `${API_URL}/student-photo/${student_id}`;
   
    // Fetch the image as blob
    const response = await axios.get(photoUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
    console.log(response);
    // Convert blob to a usable image URL
    return URL.createObjectURL(response.data);

  } catch (error) {
    console.error(
      "❌ Failed to load student photo:",
      error.response?.data || error.message
    );
    return fallbackPhoto; // return default image
  }
};

export const fetchStudent = async (id) => {
  const res = await api.get(`/students/${id}`);
  return res.data;
};
