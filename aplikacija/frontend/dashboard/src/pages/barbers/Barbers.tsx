import { useEffect, useMemo, useState } from "react";
import type { IOwner } from "../../types/owner";
import {
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Store,
  User,
  Users,
} from "lucide-react";
import SearchInput from "../../components/ui/SearchInput";
import { getBarbers } from "../../api/barbersApi";

const Barbers = () => {
  const [search, setSearch] = useState("");
  const [barbers, setBarbers] = useState<IOwner[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredBarbers = useMemo(() => {
    return barbers.filter((barber) =>
      `${barber.user.firstName} ${barber.user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, barbers]);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await getBarbers();

        setBarbers(data);
      } catch (err) {
        console.error("Failed to fetch barbers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search barbers..."
          value={search}
          onChange={setSearch}
        />

        <button className="button-add">
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
    </div>
  );
};

type BarberItemProps = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  salonName: string;
};

const BarberItem = ({
  fullName,
  email,
  phoneNumber,
  salonName,
}: BarberItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <User size={18} />
        </div>

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
      <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card transition-all hover:scale-105 active:scale-95">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
};

export default Barbers;
