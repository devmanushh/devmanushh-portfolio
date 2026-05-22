"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginInput = z.infer<typeof schema>;

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: LoginInput) {
    setError("");
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (result?.error) {
      setError("Email or password is incorrect.");
      return;
    }

    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="w-full max-w-sm border border-[#dedbd2] bg-[#fbfaf6]/75 p-5">
        <div className="mb-6 flex h-10 w-10 items-center justify-center border border-[#dedbd2]">
          <LockKeyhole size={18} />
        </div>
        <h1 className="text-2xl font-semibold">Admin login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-3">
          <input
            className="field"
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          <input
            className="field"
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <button
            disabled={formState.isSubmitting}
            className="border border-[#151515] bg-[#151515] px-4 py-3 text-sm font-medium text-[#f8f7f3] disabled:opacity-60"
          >
            {formState.isSubmitting ? "Checking..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
