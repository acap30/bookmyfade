type ProfileInputProps = {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProfileInput = ({
  icon,
  label,
  name,
  value,
  disabled,
  onChange,
}: ProfileInputProps) => {
  return (
    <div
      className={`rounded-xl border border-border p-4 ${disabled ? "bg-background" : "bg-card shadow-md"}`}
    >
      <div className="mb-2 flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>

      <input
        type="text"
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="bg-transparent text-sm font-medium text-text outline-none disabled:cursor-default"
      />
    </div>
  );
};

export default ProfileInput;
