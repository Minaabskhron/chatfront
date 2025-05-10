"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isDisabled = email.trim() === "" || password.trim() === "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // you control redirect manually
    });

    if (res?.ok) {
      router.push("/");
    } else {
      setErrors(res?.error || "Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-evenly items-center mt-10  ">
      <div></div>
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Sign in to start chatting
        </h1>
        <form onSubmit={handleSubmit} className="mt-10">
          <label htmlFor="email" className="block pb-2 font-semibold text-sm">
            Email
          </label>
          <input
            id="email"
            placeholder="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="ps-2 w-full py-2 border-2 border-gray-300 rounded-lg"
          />
          <label
            htmlFor="password"
            className="block mt-7 mb-2 font-semibold text-sm"
          >
            Password
          </label>
          <input
            id="password"
            placeholder="******"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="ps-2 w-full py-2 border-2 border-gray-300 rounded-lg"
          />
          {errors && (
            <p className="bg-red-200 p-2 px-2 mt-4 rounded-xl">{errors}</p>
          )}
          <button
            disabled={isDisabled}
            type="submit"
            className="w-full mt-10 disabled:opacity-75 disabled:cursor-not-allowed bg-green-700 rounded-lg py-2 text-white cursor-pointer hover:bg-green-800"
          >
            {loading ? "loading..." : "Sign In"}
          </button>
        </form>
        <div className="font-semibold mt-5 mb-20">
          <p className="mb-2">
            You don’t have an account?
            <Link className="text-green-700" href="/signup">
              Sign Up
            </Link>
          </p>
          <Link href="/forgetpassword" className="text-green-700">
            Forget Your Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
