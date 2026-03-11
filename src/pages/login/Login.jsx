import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { LoginWithEmailSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { loginWithEmail } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";

function Login() {
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const redirectParam = searchParams.get("redirect");
  // const from = location.state?.from?.pathname || redirectParam || "/";
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
    resolver: zodResolver(LoginWithEmailSchema),
  });

  const { mutate: loginWithEmailMutation, isPending: loginWithEmailPending } =
    useMutation({
      mutationFn: (data) => loginWithEmail(data),
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
            });
            navigate("/get-started/verify-email");
          } else if (!content.username) {
            login({
              token,
              email,
              user: null,
              otp: "123456",
              username: null,
            });
            navigate("/get-started/username");
          } else {
            login({
              token,
              email: null,
              user: content,
              otp: null,
              username: null,
            });
            navigate("/", { replace: true });
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
    loginWithEmailMutation(data);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };

  const handleWalletLogin = () => {
    handleOpenStellarWalletKitModal();
  };

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Welcome Back
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Sign in to access your account or{" "}
          <Link
            className="text-[#2F0FD1] hover:underline"
            to={
              isGoogleLoading || loginWithEmailPending
                ? "/login"
                : "/get-started"
            }
          >
            Create Account
          </Link>
        </p>
      </div>

      <div className="space-y-[32px]">
        <div className="space-y-[16px]">
          <Button
            disabled={loginWithEmailPending || isGoogleLoading}
            className="group w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
            onClick={handleWalletLogin}
          >
            <img
              className="h-auto w-10 rounded-full"
              src="/cryptoIcons/12000000.svg"
              alt=""
            />
            Sign in with Wallet
          </Button>

          <Button
            disabled={
              loginWithEmailPending ||
              !import.meta.env.VITE_GOOGLE_AUTH_URL ||
              isGoogleLoading
            }
            onClick={handleGoogleLogin}
            className="w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
          >
            <FcGoogle style={{ width: "24px", height: "24px" }} />
            {isGoogleLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
              </div>
            ) : (
              "Sign in with Google"
            )}
          </Button>
        </div>

        <p className="relative flex items-center text-[14px] text-[#525866] before:mr-4 before:flex-1 before:border-t before:border-gray-300 after:ml-4 after:flex-1 after:border-t after:border-gray-300 sm:text-base">
          Or Continue with Email
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[32px]">
          <CustomInput
            className="h-[48px]"
            label="Email Address"
            autoComplete="email"
            placeholder="Enter Email Address"
            type="text"
            error={errors.email?.message}
            {...register("email")}
            disabled={loginWithEmailPending || isGoogleLoading}
          />

          <CustomInput
            className="h-[48px]"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter Password"
            type={revealPassword ? "text" : "password"}
            icon={revealPassword ? <IoMdEyeOff /> : <IoEye />}
            handleClickIcon={handleClickIcon}
            error={errors.password?.message}
            {...register("password")}
            disabled={loginWithEmailPending || isGoogleLoading}
          />

          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              type="submit"
              disabled={loginWithEmailPending || isGoogleLoading}
            >
              {loginWithEmailPending ? "Processing" : "Log In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
