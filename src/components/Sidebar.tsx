import { LayoutDashboard, MessageSquare, Users, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/chatbot", label: "AI Assistant", icon: MessageSquare },
    { path: "/about", label: "About Us", icon: Users },
  ];

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  // Clear localStorage item
  localStorage.removeItem("nexora_forecast_data");

  if (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  } else {
    navigate("/auth");
  }
};


  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border/50 bg-card/80 backdrop-blur-xl p-6 flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border/50">
        <img src={logo} alt="Logo" className="w-10 h-10" />
        <div>
          <h2 className="font-bold text-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
           Nexora
          </h2>
          <p className="text-xs text-muted-foreground">Optimizer AI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full justify-start gap-3 border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </Button>
    </aside>
  );
};

export default Sidebar;
