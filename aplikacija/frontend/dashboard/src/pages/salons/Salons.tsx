import { useEffect, useMemo, useState } from "react";
import SearchInput from "../../components/ui/SearchInput";
import { Loader2, Plus, Store } from "lucide-react";
import {
  addSalon,
  deleteSalon,
  getSalons,
  updateSalon,
} from "../../api/salonsApi";
import type { ISalon } from "../../types/salon";
import AddModal from "../../components/modals/AddModal";
import { useNavigate } from "react-router-dom";
import EditSalonModal from "../../components/modals/EditSalonModal";
import SalonItem from "../../components/items/SalonItem";

const Salons = () => {
  const [search, setSearch] = useState("");
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selectedSalon, setSelectedSalon] = useState<ISalon | null>(null);

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

  const handleEdit = (salon: ISalon) => {
    setSelectedSalon(salon);

    setEditOpen(true);
  };

  const editSalon = async (id: number, data: Omit<ISalon, "id">) => {
    await updateSalon(id, data);

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
                  onEdit={() => handleEdit(salon)}
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
            required: true,
          },
          {
            name: "address",
            label: "Address",
            placeholder: "Enter address",
            required: true,
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter email",
            required: false,
          },
          {
            name: "phoneNumber",
            label: "Phone Number",
            placeholder: "Enter phone number",
            required: false,
          },
        ]}
        onSubmit={handleAdd}
      />
      <EditSalonModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        salon={selectedSalon}
        onSubmit={(id, data) => editSalon(id, data)}
      />
    </div>
  );
};

export default Salons;
