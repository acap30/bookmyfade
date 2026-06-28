import {
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Store,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import Dropdown from "../ui/Dropdown";
import UserAvatar from "../ui/UserAvatar";
import { useState } from "react";

type OwnerItemProps = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  salonName: string;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleBarberStatus: () => void;
};

const OwnerItem = ({
  fullName,
  email,
  phoneNumber,
  salonName,
  isActive,
  onEdit,
  onDelete,
  onToggleBarberStatus,
}: OwnerItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative ${open ? "z-20" : "z-0"} flex items-center justify-between rounded-xl border border-border bg-background p-4`}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <User size={18} />
        </div> */}
        <UserAvatar fullName={fullName} />

        <div>
          <h3 className="font-medium text-text">{fullName}</h3>

          <div className="mt-1 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2">
              <Mail size={14} />
              {email}
            </div>

            {phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone size={14} />
                {phoneNumber}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted">
              <Store size={16} />
              {salonName}
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-4 py-2 text-xs font-medium ${
            isActive
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
        <Dropdown
          open={open}
          setOpen={setOpen}
          align="right"
          trigger={
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card transition-all hover:scale-105 active:scale-95">
              <MoreHorizontal size={18} />
            </button>
          }
          items={[
            {
              icon: <Pencil size={16} />,
              label: "Edit",
              onClick: onEdit,
            },
            {
              icon: isActive ? <UserX size={16} /> : <UserCheck size={16} />,
              label: isActive ? "Deactivate" : "Activate",
              onClick: onToggleBarberStatus,
              danger: isActive,
            },
            {
              icon: <Trash2 size={16} />,
              label: "Delete",
              onClick: onDelete,
              danger: true,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default OwnerItem;
