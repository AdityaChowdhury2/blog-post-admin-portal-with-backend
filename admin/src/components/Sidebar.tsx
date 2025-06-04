import logo from "../assets/images/logo-dark.png"; // Update path as needed

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    navMenu: {
        icon: React.ReactNode;
        text: string;
        href: string;
        badge?: string;
    }[];
}

export default function Sidebar({ open, onClose, navMenu }: SidebarProps) {
    return (
        <aside
            id="app-menu"
            className={`
        hs-overlay fixed inset-y-0 start-0 z-60 hidden w-sidenav min-w-sidenav
        -translate-x-full transform overflow-y-auto bg-body transition-all duration-300
        hs-overlay-open:translate-x-0 lg:bottom-0 lg:end-auto lg:z-30 lg:block lg:translate-x-0
        rtl:translate-x-full rtl:hs-overlay-open:translate-x-0 rtl:lg:translate-x-0
        print:hidden [--body-scroll:true] [--overlay-backdrop:true] lg:[--overlay-backdrop:false]
        ${open ? "block hs-overlay-open:translate-x-0" : ""}
      `}
        >
            <div className="sticky top-0 flex h-16 items-center justify-center px-6">
                <a href="/">
                    <img src={logo} alt="logo" className="flex h-10" />
                </a>
            </div>

            <div className="h-[calc(100%-64px)] p-4 lg:ps-8" data-simplebar>
                <ul className="admin-menu hs-accordion-group flex w-full flex-col gap-1.5">
                    {navMenu.map((item, idx) => (
                        <li className="menu-item" key={idx}>
                            <a
                                href={item.href}
                                className="group flex items-center gap-x-4 rounded-md px-3 py-2 text-sm font-medium text-default-700 transition-all hover:bg-default-900/5"
                            >
                                {item.icon}
                                <span className="menu-text">{item.text}</span>
                                {item.badge && (
                                    <span className="ms-auto inline-flex items-center gap-x-1.5 py-0.5 px-2 rounded-md font-semibold text-xs bg-gray-800 text-white">
                                        {item.badge}
                                    </span>
                                )}
                            </a>
                        </li>
                    ))}
                    {/* Add your accordion sections here as in your HTML if needed */}
                </ul>
            </div>
            {/* Optionally add a close button for mobile */}
            <button
                className="lg:hidden absolute top-2 right-2 text-gray-400"
                onClick={onClose}
            >
                ✕
            </button>
        </aside>
    );
}
