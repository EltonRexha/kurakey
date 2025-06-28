import Image from "next/image";
import React from "react";
import { BounceLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#191838]">
      {" "}
      <Image
        src="/logo.png"
        alt="Kurakey Logo"
        width={120}
        height={120}
        sizes="(max-width: 768px) 80px, 120px"
        priority
      />
      <div className="mt-4">
        <BounceLoader color="#008cff" speedMultiplier={0.9} size={100} />
      </div>
      {/* This is here as a indicator */}
      <div className="hidden" id="loading"></div>
    </div>
  );
};

export default Loader;
