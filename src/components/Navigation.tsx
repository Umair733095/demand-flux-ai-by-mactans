import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Users } from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/chatbot", label: "AI Chat", icon: MessageSquare },
    { path: "/about", label: "About", icon: Users },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="flex gap-2 p-2 bg-background/80 backdrop-blur-md border border-border/50 rounded-full shadow-[var(--shadow-glass)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              size="icon"
              onClick={() => navigate(item.path)}
              className={`rounded-full ${isActive ? "animate-glow" : ""}`}
            >
              <Icon className="w-5 h-5" />
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
