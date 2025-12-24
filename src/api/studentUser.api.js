import axios from "axios";

/* Search user by studentID or loginID */
export const searchStudentUsers = async (query) => {
  const res = await axios.get("/admin/student-users", {
    params: { q: query }
  });
  return res.data;
};

/* Get single user */
export const getStudentUser = async (studentID) => {
  const res = await axios.get(`/admin/student-users/${studentID}`);
  return res.data;
};

/* Create user */
export const createStudentUser = async (payload) => {
  return axios.post("/admin/student-users", payload);
};

/* Update user status */
export const updateStudentUser = async (studentID, payload) => {
  return axios.put(`/admin/student-users/${studentID}`, payload);
};

/* Reset password */
export const resetStudentUserPassword = async (studentID, payload) => {
  return axios.put(`/admin/student-users/${studentID}/password`, payload);
};
