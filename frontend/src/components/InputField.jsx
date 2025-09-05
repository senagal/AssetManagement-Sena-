export default function InputField({
  label,
  name,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  readOnly = false,
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id || name} className="form-label">
        {label}
      </label>
      <input
        type={type}
        className="form-control"
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
      />
    </div>
  );
}
