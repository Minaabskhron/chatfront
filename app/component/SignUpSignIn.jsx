"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

const SignUpSignIn = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pathName = usePathname();
  let href;
  if (pathName === "/signup") href = "/signin";
  if (pathName === "/signin") href = "/signup";

  return (
    <>
      <div ref={menuRef} className="flex justify-center items-center">
        <div className="cursor-pointer relative"></div>
        <div className="relative"></div>
        <div>
          <span
            className="bg-black text-white py-2 px-3 cursor-pointer sm ms-1 rounded-full"
            onClick={() => {
              setOpen((s) => !s);
            }}
          >
            {session?.user.name[0].toUpperCase()}
          </span>

          {open && (
            <div className="relative">
              <div className="absolute  mt-4 w-44 bg-white  rounded-lg shadow-md z-50 text-sm">
                <div className="border-b-1 border-b-green-700 pt-4 px-4">
                  <p className="font-semibold text-green-700 mb-1">
                    {session?.user.name}
                  </p>
                  <p className="text-black font-semibold mb-3 truncate ">
                    {session?.user.email}
                  </p>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100
                     hover:text-green-700 text-gray-700 cursor-pointer transition "
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUpSignIn;
