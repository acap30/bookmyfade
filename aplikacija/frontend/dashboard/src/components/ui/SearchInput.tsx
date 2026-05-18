import { Search } from "lucide-react";

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

const SearchInput = ({
  placeholder = "Search...",
  value,
  onChange,
}: SearchInputProps) => {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search
        size={18}
        className="text-muted absolute top-1/2 right-4 -translate-y-1/2"
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="card-input pl-11"
      />
    </div>
  );
};

export default SearchInput;
