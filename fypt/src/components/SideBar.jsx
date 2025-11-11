import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  Settings,
  LogOut,
  HelpCircle,
  Plus,
  Upload,
  Folder,
  Activity,
  User,
  Brain,
  Terminal,
  BarChart3,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const mainMenuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
      key: "dashboard",
    },
    {
      icon: FileText,
      label: "Medical Reports",
      href: "/reports",
      key: "reports",
    },
    {
      icon: Calendar,
      label: "Appointments",
      href: "/enhanced-appointments",
      key: "enhanced-appointments",
    },
    {
      icon: Activity,
      label: "Health Metrics",
      href: "/metrics",
      key: "metrics",
    },
    {
      icon: Brain,
      label: "AI Assistant",
      href: "/ai-chat",
      key: "ai-chat",
    },
  ];

  const recordsItems = [
    {
      icon: Plus,
      label: "Add New Record",
      href: "/add-record",
      key: "add-record",
    },
    { icon: Upload, label: "Import Records", href: "/import", key: "import" },
    {
      icon: Folder,
      label: "Record Categories",
      href: "/categories",
      key: "categories",
    },
  ];

  const accountItems = [
    { icon: User, label: "Profile", href: "/profile", key: "profile" },
    {
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
      key: "notifications",
    },
    { icon: Settings, label: "Settings", href: "/settings", key: "settings" },
  ];

  const adminItems = [
    {
      icon: Terminal,
      label: "System Logs",
      href: "/system-logs",
      key: "system-logs",
    },
    {
      icon: BarChart3,
      label: "AI Insights",
      href: "/ai-insights",
      key: "ai-insights",
    },
  ];

  const bottomItems = [
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/support",
      key: "support",
    },
    { icon: LogOut, label: "Sign Out", href: "/logout", key: "logout" },
  ];

  const MenuItem = ({ item, onClick }) => (
    <Link
      to={item.href}
      onClick={onClick}
      className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all duration-200 group"
    >
      <item.icon className="w-5 h-5 mr-3 group-hover:text-green-600" />
      <span className="font-medium">{item.label}</span>
    </Link>
  );

  const MenuSection = ({ title, items, onClick }) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <MenuItem key={item.key} item={item} onClick={onClick} />
        ))}
      </nav>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0 bg-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-600 to-blue-600">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">VL</span>
              </div>
              <div>
                <h2 className="text-white font-bold">VitaLife</h2>
                <p className="text-green-100 text-xs">Health Records</p>
              </div>
            </div>
            <SheetClose asChild></SheetClose>
          </div>

          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">User</h3>
                <p className="text-sm text-gray-500">user@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="flex-1 py-6 overflow-y-auto">
            <MenuSection
              title="Main Menu"
              items={mainMenuItems}
              onClick={() => setOpen(false)}
            />

            <MenuSection
              title="Records Management"
              items={recordsItems}
              onClick={() => setOpen(false)}
            />

            <MenuSection
              title="Account"
              items={accountItems}
              onClick={() => setOpen(false)}
            />

            <MenuSection
              title="Administration"
              items={adminItems}
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="border-t p-4">
            <nav className="space-y-1">
              {bottomItems.map((item) => (
                <MenuItem
                  key={item.key}
                  item={item}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
