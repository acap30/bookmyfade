import { MoreHorizontal, Pencil, Scissors, Trash2 } from "lucide-react";
import type { IService } from "../../types/service";
import { useState } from "react";
import Dropdown from "../ui/Dropdown";

type BarberServiceItemProps = {
  service: IService;
  onEdit: () => void;
  onDelete: () => void;
};

const BarberServiceItem = ({
  service,
  onEdit,
  onDelete,
}: BarberServiceItemProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      key={service.id}
      className={`relative ${open ? "z-20" : "z-0"} flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
    >
      <div className="flex items-center gap-2">
        <div className="icon-container">
          <Scissors size={18} />
        </div>
        <div>
          <h3 className="font-medium text-text">{service.name}</h3>
          <p className="text-sm text-muted">{service.length} min</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-xl border border-border bg-card px-3 py-1 text-sm font-medium text-text">
          ${service.price}
        </div>
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

export default BarberServiceItem;
