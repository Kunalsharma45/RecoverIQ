import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion as Motion } from "motion/react";
import { Mail, ArrowLeft } from "lucide-react";
import api from "../../lib/api.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const schema = z.object({
  email: z.string().email("Valid email required"),
});

export default function ForgotPassword() {
  const [serverError, setServerError] = React.useState("");
  const [serverSuccess, setServerSuccess] = React.useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values) => {
      const res = await api.post("/auth/forgot-password", values);
      return res.data;
    },
    onMutate: () => {
      setServerError("");
      setServerSuccess("");
    },
    onSuccess: (data) => {
      setServerSuccess(
        data?.message ||
          "If the email exists, a password reset link has been sent.",
      );
      form.reset();
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message ||
        "Unable to send reset link right now. Please try again.";
      setServerError(message);
    },
  });

  return (
    <div className="min-h-screen bg-[var(--mutedWhite)] flex items-center justify-center px-6 py-10 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--mutedWhite)] via-white to-[var(--cream)] opacity-90 -z-20" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay -z-10 pointer-events-none" />

      <Motion.div
        className="w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-[#E5E7E2] p-8 sm:p-12 relative overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--softLime)]/20 blur-[120px] rounded-full -z-10" />

        <div className="mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--textSoft)] hover:text-[var(--primaryGreen)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>

        <div className="mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--primaryGreen)] flex items-center justify-center text-white shadow-lg mb-5">
            <Mail size={24} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif leading-[1.1] tracking-tight text-[var(--textDark)] mb-4">
            Forgot Password
          </h1>
          <p className="text-lg text-[#5C6B63] leading-relaxed max-w-prose">
            Enter the email address linked to your account and we’ll send a
            reset link if it exists.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="flex flex-col gap-6"
        >
          <div>
            <Input
              type="email"
              placeholder="Email address"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <span className="text-red-500 text-sm mt-2 block pl-4">
                {form.formState.errors.email.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="h-[64px]"
          >
            {mutation.isPending ? "Sending reset link..." : "Send Reset Link"}
          </Button>

          {serverSuccess && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[var(--softLime)]/30 p-4 text-sm text-[var(--textDark)] border border-[var(--borderSoft)]"
            >
              {serverSuccess}
            </Motion.div>
          )}

          {serverError && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100"
            >
              {serverError}
            </Motion.div>
          )}
        </form>
      </Motion.div>
    </div>
  );
}
