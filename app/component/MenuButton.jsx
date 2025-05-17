"use client";
import { useState } from "react";
import MenuButtonSvg from "../_svg/MenuButtonSvg";
import Link from "next/link";

const MenuButton = () => {
  const [open, setOpen] = useState("hidden");
  return (
    <div className="sm:hidden flex ">
      <div
        className="border p-1 rounded-md border-green-600 cursor-pointer"
        onClick={() => {
          if (open === "hidden") {
            setOpen("");
            return;
          }

          setOpen("hidden");
        }}
      >
        <MenuButtonSvg />
      </div>
      <ul
        className={`${open} absolute bg-[#eee]  font-semibold top-14 right-1 p-6 w-full flex flex-col pt-6 gap-2`}
      >
        <li>
          <Link href="/">Home</Link>
        </li>

        <li>
          <Link
            href="/
          "
          >
            Products
          </Link>
        </li>

        <li>
          <Link href="/">Brands</Link>
        </li>

        <li>
          <Link href="/">Categories</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuButton;
