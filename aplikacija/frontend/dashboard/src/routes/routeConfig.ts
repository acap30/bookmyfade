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
];
