import Link from "next/link";
import Image from "next/image";
import SignUpSignIn from "./SignUpSignIn";
import MenuButton from "./MenuButton";

const NavBar = () => {
  return (
    <div className="bg-[#eee] w-full p-3 fixed top-0 text-gray-500 z-50">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center sm:gap-3 lg:gap-5 lg:mx-20">
          <div className="flex gap-2 items-center ">
            <div>
              <MenuButton />
            </div>
            <Link href="/">home image</Link>
          </div>
          <ul className="sm:flex sm:mt-1 gap-2 lg:gap-5 hidden">
            <li>
              <Link href="/">Home</Link>
            </li>

            <li>
              <Link href="/">Products</Link>
            </li>

            <li>
              <Link href="/">Brands</Link>
            </li>

            <li>
              <Link href="/">Categories</Link>
            </li>
          </ul>
        </div>
        <div className="lg:me-20 ">
          <SignUpSignIn />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
