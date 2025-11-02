import { useEffect } from "react";
import { Linkedin, Github, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";

const teamMembers = [
  {
    name: "Saad Nazir",
    role: "AI/ML Engineer",
    description: "Specialized in demand forecasting and optimization algorithms",
    linkedin: "#",
    github: "#",
    email: "saad@example.com",
  },
  {
    name: "Muhammad Umair ",
    role: "Full-Stack Developer",
    description: "Built the dashboard and integrated AI models",
    linkedin: "#",
    github: "#",
    email: "umair@example.com",
  },
  {
    name: "Umar Khalid",
    role: "Data Scientist",
    description: "Developed predictive models and data pipelines",
    linkedin: "#",
    github: "#",
    email: "umar@example.com",
  },
];

const AboutUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="fixed inset-0 bg-[var(--gradient-mesh)] pointer-events-none" />
        <div className="fixed inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
      
        <div className="relative">
          <main className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                About Us
              </h1>
              <p className="text-muted-foreground mt-1">Meet the team behind Smart Inventory Optimizer</p>
            </div>
            {/* Project Description */}
            <Card className="p-8 mb-12 bg-card/60 backdrop-blur-xl border-border/50 shadow-[var(--shadow-card)] animate-fade-in">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
About Nexora              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Our AI-powered system revolutionizes inventory management by predicting demand patterns
              and recommending optimal inventory levels. Using advanced machine learning algorithms,
              we help businesses reduce costs, minimize stockouts, and maintain perfect service levels.
            </p>
          
            </Card>

            {/* Team Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Meet Our Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <Card
                    key={member.name}
                    className="p-6 bg-card/60 backdrop-blur-xl border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p className="text-sm text-primary font-medium">{member.role}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <a
                        href={member.linkedin}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={member.github}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <Card className="p-8 bg-card/60 backdrop-blur-xl border-border/50 shadow-[var(--shadow-card)] animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Technology Stack
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {["React", "TypeScript", "Tailwind CSS", "Recharts", "Machine Learning", "Python", "TensorFlow", "Node.js"].map((tech) => (
                  <div
                    key={tech}
                    className="p-4 bg-primary/5 rounded-lg border border-primary/10 hover:bg-primary/10 transition-all duration-300"
                  >
                    <p className="font-medium">{tech}</p>
                  </div>
                ))}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
