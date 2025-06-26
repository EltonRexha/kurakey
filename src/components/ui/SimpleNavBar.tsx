import Image from "next/image";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import XLogo from "./common/XLogo";
import NavLinks from "./common/NavLinks";
import GetServerUser from "../../../libs/GetServerUser";
import CoinBalance from "./common/CoinBalance";
import Notification from "../Notification";
import hasUnreadNotifications from "../../../libs/hasUnreadNotifications";
import Profile from "./common/Profile";

const SimpleNavBar = async () => {
  const user = await GetServerUser();

  let profileImage = "/placeholder-avatar.png";
  let hasNewNotifications = false;

  if (user) {
    profileImage = user.image || profileImage;
    hasNewNotifications = await hasUnreadNotifications(user.id);
  }

  return (
    <nav className="bg-[#191838] border-b border-[#11142d] py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Social Links */}
          <div className="flex items-center space-x-6">
            <Link href="/home" className="flex-shrink-0">
              {" "}
              <Image
                src="/logo.png"
                alt="Kurakey"
                width={100}
                height={48}
                sizes="120px"
                className="h-14 w-auto"
              />
            </Link>
            <div className=" items-center space-x-4 hidden sm:flex">
              <a
                href="#"
                className="text-neutral-500 hover:text-[#008cff] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <XLogo className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-neutral-500 hover:text-[#008cff] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* Navigation Links - Now a client component */} <NavLinks />
          {/* User Info Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Notification Icon and Dropdown */}
                <Notification hasNew={hasNewNotifications} />
                {/* Coin Balance */}
                <div className="flex items-center gap-1.5">
                  <CoinBalance />
                </div>
                {/* Profile Image */}
                <Profile imageUrl={profileImage} />
              </>
            ) : (
              <>
                <Link
                  href="/log-in"
                  className="px-4 py-1.5 text-sm font-medium rounded-md text-white/50 bg-transparent border border-white/50 hover:text-white hover:bg-gradient-to-r from-[#008cff] to-[#00d4ff] hover:border-[#008cff] hover:shadow-[0_0_10px_#008cff,0_0_30px_#008cff,0_0_60px_#008cff] transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-1.5 text-sm font-medium rounded-md text-white/50 bg-transparent border border-white/50 hover:text-white hover:bg-gradient-to-r from-[#008cff] to-[#00d4ff] hover:border-[#008cff] hover:shadow-[0_0_10px_#008cff,0_0_30px_#008cff,0_0_60px_#008cff] transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavBar;
