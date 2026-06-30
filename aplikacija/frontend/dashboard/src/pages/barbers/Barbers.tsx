import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Users } from "lucide-react";
import SearchInput from "../../components/ui/SearchInput";
import {
  changeBarberActivity,
  createBarber,
  deleteBarber,
  getBarbers,
  updateBarber,
} from "../../api/barbersApi";
import { useNavigate } from "react-router-dom";
import BarberItem from "../../components/items/BarberItem";
import AddUserModal from "../../components/modals/AddUserModal";
import { getMySalonId, getSalons } from "../../api/salonsApi";
import type { ISalon } from "../../types/salon";
import { ROLES } from "../../types/auth";
import EditUserModal from "../../components/modals/EditUserModal";
import type { IBarber } from "../../types/barber";
import { useAuth } from "../../context/AuthContext";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";

const Barbers = () => {
  const [barbers, setBarbers] = useState<IBarber[]>([]);
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [mySalonId, setMySalonId] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState<IBarber | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [salonFilter, setSalonFilter] = useState("");

  const { user } = useAuth();

  const navigate = useNavigate();

  const filteredBarbers = useMemo(() => {
    return barbers.filter(
      (barber) =>
        `${barber.user.firstName} ${barber.user.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (salonFilter === "" || barber.salon.id === Number(salonFilter)),
    );
  }, [search, barbers, salonFilter]);

  const fetchBarbers = async () => {
    try {
      const data = await getBarbers();
      setBarbers(data);

      if (user.role === ROLES.OWNER) {
        const my_salon_id = await getMySalonId();
        setMySalonId(my_salon_id);
      } else {
        const salons_data = await getSalons();
        setSalons(salons_data);
      }
    } catch (err) {
      console.error("Failed to fetch barbers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const handleDelete = async () => {
    await deleteBarber(selectedBarber.id, selectedBarber.user.id);
    fetchBarbers();
  };

  const handleAdd = async (data) => {
    await createBarber({
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber ?? null,
        role: ROLES.BARBER,
      },
      salon_id: user.role !== ROLES.OWNER ? Number(data.salon_id) : mySalonId,
    });

    fetchBarbers();
  };

  const handleEdit = async (data) => {
    if (!selectedBarber) return;

    await updateBarber({
      id: selectedBarber.user.id,
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      phone_number: data.phone_number,
    });

    await fetchBarbers();
  };

  const handleActivityChange = async (barber: IBarber) => {
    await changeBarberActivity(Number(barber.id), barber.isActive);

    await fetchBarbers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search barbers..."
            value={search}
            onChange={setSearch}
          />
          {user.role === ROLES.ADMIN && (
            <select
              value={salonFilter}
              onChange={(e) => setSalonFilter(e.target.value)}
              className="rounded-xl border border-border bg-card px-4 py-3 text-text outline-none focus:border-primary"
            >
              <option value="">All salons</option>

              {salons.map((salon) => (
                <option key={salon.id} value={salon.id}>
                  {salon.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button className="button-add" onClick={() => setAddModalOpen(true)}>
          <Plus size={18} />
          Add Barber
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">All Barbers</h2>

          <span className="text-sm text-muted">
            {filteredBarbers.length} barbers
          </span>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted">
            <Loader2 className="mb-3 animate-spin" size={28} />
            <p className="text-sm">Loading barbers...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBarbers.length > 0 ? (
              filteredBarbers.map((barber) => (
                <BarberItem
                  key={barber.id}
                  fullName={barber.user.fullName}
                  email={barber.user.email}
                  phoneNumber={barber.user.phoneNumber || null}
                  salonName={barber.salon.name}
                  isActive={barber.isActive}
                  profileImage={barber.user.profileImage}
                  onView={() => navigate(`/barbers/${barber.id}`)}
                  onEdit={() => {
                    setSelectedBarber(barber);
                    setEditModalOpen(true);
                  }}
                  onToggleBarberStatus={() => handleActivityChange(barber)}
                  onDelete={() => {
                    setSelectedBarber(barber);
                    setDeleteModalOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
                <Users size={32} className="text-muted mb-3" />

                <h3 className="font-medium text-text">No barbers found</h3>

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
        title="Add Barber"
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
        selects={
          user.role !== ROLES.OWNER
            ? [
                {
                  name: "salon_id",
                  label: "Salon",
                  options: salons.map((salon) => ({
                    value: salon.id,
                    label: salon.name,
                  })),
                },
              ]
            : []
        }
        onSubmit={async (data) => handleAdd(data)}
      />
      <EditUserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Barber"
        fields={[
          { name: "first_name", label: "First Name" },
          { name: "last_name", label: "Last Name" },
          { name: "username", label: "Username" },
          { name: "email", label: "Email", type: "email" },
          { name: "phone_number", label: "Phone Number" },
        ]}
        initialData={
          selectedBarber
            ? {
                first_name: selectedBarber.user.firstName,
                last_name: selectedBarber.user.lastName,
                username: selectedBarber.user.username,
                email: selectedBarber.user.email,
                phone_number: selectedBarber.user.phoneNumber,
                salon_id: String(selectedBarber.salon.id),
              }
            : {}
        }
        onSubmit={async (data) => handleEdit(data)}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Barber"
        subtitle={`Delete ${selectedBarber?.user?.firstName || "Barber"}`}
        message="Are you sure you want to delete this barber? This action cannot be undone."
      />
    </div>
  );
};

export default Barbers;
