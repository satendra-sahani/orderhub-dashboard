import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
