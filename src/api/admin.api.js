import api from "./client";

export const createUserForStudent = (payload) =>
  api.post("/admin/create-user", payload);

export const runAutoFix = () =>
  api.post("/admin/auto-fix");

export const fetchIssues = () =>
  api.get("/admin/issues");
