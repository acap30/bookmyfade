import { useEffect, useMemo, useState } from "react";
import SearchInput from "../../components/ui/SearchInput";
import { Loader2, MapPin, MoreHorizontal, Plus, Store } from "lucide-react";
import { getSalons } from "../../api/salonsApi";
import type { ISalon } from "../../types/salon";

const Salons = () => {
  const [search, setSearch] = useState("");
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredSalons = useMemo(() => {
    return salons.filter((salon) =>
      `${salon.name} ${salon.address}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, salons]);

  useEffect(() => {
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

    fetchSalons();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search salons..."
          value={search}
          onChange={setSearch}
        />

        <button className="button-add">
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
    </div>
  );
};

type SalonItemProps = {
  name: string;
  location: string;
};

const SalonItem = ({ name, location }: SalonItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
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
      <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card transition-all hover:scale-105 active:scale-95">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
};

export default Salons;
