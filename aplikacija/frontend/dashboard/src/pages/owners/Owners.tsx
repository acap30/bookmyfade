import { useEffect, useMemo, useState } from "react";
import type { IOwner } from "../../types/owner";
import { deleteOwner, getOwners } from "../../api/ownersApi";
import { Loader2, Plus, Users } from "lucide-react";
import SearchInput from "../../components/ui/SearchInput";
import AddModal from "../../components/modals/AddModal";
import OwnerItem from "../../components/items/OwnerItem";

const Owners = () => {
  const [search, setSearch] = useState("");
  const [owners, setOwners] = useState<IOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filteredOwners = useMemo(() => {
    return owners.filter((owner) =>
      `${owner.user.firstName} ${owner.user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, owners]);

  const fetchOwners = async () => {
    try {
      const data = await getOwners();

      setOwners(data);
    } catch (err) {
      console.error("Failed to fetch owners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteOwner(id);
    fetchOwners();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search owners..."
          value={search}
          onChange={setSearch}
        />

        <button className="button-add" onClick={() => setAddModalOpen(true)}>
          <Plus size={18} />
          Add Owner
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">All Owners</h2>

          <span className="text-sm text-muted">
            {filteredOwners.length} owners
          </span>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted">
            <Loader2 className="mb-3 animate-spin" size={28} />
            <p className="text-sm">Loading owners...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOwners.length > 0 ? (
              filteredOwners.map((owner) => (
                <OwnerItem
                  key={owner.id}
                  fullName={owner.user.fullName}
                  email={owner.user.email}
                  phoneNumber={owner.user.phoneNumber || null}
                  salonName={owner.salon.name}
                  onEdit={() => {}}
                  onDelete={() => handleDelete(owner.id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
                <Users size={32} className="text-muted mb-3" />

                <h3 className="font-medium text-text">No owners found</h3>

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
        title="Add Owner"
        fields={[
          {
            name: "firstName",
            label: "First Name",
            placeholder: "Enter first name",
          },
          {
            name: "lastName",
            label: "Last Name",
            placeholder: "Enter last name",
          },
          {
            name: "email",
            label: "Email",
            placeholder: "Enter email",
            type: "email",
          },
          {
            name: "password",
            label: "Password",
            placeholder: "Enter password",
            type: "password",
          },
          {
            name: "phoneNumber",
            label: "Phone Number",
            placeholder: "Enter phone number",
          },
        ]}
        onSubmit={async (data) => {
          console.log(data);
        }}
      />
    </div>
  );
};

export default Owners;
