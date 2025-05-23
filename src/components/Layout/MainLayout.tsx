import React, { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Modules/Header/Header";
import Footer from "../Modules/Footer/Footer";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <div className="min-h-screen bg-secondary-black text-white">
      <Header />

      {/* Main Content */}
      <main className="">{<Outlet />}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
