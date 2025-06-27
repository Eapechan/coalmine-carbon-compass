import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.email || !formData.password || !formData.role) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const success = await login(formData.email, formData.password, formData.role);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid credentials. Please check your email, password, and role.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center sustainability-gradient p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">CM</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              CoalMineNetZero
            </CardTitle>
            <CardDescription className="text-gray-600">
              Carbon Neutrality Platform for Indian Coal Mines
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@coalmine.gov.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mine-operator">Mine Operator</SelectItem>
                    <SelectItem value="regulator">Regulator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full sustainability-gradient text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Demo Credentials:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Mine Operator:</strong> operator@coalmine.gov.in / password123</p>
                <p><strong>Regulator:</strong> regulator@cpcb.gov.in / password123</p>
                <p><strong>Admin:</strong> admin@coalmine.gov.in / password123</p>
              </div>
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </div>
            
            <div className="text-center text-xs text-gray-500">
              <p>🇮🇳 Supporting India's Net Zero Mission 2070</p>
              <p className="mt-1">Empowering Coal Mines for Carbon Neutrality</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
