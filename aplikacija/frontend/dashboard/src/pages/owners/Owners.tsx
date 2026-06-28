import { useEffect, useMemo, useState } from "react";
import type { IOwner } from "../../types/owner";
import {
  changeOwnerActivity,
  createOwner,
  deleteOwner,
  getOwners,
  updateOwner,
} from "../../api/ownersApi";
import { Loader2, Plus, Users } from "lucide-react";
import SearchInput from "../../components/ui/SearchInput";
import OwnerItem from "../../components/items/OwnerItem";
import AddUserModal from "../../components/modals/AddUserModal";
import type { ISalon } from "../../types/salon";
import { getSalons } from "../../api/salonsApi";
import { ROLES } from "../../types/auth";
import EditUserModal from "../../components/modals/EditUserModal";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";

const Owners = () => {
  const [search, setSearch] = useState("");
  const [owners, setOwners] = useState<IOwner[]>([]);
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<IOwner | null>(null);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
      const salons_data = await getSalons();
      setOwners(data);
      setSalons(salons_data);
    } catch (err) {
      console.error("Failed to fetch owners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleDelete = async () => {
    await deleteOwner(selectedOwner.id, selectedOwner.user.id);
    fetchOwners();
  };

  const handleAdd = async (data) => {
    await createOwner({
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber ?? null,
        role: ROLES.OWNER,
      },
      salon_id: Number(data.salon_id),
    });

    fetchOwners();
  };

  const handleEdit = async (data) => {
    if (!selectedOwner) return;

    await updateOwner({
      id: selectedOwner.user.id,
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      phone_number: data.phone_number,
    });

    await fetchOwners();
  };

  const handleActivityChange = async (owner: IOwner) => {
    await changeOwnerActivity(Number(owner.id), owner.isActive);

    await fetchOwners();
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
                  isActive={owner.isActive}
                  onEdit={() => {
                    setSelectedOwner(owner);
                    setEditModalOpen(true);
                  }}
                  onToggleBarberStatus={() => handleActivityChange(owner)}
                  onDelete={() => {
                    setSelectedOwner(owner);
                    setDeleteModalOpen(true);
                  }}
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
      <AddUserModal
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
            name: "username",
            label: "Username",
            placeholder: "Enter username",
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
        selects={[
          {
            name: "salon_id",
            label: "Salon",
            options: salons.map((salon) => ({
              value: salon.id,
              label: salon.name,
            })),
          },
        ]}
        onSubmit={async (data) => handleAdd(data)}
      />
      <EditUserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Owner"
        fields={[
          { name: "first_name", label: "First Name" },
          { name: "last_name", label: "Last Name" },
          { name: "username", label: "Username" },
          { name: "email", label: "Email", type: "email" },
          { name: "phone_number", label: "Phone Number" },
        ]}
        initialData={
          selectedOwner
            ? {
                first_name: selectedOwner.user.firstName,
                last_name: selectedOwner.user.lastName,
                username: selectedOwner.user.username,
                email: selectedOwner.user.email,
                phone_number: selectedOwner.user.phoneNumber,
                salon_id: String(selectedOwner.salon.id),
              }
            : {}
        }
        onSubmit={async (data) => handleEdit(data)}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Owner"
        subtitle={`Delete ${selectedOwner?.user?.firstName || "Owner"}`}
        message="Are you sure you want to delete this owner? This action cannot be undone."
      />
    </div>
  );
};

export default Owners;
