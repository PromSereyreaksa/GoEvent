import { Menu } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export const SidebarTrigger = ({ className = "" }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={`p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors ${className}`}
      aria-label="Toggle sidebar"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};
