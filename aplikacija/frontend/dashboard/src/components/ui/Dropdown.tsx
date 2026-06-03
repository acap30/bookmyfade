import { useEffect, useRef, useState, type ReactNode } from "react";

type DropdownItem = {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
};

type DropdownHeader = {
  name: string;
  role?: string;
  subtitle?: string; // optional extra line
};

type Props = {
  trigger: ReactNode;
  items: DropdownItem[];
  header?: DropdownHeader;
  align?: "left" | "right";
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Dropdown({
  trigger,
  items,
  header,
  align = "right",
  open,
  setOpen,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined && setOpen !== undefined;

  const isOpen = isControlled ? open : internalOpen;

  const handleSetOpen = isControlled ? setOpen : setInternalOpen;

  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleSetOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Trigger */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleSetOpen((p) => !p);
        }}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          className={`absolute mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden
          ${align === "right" ? "right-0" : "left-0"}`}
        >
          {/* HEADER */}
          {header && (
            <div className="px-4 py-3 border-b border-border bg-gray-50">
              <div className="text-sm font-semibold text-gray-900">
                {header.name}
              </div>

              {header.role && (
                <div className="text-xs text-gray-500">{header.role}</div>
              )}

              {header.subtitle && (
                <div className="text-xs text-gray-400 mt-0.5">
                  {header.subtitle}
                </div>
              )}
            </div>
          )}

          {/* ITEMS */}
          {items.map((item, idx) => (
            <button
              key={idx}
              disabled={item.disabled}
              onClick={(e) => {
                e.stopPropagation();
                handleSetOpen(false);
                item.onClick();
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition cursor-pointer
                ${
                  item.disabled
                    ? "text-muted cursor-not-allowed"
                    : item.danger
                      ? "text-red-600 hover:bg-gray-100"
                      : "hover:bg-gray-100"
                }`}
            >
              {item.icon && (
                <span className="w-4 h-4 flex items-center justify-center">
                  {item.icon}
                </span>
              )}

              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
