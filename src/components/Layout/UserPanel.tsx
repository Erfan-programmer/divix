import { Outlet } from "react-router-dom";
import UserSidebar from "../Modules/user-panel/UserSidear";

export default function UserPanelLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-3">
        <UserSidebar />
        <main className="bg-white rounded-xl shadow-lg mt-10 md:mt-0 md:p-6 lg:p-0 w-full md:w-[65%] lg:w-full">
          {<Outlet />}
        </main>
      </div>
    </div>
  );
}
