import { useState } from "react";
import {
  LuMenu,
  LuChevronDown,
  LuBook,
  LuMessageSquare,
  LuPencil,
  LuUser,
  LuPanelLeftOpen,
  LuPanelLeftClose,
  LuLogOut,
} from "react-icons/lu";

import { Link, Outlet, useNavigate } from "react-router";
import logo from "../assets/images/logo-dark.png";
import logoSm from "../assets/images/logo-sm.png";
import avatar4 from "../assets/images/users/avatar-4.jpg";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useLogoutMutation } from "../redux/api/authApiSlice";

const navMenu = [
  { icon: <LuBook className="size-5" />, text: "Dashboard", href: "/" },
  {
    icon: <LuMessageSquare className="size-5" />,
    text: "Blogs",
    href: "/blogs",
  },
  {
    icon: <LuPencil className="size-5" />,
    text: "Blog Editor",
    href: "/add-blog",
  },
];

function Sidebar({
  open,
  isMinimized,
  toggleMinimized,
  toggleSidebar,
}: {
  open: boolean;
  isMinimized: boolean;
  toggleMinimized: () => void;
  toggleSidebar: () => void;
}) {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      id="app-menu"
      className={`fixed inset-y-0 left-0 z-50 bg-blue-200 transition-all duration-300 transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } ${
        isMinimized ? "w-20" : "w-72"
      } lg:translate-x-0 lg:static flex flex-col h-screen`}
    >
      <div
        className={`flex items-center justify-between ${isMinimized ? "flex-col" : "flex-row"}`}
      >
        <div className="sticky top-0 flex h-16 items-center justify-start px-6">
          <a href="/">
            <img
              src={isMinimized ? logoSm : logo}
              alt="logo"
              className={isMinimized ? "h-8" : "h-10"}
            />
          </a>
        </div>

        {/* Toggle minimize button */}
        <button
          className="text-black  lg:flex hidden cursor-pointer"
          onClick={toggleMinimized}
        >
          {isMinimized ? (
            <LuPanelLeftOpen size={20} />
          ) : (
            <LuPanelLeftClose size={20} />
          )}
        </button>
      </div>

      <nav
        className={`p-4 overflow-y-auto flex-1 ${isMinimized ? "px-2" : "lg:ps-8"}`}
      >
        <ul className="flex flex-col gap-2">
          {navMenu.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.href}
                className={`flex items-center ${
                  isMinimized ? "justify-center" : "gap-4"
                } rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-200`}
                title={isMinimized ? item.text : ""}
                onClick={toggleSidebar}
              >
                {item.icon}
                {!isMinimized && <span>{item.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button fixed at the bottom of the sidebar */}
      <div className="mt-auto p-4 ">
        <Button
          variant="ghost"
          className={`w-full hover:cursor-pointer ${
            isMinimized ? "justify-center px-0" : "justify-start gap-2"
          } text-gray-700 hover:bg-gray-100`}
          onClick={handleLogout}
          title={isMinimized ? "Logout" : ""}
        >
          <LuLogOut size={18} />
          {!isMinimized && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

// function MobileNav() {
//     return (
//         <nav className="fixed bottom-0 z-50 shadow-md w-full h-16 flex items-center justify-between px-5 bg-white border-t">
//             <a href="/" className="flex flex-col items-center text-gray-600">
//                 <Gauge className="size-5" />
//                 <span className="text-xs font-semibold">Home</span>
//             </a>
//             <a href="#" className="flex flex-col items-center text-gray-600">
//                 <Search className="size-5" />
//                 <span className="text-xs font-semibold">Search</span>
//             </a>
//             <a href="#" className="flex flex-col items-center text-gray-600">
//                 <Compass className="size-5" />
//                 <span className="text-xs font-semibold">Explore</span>
//             </a>
//             <a href="#" className="flex flex-col items-center text-gray-600">
//                 <Bell className="size-5" />
//                 <span className="text-xs font-semibold">Alerts</span>
//             </a>
//             <a href="#" className="flex flex-col items-center text-gray-600">
//                 <CircleUser className="size-5" />
//                 <span className="text-xs font-semibold">Profile</span>
//             </a>
//         </nav>
//     );
// }

function Topbar({ onSidebarOpen }: { onSidebarOpen: () => void }) {
  return (
    <header className="lg:hidden h-16 flex items-center gap-4 border-b border-gray-200 bg-white/80 backdrop-blur px-4">
      <a href="/">
        <img src={logoSm} className="h-6" alt="Small logo" />
      </a>
      <button
        className="p-2 text-gray-500 hover:text-gray-800"
        onClick={onSidebarOpen}
      >
        <LuMenu className="size-6" />
      </button>
      <div className="ml-auto flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2">
              <img
                src={avatar4}
                alt="user"
                className="rounded-full h-10 ml-4"
              />
              <LuChevronDown className="inline ml-1 size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <LuUser className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <LuLogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <img src={usFlag} alt="us-flag" className="h-4 w-6" /> */}
      </div>
    </header>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-blue-200">
      {/* Sidebar for large screens & overlay for mobile */}
      <Sidebar
        open={sidebarOpen}
        isMinimized={isMinimized}
        toggleMinimized={toggleMinimized}
        toggleSidebar={toggleSidebar}
      />

      {/* Overlay backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/50 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden lg:p-4">
        {/* Topbar for mobile */}
        <Topbar onSidebarOpen={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 md:rounded-xl overflow-y-auto border border-dashed border-slate-600 bg-blue-300">
          <Outlet />
        </main>
        {/* Mobile Nav */}
        {/* <div className="hidden">
                    <MobileNav />
                </div> */}
      </div>
    </div>
  );
}
