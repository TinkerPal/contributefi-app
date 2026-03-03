import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { loginUser } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { WalletContext } from "@/contexts/WalletContext";
import Loader from "@/components/Loader";
// import { useSendOtp } from "@/hooks/useSendOtp";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [revealPassword, setRevealPassword] = useState(false);

  const handleClickIcon = () => {
    setRevealPassword((revealPassword) => !revealPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });
  const { handleConnectStellarKit } = useContext(WalletContext);
  // const { resendOTPMutation, resendOTPPending } = useSendOtp();

  const { mutate: loginMutation, isPending: loginPending } = useMutation({
    mutationFn: (data) => loginUser(data),
    onSuccess: async (data, variable) => {
      if (data.status === 200) {
        if (!data.data.content.isVerified) {
          login({
            token: data.data.content.accessToken.token,
            email: variable.email,
            user: null,
            otp: null,
            username: null,
          });
          // resendOTPMutation({ email: variable.email });
          navigate("/get-started/verify-email");
          toast.success("Kindly verify your email address");
        } else if (!data.data.content.username) {
          login({
            token: data.data.content.accessToken.token,
            email: variable.email,
            user: null,
            otp: "123456",
            username: null,
          });
          navigate("/get-started/username");
          toast.error("Kindly select a username");
        } else {
          login({
            token: data.data.content.accessToken.token,
            email: null,
            user: data.data.content,
            otp: variable.otp,
            username: null,
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
    loginMutation(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  if (isAuthenticated) return <Loader />;

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Welcome Back
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Sign in to access your account or{" "}
          <Link className="text-[#2F0FD1] hover:underline" to="/get-started">
            Create Account
          </Link>
        </p>
      </div>

      <div className="space-y-[32px]">
        <div className="space-y-[16px]">
          <Button
            className="group w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
            // onClick={() => setIsOpen(true)}
            onClick={handleConnectStellarKit}
          >
            <img
              className="h-auto w-10 rounded-full"
              src="/cryptoIcons/12000000.svg"
              alt=""
            />
            Sign in with Stellar Wallet Kit
          </Button>

          <Button
            className="w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
          >
            <FcGoogle style={{ width: "24px", height: "24px" }} />
            Sign in with Google
          </Button>
        </div>

        <p className="relative flex items-center text-[14px] text-[#525866] before:mr-4 before:flex-1 before:border-t before:border-gray-300 after:ml-4 after:flex-1 after:border-t after:border-gray-300 sm:text-base">
          Or Continue with Email/Username
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[32px]">
          <CustomInput
            className="h-[48px]"
            label="Email Address or Username"
            placeholder="Enter Email Address or Username"
            type="text"
            error={errors.email?.message}
            {...register("email")}
            disabled={loginPending}
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
            disabled={loginPending}
          />

          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              type="submit"
              disabled={loginPending}
            >
              {loginPending ? "Processing" : "Log In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
