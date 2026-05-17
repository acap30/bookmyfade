import { Lock } from "lucide-react";

type PasswordInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
}: PasswordInputProps) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm text-muted">
        <Lock size={16} />
        {label}
      </label>

      <input
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        className="light-input"
      />
    </div>
  );
};

export default PasswordInput;
