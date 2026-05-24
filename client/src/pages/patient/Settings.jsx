import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const schema = z
  .object({
    current_password: z.string().min(6, "Current password is required"),
    password: z.string().min(8, "New password must be at least 8 characters"),
    password_confirmation: z.string().min(8, "Please confirm the new password"),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export default function PatientSettings() {
  const [serverError, setServerError] = React.useState("");
  const [serverSuccess, setServerSuccess] = React.useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values) => {
      const res = await api.post("/auth/change-password", values);
      return res.data;
    },
    onMutate: () => {
      setServerError("");
      setServerSuccess("");
    },
    onSuccess: (data) => {
      setServerSuccess(data?.message || "Password updated successfully.");
      form.reset();
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      const firstField = err?.response?.data?.errors
        ? Object.values(err.response.data.errors)[0]?.[0]
        : null;
      setServerError(firstField || message || "Password update failed.");
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-[var(--cream)] border border-[var(--borderSoft)] shadow-lg p-6">
        <h2 className="serif-heading text-3xl">Settings</h2>
        <p className="mt-2 text-[var(--textSoft)]">
          Update your password and recovery preferences.
        </p>
      </div>

      <div className="rounded-[40px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-8 max-w-2xl">
        <h3 className="serif-heading text-2xl">Reset Password</h3>
        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div>
            <Input
              type="password"
              placeholder="Current password"
              {...form.register("current_password")}
            />
            {form.formState.errors.current_password && (
              <p className="text-sm text-red-600 mt-2">
                {form.formState.errors.current_password.message}
              </p>
            )}
          </div>
          <div>
            <Input
              type="password"
              placeholder="New password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600 mt-2">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirm new password"
              {...form.register("password_confirmation")}
            />
            {form.formState.errors.password_confirmation && (
              <p className="text-sm text-red-600 mt-2">
                {form.formState.errors.password_confirmation.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Updating..." : "Update Password"}
          </Button>

          {serverSuccess && (
            <div className="rounded-[24px] bg-[var(--softLime)] border border-[var(--borderSoft)] px-4 py-3 text-sm text-[var(--textDark)]">
              {serverSuccess}
            </div>
          )}
          {serverError && (
            <div className="rounded-[24px] bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
