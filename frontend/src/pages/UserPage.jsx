import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import ToastMessage from "../components/ToastMessage";
import UserFormFields from "../forms/UserFormFields";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function UsersPage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authService.getProfile();
      if (data) {
        setProfile(data);
        setForm(data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      setToast("Failed to load profile.");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(form);
      setToast("Profile updated successfully.");
      setEditing(false);
      loadProfile();
    } catch (err) {
      setToast("Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userService.deleteAccount();
      setToast("Account deleted.");
      setProfile(null);
      setTimeout(() => navigate("/register"), 1500);
    } catch (err) {
      setToast("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={profile?.firstName || "User"} />
      <main className="container py-4">
        <h2 className="h5 mb-3">My Profile</h2>

        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            {!profile ? (
              <p>No profile found.</p>
            ) : editing ? (
              <form onSubmit={handleUpdate}>
                <UserFormFields
                  form={form}
                  setForm={setForm}
                  fixedRole={profile.role}
                />
                <div className="d-flex gap-2 mt-3">
                  <Button type="submit">Save Changes</Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <UserFormFields
                  form={form}
                  setForm={setForm}
                  fixedRole={profile.role}
                  readOnly={true}
                />
                <div className="d-flex flex-column gap-2 mt-3">
                  <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                  {!confirmDelete ? (
                    <Button
                      variant="danger"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete Account
                    </Button>
                  ) : (
                    <DeleteConfirmation
                      itemName="your account"
                      onConfirm={handleDelete}
                      onCancel={() => setConfirmDelete(false)}
                      loading={deleting}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <ToastMessage
          message={toast}
          type={
            toast.includes("successfully") || toast.includes("deleted")
              ? "success"
              : "danger"
          }
          onClose={() => setToast("")}
        />
      </main>
    </div>
  );
}
