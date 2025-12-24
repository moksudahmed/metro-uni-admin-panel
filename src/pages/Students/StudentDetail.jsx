import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStudentRecord, fetchStudentPhoto } from "../../api/students.api";
import "./student-profile.css";

const StudentDetail = ({ token }) => {
  const { id } = useParams(); // ✅ FIX: get from route
  const [student, setStudent] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        if (!id) {
          throw new Error("Student ID not found in URL");
        }

        /*if (!token) {
          throw new Error("Authentication token missing");
        }*/

        const record = await fetchStudentRecord(id, token);
        const photoUrl = await fetchStudentPhoto(id, token);

        if (isMounted) {
          setStudent(record);
          setPhoto(photoUrl);
        }
      } catch (err) {
        console.error("❌ Failed to load student profile:", err);
        if (isMounted) {
          setError(err.message || "Unable to load student profile.");
        }
      } finally {
        if (isMounted) {
          setLoading(false); // ✅ ALWAYS executed
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [id, token]);

  const academicTerm = (term) => {
    switch (term) {
      case 1:
        return "Spring";
      case 2:
        return "Summer";
      case 3:
        return "Autumn";
      default:
        return "Not specified";
    }
  };

  /* =======================
     STATE HANDLING
  ======================= */
  if (loading) {
    return <div className="profile-state loading">Loading profile…</div>;
  }

  if (error) {
    return <div className="profile-state error">{error}</div>;
  }

  if (!student) {
    return (
      <div className="profile-state empty">
        No student data available.
      </div>
    );
  }

  const photoSrc = photoError ? "/default-avatar.jpg" : photo;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <h2>Student Profile</h2>
        <p>Detailed academic and personal information</p>
      </div>

      {/* Summary Card */}
      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-photo-wrapper">
            <img
              src={photoSrc}
              alt={student.per_name}
              onError={() => setPhotoError(true)}
            />
          </div>

          <div className="profile-summary">
            <h3>
              {student.per_title} {student.per_name}
            </h3>
            <p className="programme">
              {student.pro_officialName} ({student.pro_shortName})
            </p>

            <div className="summary-grid">
              <div><span>Student ID</span>{student.student_id}</div>
              <div><span>Batch</span>{student.batchName}</div>
              <div><span>Section</span>{student.sectionName}</div>
              <div>
                <span>Academic Year</span>
                {academicTerm(student.stu_academicTerm)}{" "}
                {student.stu_academicYear}
              </div>
              <div><span>Admission Date</span>{student.adm_date}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="profile-sections">
        <ProfileSection title="Personal Information">
          <ProfileItem label="Date of Birth" value={student.per_dateOfBirth} />
          <ProfileItem label="Gender" value={student.per_gender} />
          <ProfileItem label="Blood Group" value={student.per_bloodGroup} />
          <ProfileItem label="Nationality" value={student.per_nationality} />
          <ProfileItem label="Mobile" value={student.per_mobile} />
          <ProfileItem
            label="Guardian Mobile"
            value={student.stu_guardiansMobile}
          />
        </ProfileSection>

        <ProfileSection title="Family Information">
          <ProfileItem label="Father's Name" value={student.per_fathersName} />
          <ProfileItem label="Mother's Name" value={student.per_mothersName} />
        </ProfileSection>

        <ProfileSection title="Address">
          <ProfileItem
            label="Present Address"
            value={student.per_presentAddress}
          />
          <ProfileItem
            label="Permanent Address"
            value={student.per_permanentAddress}
          />
        </ProfileSection>

        <ProfileSection title="Department & Programme">
          <ProfileItem
            label="Department"
            value={student.dpt_officalNameforCertificate}
          />
          <ProfileItem label="Programme" value={student.pro_name} />
        </ProfileSection>
      </div>
    </div>
  );
};

/* =======================
   REUSABLE COMPONENTS
======================= */
const ProfileSection = ({ title, children }) => (
  <div className="profile-section">
    <h4>{title}</h4>
    <div className="profile-grid">{children}</div>
  </div>
);

const ProfileItem = ({ label, value }) => (
  <div className="profile-item">
    <span>{label}</span>
    <p>{value || "—"}</p>
  </div>
);

export default StudentDetail;
