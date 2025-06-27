"use client";
import React, { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import GlowingButton from "../common/GlowingButton";
import { useSearchParams } from "next/navigation";

interface Props {
  setAccountIsInactive: (active: boolean) => void;
}

const GoogleSignInButton = ({ setAccountIsInactive }: Props) => {
  const searchParams = useSearchParams();

  // If NextAuth redirects back with ?error=Callback, mark the account as active
  useEffect(() => {
    if (searchParams?.get("error") === "Callback") {
      setAccountIsInactive(true);
    }
  }, [searchParams, setAccountIsInactive]);

  return (
    <GlowingButton
      type="button"
      fullWidth
      onClick={() => {
        signIn("google", {
          redirect: true,
          callbackUrl: "/",
        });
      }}
    >
      <div className="flex items-center justify-center gap-2">
        <FaGoogle className="text-xl" />
        Continue with Google
      </div>
    </GlowingButton>
  );
};

export default GoogleSignInButton;
