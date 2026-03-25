import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import { useAuthStore } from "../stores/authStore";
import * as authApi from "../api/auth.api";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await authApi.login(data);
      login(response.user, response.token);
      toast.success("Welcome back to Cortex!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <AuthLayout title="Cortex" subtitle="Your Second Brain, Reimagined">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo transition-colors font-mono"
            placeholder="curator@cortex.ai"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1 font-mono">{errors.email.message}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo transition-colors font-mono pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} /> }
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1 font-mono">{errors.password.message}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo hover:bg-indigo-dark text-white font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {isSubmitting ? "Authenticating..." : "Sign In"}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm font-mono">
          First time here?{" "}
          <Link to="/register" className="text-indigo hover:text-indigo-light font-bold">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
