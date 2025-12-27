import { useEffect, useState } from "react";

import { fetchStudentRecord, fetchStudentPhoto } from "../../api/students.api";
import "./Profile.css";

export default function Profile({ studentId, token }) {
  const [student, setStudent] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  /* -------------------- Load Student Data -------------------- */
  useEffect(() => {
   //if (!studentId || !token) return; 
   if (!studentId) return;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const record = await fetchStudentRecord(studentId, token);
        const photo = await fetchStudentPhoto(studentId, token);
        console.log(record);
        setStudent(record);
        setPhotoUrl(photo);
      } catch (err) {
        console.error("Profile load failed:", err);
        setError("Unable to load student profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [studentId, token]);

  /* -------------------- Helpers -------------------- */
  const academicTerm = (term) => {
    if (term === 1) return "Spring";
    if (term === 2) return "Summer";
    if (term === 3) return "Autumn";
    return "N/A";
  };

  /* -------------------- UI States -------------------- */
  if (loading) {
    return <div className="profile-loading">Loading student profile…</div>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!student) {
    return <div className="profile-empty">No student record found.</div>;
  }

  /* -------------------- Render -------------------- */
  return (
    <div className="profile-container">
      <h1 className="profile-title">🎓 Student Profile</h1>

      {/* ===== Header Card ===== */}
      <div className="profile-card">
        <div className="profile-header">
          {/* Photo */}
          <img
            src={photoUrl || "/default-avatar.jpg"}
            alt="Student"
            className="profile-photo"
            onError={(e) => (e.target.src = "/default-avatar.jpg")}
          />

          {/* Basic Info */}
          <div className="profile-info">
            <h2 className="profile-name">
              {student.per_title} {student.per_name}
            </h2>
            <p className="profile-subtitle">
              {student.pro_officialName} ({student.pro_shortName})
            </p>

            <div className="profile-grid">
              <div><strong>Student ID:</strong> {student.student_id}</div>
              <div><strong>Batch:</strong> {student.batchName}</div>
              <div><strong>Section:</strong> {student.sectionName}</div>
              <div>
                <strong>Academic:</strong>{" "}
                {academicTerm(student.stu_academicTerm)}{" "}
                {student.stu_academicYear}
              </div>
              <div><strong>Admission Date:</strong> {student.adm_date}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Details ===== */}
      <div className="profile-details">
        <Section title="Personal Information">
          <Field label="Date of Birth" value={student.per_dateOfBirth} />
          <Field label="Gender" value={student.per_gender} />
          <Field label="Blood Group" value={student.per_bloodGroup} />
          <Field label="Nationality" value={student.per_nationality} />
          <Field label="Mobile" value={student.per_mobile} />
          <Field label="Guardian Mobile" value={student.stu_guardiansMobile} />
        </Section>

        <Section title="Family Information">
          <Field label="Father's Name" value={student.per_fathersName} />
          <Field label="Mother's Name" value={student.per_mothersName} />
        </Section>

        <Section title="Address">
          <Field label="Present Address" value={student.per_presentAddress} />
          <Field label="Permanent Address" value={student.per_permanentAddress} />
        </Section>

        <Section title="Department & Programme">
          <Field label="Department" value={student.dpt_officalNameforCertificate} />
          <Field label="Programme" value={student.pro_name} />
        </Section>
      </div>
    </div>
  );
}

/* ================= Sub Components ================= */

const Section = ({ title, children }) => (
  <>
    <h3 className="profile-section-title">{title}</h3>
    <div className="profile-grid">{children}</div>
  </>
);

const Field = ({ label, value }) => (
  <div>
    <strong>{label}:</strong> {value || "N/A"}
  </div>
);
