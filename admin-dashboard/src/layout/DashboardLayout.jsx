import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(false);
        setMobileOpen(false);
      } else {
        setCollapsed(window.innerWidth < 1024);
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileDrawer = () => setMobileOpen(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div
        className={`
          fixed inset-0 z-30 md:hidden
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 ease-in-out
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeMobileDrawer}
      />

      <div
        className={`
          h-full shrink-0
          transition-transform duration-300 ease-in-out
          ${
            isMobile
              ? `fixed z-40 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
              : "relative translate-x-0"
          }
        `}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onClose={closeMobileDrawer}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="shrink-0 px-4 sm:px-6 pt-4">
          <Navbar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onMenuClick={() => setMobileOpen(true)}
          />
        </div>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
