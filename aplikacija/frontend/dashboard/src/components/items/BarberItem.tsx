import { useState } from "react";
import UserAvatar from "../ui/UserAvatar";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Store,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import Dropdown from "../ui/Dropdown";

type BarberItemProps = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  salonName: string;
  isActive: boolean;
  profileImage?: string | null;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleBarberStatus: () => void;
};

const BarberItem = ({
  fullName,
  salonName,
  isActive,
  profileImage,
  onView,
  onEdit,
  onDelete,
  onToggleBarberStatus,
}: BarberItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative ${open ? "z-20" : "z-0"} flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
      onClick={onView}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <UserAvatar fullName={fullName} image={profileImage} />

        <div>
          <h3 className="font-medium text-text">{fullName}</h3>

          <div className="mt-1 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:items-center sm:gap-4">
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
              icon: <Eye size={16} />,
              label: "View",
              onClick: onView,
            },
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

export default BarberItem;
