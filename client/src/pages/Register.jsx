import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import * as authApi from "../api/auth.api";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Register = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await authApi.register(data);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <AuthLayout title="Cortex" subtitle="Start Curating Your Knowledge">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Username</label>
          <input
            {...register("name")}
            type="text"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo transition-colors font-mono"
            placeholder="thecurator"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1 font-mono">{errors.name.message}</p>}
        </div>

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
          <input
            {...register("password")}
            type="password"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo transition-colors font-mono"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-400 text-xs mt-1 font-mono">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo hover:bg-indigo-dark text-white font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm font-mono">
          Already a curator?{" "}
          <Link to="/login" className="text-indigo hover:text-indigo-light font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
