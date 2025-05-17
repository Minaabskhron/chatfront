"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validateField } from "../_utils/validateForm";
import { useSession } from "next-auth/react";

const page = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRepassword] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status, router]);

  const formData = { name, email, password, rePassword, username };

  const hasFormErrors = () => {
    return (
      Object.values(errors).some((error) => error && error !== "") ||
      name === "" ||
      email === "" ||
      username === "" ||
      password === "" ||
      rePassword === "" ||
      password !== rePassword
    );
  };
  const handleBlur = (fieldName) => {
    const error = validateField(fieldName, formData[fieldName], formData);
    setErrors((prev) => ({ ...prev, [fieldName]: error, back: "" }));
  };

  const onkeyUp = (value) => {
    if (errors[value] || errors.back) handleBlur(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(`${process.env.BASEURL}/api/v1/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          name,
          gender,
          email,
          password,
          rePassword,
          age,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        throw new Error(data.error || "Sign up failed");
      }
      router.push("/signin");
    } catch (error) {
      setErrors({ back: error.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-evenly items-center mt-10   ">
      <div></div>
      <div className="w-100">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Signup to start chatting
        </h1>
        <form onSubmit={handleSubmit} className="mt-10">
          <div className="flex justify-between">
            <label htmlFor="name" className="block pb-2 font-semibold text-sm">
              Name
            </label>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <input
            onBlur={() => {
              handleBlur("name");
            }}
            onKeyUp={() => {
              onkeyUp("name");
            }}
            id="name"
            placeholder="Name"
            type="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ps-2 w-full py-2 border-2 border-gray-300 rounded-lg"
          />

          <div className="flex justify-between my-2">
            <label htmlFor="username" className="block  font-semibold text-sm">
              Username
            </label>
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <input
            onBlur={() => {
              handleBlur("username");
            }}
            onKeyUp={() => {
              onkeyUp("username");
            }}
            id="username"
            placeholder="username"
            type="text"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="ps-2 w-full py-2 border-2 border-gray-300 rounded-lg"
          />

          <div className="my-2">
            <label htmlFor="age" className="block  font-semibold text-sm">
              Age
            </label>
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
          <input
            onBlur={() => {
              handleBlur("age");
            }}
            onKeyUp={() => {
              onkeyUp("age");
            }}
            id="age"
            placeholder="age"
            type="number"
            name="age"
            required
            value={age}
            min={0}
            onChange={(e) => {
              let newValue = Math.abs(e.target.value);
              if (newValue === 0) newValue = "";
              setAge(newValue);
            }}
            className="ps-2 w-full py-2 border-2 border-gray-300 rounded-lg 
            [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="my-2 flex justify-between items-center">
            <label htmlFor="gender" className="block  font-semibold text-sm">
              Gender
            </label>
          </div>
          <select
            className="border-2 border-gray-300 rounded-lg"
            name="gender"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <div className="flex justify-between items-center">
            <label htmlFor="email" className="block my-2 font-semibold text-sm">
              Email
            </label>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <input
            onKeyUp={() => {
              onkeyUp("email");
            }}
            onBlur={() => {
              handleBlur("email");
            }}
            id="email"
            placeholder="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="ps-2 w-full py-2 border-2 border-gray-300 rounded-lg"
          />

          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block my-2 font-semibold text-sm"
            >
              Password
            </label>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <input
            onBlur={() => {
              handleBlur("password");
            }}
            onKeyUp={() => {
              onkeyUp("password");
            }}
            id="password"
            placeholder="********"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="ps-2 w-full py-2 border-2 border-gray-300 rounded-lg"
          />
          <div className="flex justify-between items-center">
            <label
              htmlFor="rePassword"
              className="block my-2 font-semibold text-sm"
            >
              rePassword
            </label>
            {errors.rePassword && (
              <p className="text-red-500 text-sm">{errors.rePassword}</p>
            )}
          </div>

          <input
            onKeyUp={() => {
              onkeyUp("rePassword");
            }}
            onBlur={() => {
              handleBlur("rePassword");
            }}
            id="rePassword"
            placeholder="********"
            type="password"
            name="rePassword"
            value={rePassword}
            onChange={(e) => setRepassword(e.target.value)}
            required
            className="ps-2 w-full py-2 border-2 border-gray-300 rounded-lg"
          />
          {errors.back && (
            <p className="bg-red-200 p-2 px-2 mt-4 rounded-xl">{errors.back}</p>
          )}
          <button
            disabled={hasFormErrors() || loading}
            className="w-full mt-10 disabled:opacity-75 
          disabled:cursor-not-allowed bg-green-700 
          rounded-lg py-2 text-white cursor-pointer hover:bg-green-800"
          >
            {loading ? "loading..." : "Sign Up"}
          </button>
        </form>
        <div className="font-semibold mt-5 mb-20">
          <p className="mb-2">
            You have an account?
            <Link className="text-green-700" href="/signin">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
