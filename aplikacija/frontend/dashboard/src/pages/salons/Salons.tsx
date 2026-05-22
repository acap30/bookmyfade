import { useEffect, useMemo, useState } from "react";
import SearchInput from "../../components/ui/SearchInput";
import {
  Eye,
  Loader2,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Store,
  Trash2,
} from "lucide-react";
import { addSalon, deleteSalon, getSalons } from "../../api/salonsApi";
import type { ISalon } from "../../types/salon";
import Dropdown from "../../components/ui/Dropdown";
import AddModal from "../../components/modals/AddModal";
import { useNavigate } from "react-router-dom";

const Salons = () => {
  const [search, setSearch] = useState("");
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const navigate = useNavigate();

  const filteredSalons = useMemo(() => {
    return salons.filter((salon) =>
      `${salon.name} ${salon.address}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, salons]);

  const fetchSalons = async () => {
    try {
      const data = await getSalons();

      setSalons(data);
    } catch (err) {
      console.error("Failed to fetch salons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteSalon(id);
    fetchSalons();
  };

  const handleAdd = async (data) => {
    try {
      await addSalon(data);
    } catch (error) {
      console.error(error);
    }
    fetchSalons();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search salons..."
          value={search}
          onChange={setSearch}
        />

        <button className="button-add" onClick={() => setAddModalOpen(true)}>
          <Plus size={18} />
          Add Salon
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">All Salons</h2>

          <span className="text-sm text-muted">
            {filteredSalons.length} salons
          </span>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted">
            <Loader2 className="mb-3 animate-spin" size={28} />
            <p className="text-sm">Loading salons...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSalons.length > 0 ? (
              filteredSalons.map((salon) => (
                <SalonItem
                  key={salon.id}
                  name={salon.name}
                  location={salon.address}
                  onEdit={() => {}}
                  onDelete={() => handleDelete(salon.id)}
                  onView={() => navigate(`/salons/${salon.id}`)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
                <Store size={32} className="text-muted mb-3" />

                <h3 className="font-medium text-text">No salons found</h3>

                <p className="mt-1 text-sm text-muted">
                  Try searching with another keyword
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <AddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Salon"
        fields={[
          {
            name: "name",
            label: "Salon Name",
            placeholder: "Enter salon name",
          },
          {
            name: "address",
            label: "Address",
            placeholder: "Enter address",
          },
          {
            name: "phoneNumber",
            label: "Phone Number",
            placeholder: "Enter phone number",
          },
        ]}
        onSubmit={handleAdd}
      />
    </div>
  );
};

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

export default Salons;
