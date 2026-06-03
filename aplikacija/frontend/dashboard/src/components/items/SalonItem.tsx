import {
  Eye,
  MapPin,
  MoreHorizontal,
  Pencil,
  Store,
  Trash2,
} from "lucide-react";
import Dropdown from "../ui/Dropdown";
import { useState } from "react";

type SalonItemProps = {
  name: string;
  location: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const SalonItem = ({
  name,
  location,
  onView,
  onEdit,
  onDelete,
}: SalonItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative ${open ? "z-20" : "z-0"} flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
      onClick={onView}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Store size={18} />
        </div>

        <div>
          <h3 className="font-medium text-text">{name}</h3>

          <div className="mt-1 flex items-center gap-2 text-sm text-muted">
            <MapPin size={14} />
            {location}
          </div>
        </div>
      </div>

      {/* Right */}
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
            icon: <Trash2 size={16} />,
            label: "Delete",
            onClick: onDelete,
            danger: true,
          },
        ]}
      />
    </div>
  );
};

export default SalonItem;
