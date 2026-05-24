import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion as Motion } from "motion/react";
import { KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../../lib/api.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const schema = z
  .object({
    token: z.string().min(1, "Reset code is required"),
    password: z.string().min(8, "New password must be at least 8 characters"),
    password_confirmation: z.string().min(8, "Please confirm the new password"),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = React.useState("");
  const [serverSuccess, setServerSuccess] = React.useState("");

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      token,
      password: "",
      password_confirmation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values) => {
      const res = await api.post("/auth/reset-password", {
        token: values.token,
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      return res.data;
    },
    onMutate: () => {
      setServerError("");
      setServerSuccess("");
    },
    onSuccess: (data) => {
      setServerSuccess(
        data?.message || "Password has been reset successfully.",
      );
      form.reset();
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message ||
        "Unable to reset password right now. Please try again.";
      setServerError(message);
    },
  });

  const missingEmail = !email;

  return (
    <div className="min-h-screen bg-(--mutedWhite) flex items-center justify-center px-6 py-10 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-linear-to-br from-(--mutedWhite) via-white to-(--cream) opacity-90 -z-20" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay -z-10 pointer-events-none" />

      <Motion.div
        className="w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-[#E5E7E2] p-8 sm:p-12 relative overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-(--softLime)/20 blur-[120px] rounded-full -z-10" />

        <div className="mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-(--textSoft) hover:text-(--primaryGreen) transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>

        <div className="mb-10">
          <div className="w-14 h-14 rounded-2xl bg-(--primaryGreen) flex items-center justify-center text-white shadow-lg mb-5">
            <KeyRound size={24} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif leading-[1.1] tracking-tight text-(--textDark) mb-4">
            Reset Password
          </h1>
          <p className="text-lg text-[#5C6B63] leading-relaxed max-w-prose">
            Choose a new password for{" "}
            {email ? <strong>{email}</strong> : "your account"}.
          </p>
        </div>

        {missingEmail && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
            The email address is missing from this link. The reset code field is
            still available, but the backend also needs the email.
          </div>
        )}

        <form
          onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
          className="flex flex-col gap-6"
        >
          <div>
            <Input
              type="text"
              placeholder="Reset code from email"
              {...form.register("token")}
            />
            {form.formState.errors.token && (
              <span className="text-red-500 text-sm mt-2 block pl-4">
                {form.formState.errors.token.message}
              </span>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="New password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <span className="text-red-500 text-sm mt-2 block pl-4">
                {form.formState.errors.password.message}
              </span>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm new password"
              {...form.register("password_confirmation")}
            />
            {form.formState.errors.password_confirmation && (
              <span className="text-red-500 text-sm mt-2 block pl-4">
                {form.formState.errors.password_confirmation.message}
              </span>
            )}
          </div>

          <Button type="submit" disabled={mutation.isPending} className="h-16">
            {mutation.isPending ? "Updating password..." : "Update Password"}
          </Button>

          {serverSuccess && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-(--softLime)/30 p-4 text-sm text-(--textDark) border border-(--borderSoft) flex items-start gap-3"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <div>
                <p>{serverSuccess}</p>
                <Link
                  to="/login"
                  className="inline-block mt-2 font-medium text-(--primaryGreen) hover:text-(--darkGreen) transition-colors"
                >
                  Go back to login
                </Link>
              </div>
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
