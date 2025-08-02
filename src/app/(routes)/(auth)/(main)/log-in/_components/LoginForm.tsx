"use client";
import { FormInput, GoogleSignInButton, OrDivider } from "@/components/ui/auth";
import GlowingButton from "@/components/ui/common/GlowingButton";
import { useToastContext } from "@/context/ToastContext";
import LoginSchema from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
  });

  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [userIsBanned, setUserIsBanned] = useState(false);
  const { addToast } = useToastContext();

  async function onSubmit(data: FormData) {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      if (res.error === "AccountInactive") {
        setUserIsBanned(true);
      } else {
        setInvalidCredentials(true);
      }
      return;
    }

    addToast("successfully logged in", "success");
    window.location.href = "/";
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <FormInput
          id="email"
          label="Email"
          {...register("email")}
          placeholder="Enter your email "
          required
          icon={<Mail />}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 100,
            damping: 12,
          }}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-[#ff5f5f]">{errors.email.message}</p>
        )}
      </div>
      <div>
        <FormInput
          id="password"
          label="Password"
          type="password"
          {...register("password")}
          placeholder="Enter your password"
          required
          icon={<Lock />}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 12,
          }}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-[#ff5f5f]">
            {errors.password.message}
          </p>
        )}
      </div>
      {invalidCredentials && (
        <p className="mt-1 text-sm text-[#ff5f5f]">
          Email or password are incorrect
        </p>
      )}
      {userIsBanned && (
        <p className="mt-1 text-sm text-[#ff5f5f]">
          This user is no longer active
        </p>
      )}{" "}
      <GlowingButton type="submit" fullWidth>
        LOG IN
      </GlowingButton>
      <OrDivider />
      <GoogleSignInButton setAccountIsInactive={setUserIsBanned} />
    </form>
  );
};

export default LoginForm;
