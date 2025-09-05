import InputField from "../components/InputField";

export default function UserFormFields({
  form,
  setForm,
  fixedRole,
  readOnly = false,
  mode = "profile",
  errors = {},
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <InputField
        label="First Name"
        name="firstName"
        value={form.firstName || ""}
        onChange={handleChange}
        readOnly={readOnly}
        required
      />
      <InputField
        label="Last Name"
        name="lastName"
        value={form.lastName || ""}
        onChange={handleChange}
        readOnly={readOnly}
        required
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={form.email || ""}
        onChange={handleChange}
        readOnly={mode === "profile"}
        required
      />
      <InputField
        label="Age"
        name="age"
        type="number"
        value={form.age || ""}
        onChange={handleChange}
        readOnly={readOnly}
      />
      <InputField
        label="Department"
        name="department"
        value={form.department || ""}
        onChange={handleChange}
        readOnly={readOnly}
      />
      <InputField
        label="Position"
        name="position"
        value={form.position || ""}
        onChange={handleChange}
        readOnly={readOnly}
      />
      <InputField
        label="Role"
        name="role"
        value={fixedRole || form.role || ""}
        onChange={handleChange}
        readOnly={mode === "profile"}
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password || ""}
        onChange={handleChange}
        required={mode === "register"}
        placeholder={
          mode === "profile" ? "Leave blank to keep current password" : ""
        }
      />
      <InputField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword || ""}
        onChange={handleChange}
        required={mode === "register"}
        placeholder={
          mode === "profile" ? "Leave blank to keep current password" : ""
        }
      />
      {errors?.passwordMismatch && (
        <div className="text-danger small mt-1">Passwords do not match.</div>
      )}
    </>
  );
}
