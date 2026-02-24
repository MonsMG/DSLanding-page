import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/");
    } catch {
      // 🔒 ไม่แสดง error ดิบจาก Supabase (ป้องกัน email enumeration)
      setError("Email or password is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background matching design system */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--ds-beige))] via-[hsl(var(--ds-cream))] to-white" />

      {/* Decorative gradient blobs */}
      <div className="absolute top-20 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl float" />
      <div className="absolute bottom-20 -right-32 w-[400px] h-[400px] bg-gradient-to-bl from-[hsl(var(--ds-cream))] to-primary/10 rounded-full blur-3xl float-delayed" />

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md border-primary/20 shadow-xl bg-card/90 backdrop-blur-xl animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          {/* DS Logo */}
          <div className="flex items-center justify-center gap-1 mb-4 animate-fade-in">
            <span className="text-4xl font-bold text-[hsl(var(--ds-chocolate))] tracking-tight">
              DS
            </span>
            <span className="w-3 h-3 rounded-full bg-primary" />
          </div>

          <CardTitle className="text-2xl font-bold text-primary animate-fade-in-up stagger-1">
            Admin Access
          </CardTitle>
          <CardDescription className="animate-fade-in-up stagger-2">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 animate-fade-in-up stagger-3">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-9 bg-background/50 focus:bg-background transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="passwords"
                  className="pl-9 bg-background/50 focus:bg-background transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 animate-fade-in-up stagger-4">
            <Button
              type="submit"
              className="w-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <Button
              variant="link"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={() => navigate("/")}
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Website
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
