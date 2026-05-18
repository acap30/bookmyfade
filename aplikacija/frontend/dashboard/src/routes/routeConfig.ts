export const routeConfig = [
  {
    title: "Dashboard",
    subtitle: "Overview of your business performance",
    match: (pathname: string) => pathname === "/",
  },
  {
    title: "Profile",
    subtitle: "View and update your profile details",
    match: (pathname: string) => pathname.startsWith("/profile"),
  },
  {
    title: "Salons",
    subtitle: "Browse and manage all salon locations",
    match: (pathname: string) => pathname.startsWith("/salons"),
  },
  {
    title: "My Salon",
    subtitle: "Manage your salon information",
    match: (pathname: string) => pathname.startsWith("/my-salon"),
  },
  {
    title: "Owners",
    subtitle: "Browse and manage salon owners",
    match: (pathname: string) => pathname.startsWith("/owners"),
  },
  {
    title: "Barbers",
    subtitle: "Browse and manage barbers",
    match: (pathname: string) => pathname.startsWith("/barbers"),
  },
];
