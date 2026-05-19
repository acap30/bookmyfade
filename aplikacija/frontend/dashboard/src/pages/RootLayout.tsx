import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Bottombar from "../components/layout/Bottombar";

const RootLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-6 pb-20 overflow-y-auto">
          <Outlet />
        </main>

        <Bottombar />
      </div>
    </div>
  );
};

export default RootLayout;
