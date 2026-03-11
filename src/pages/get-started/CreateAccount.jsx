import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { SignUpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/services";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";

function CreateAccount() {
  const { login } = useAuth();
  const { handleOpenStellarWalletKitModal } = useWallet();
  const navigate = useNavigate();
  const [revealPassword, setRevealPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleClickIcon = () => {
    setRevealPassword((revealPassword) => !revealPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const { mutate: createAccountMutation, isPending: createAccountPending } =
    useMutation({
      mutationFn: (data) => createAccount(data),
      onSuccess: async (data) => {
        if (data.status === 200) {
          const content = data.data.content;
          const token = content.accessToken?.token;
          const email = content.email;

          if (!content.isVerified) {
            login({
              token,
              email,
              user: null,
              otp: null,
              username: null,
              authMethod: "EMAIL",
            });
            navigate("/get-started/verify-email");
          } else if (!content.username) {
            login({
              token,
              email,
              user: null,
              otp: "123456",
              username: null,
              authMethod: "EMAIL",
            });
            navigate("/get-started/username");
          } else {
            login({
              token,
              email: null,
              user: content,
              otp: null,
              username: null,
              authMethod: "EMAIL",
            });
            navigate("/");
            toast.success("Login successful");
            reset();
          }
        } else {
          toast.error("Something went wrong");
        }
      },
      onError: (error) => {
        console.error("Error:", error.response.data.message);
        toast.error(error.response.data.message);
      },
    });

  const onSubmit = (data) => {
    createAccountMutation(data);
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };

  return (
    <div className="">
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Create Account
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Get started with a preferred option or{" "}
          <Link
            className="text-[#2F0FD1] hover:underline"
            to={
              isGoogleLoading || createAccountPending
                ? "/get-started"
                : "/login"
            }
          >
            Login
          </Link>
        </p>
      </div>

      <div className="space-y-[32px]">
        <div className="space-y-[16px]">
          <Button
            className="w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
            onClick={handleOpenStellarWalletKitModal}
            disabled={createAccountPending || isGoogleLoading}
          >
            <img
              className="h-auto w-10 rounded-full"
              src="/cryptoIcons/12000000.svg"
              alt=""
            />
            Sign up with Wallet
          </Button>

          <Button
            onClick={handleGoogleSignup}
            className="w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
            disabled={
              createAccountPending ||
              !import.meta.env.VITE_GOOGLE_AUTH_URL ||
              isGoogleLoading
            }
          >
            <FcGoogle style={{ width: "24px", height: "24px" }} />
            {isGoogleLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
              </div>
            ) : (
              "Sign up with Google"
            )}
          </Button>
        </div>

        <p className="relative flex items-center text-[14px] text-[#525866] before:mr-4 before:flex-1 before:border-t before:border-gray-300 after:ml-4 after:flex-1 after:border-t after:border-gray-300 sm:text-base">
          Or Sign Up with Email
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[32px]">
          <CustomInput
            className="h-[48px]"
            label="Email Address"
            placeholder="Enter Email Address"
            type="email"
            error={errors.email?.message}
            {...register("email")}
            disabled={createAccountPending || isGoogleLoading}
          />

          <CustomInput
            className="h-[48px]"
            label="Password"
            placeholder="Enter Password"
            type={revealPassword ? "text" : "password"}
            icon={revealPassword ? <IoMdEyeOff /> : <IoEye />}
            handleClickIcon={handleClickIcon}
            error={errors.password?.message}
            {...register("password")}
            disabled={createAccountPending || isGoogleLoading}
          />

          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              type="submit"
              disabled={createAccountPending || isGoogleLoading}
            >
              {createAccountPending ? "Processing..." : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
