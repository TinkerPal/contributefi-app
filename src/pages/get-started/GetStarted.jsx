import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { ConnectWithEmailSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { connectWithEmail } from "@/services";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { ArrowRight } from "lucide-react";

function GetStarted() {
  const { login } = useAuth();
  const {
    handleOpenStellarWalletKitModal,
    isLoading: isWalletLoading,
    setWalletLoading,
  } = useWallet();
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
    resolver: zodResolver(ConnectWithEmailSchema),
  });

  const {
    mutate: connectWithEmailMutation,
    isPending: connectWithEmailPending,
  } = useMutation({
    mutationFn: (data) => connectWithEmail(data),
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
    connectWithEmailMutation(data);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };

  const handleWalletLogin = () => {
    handleOpenStellarWalletKitModal();
  };

  useEffect(() => {
    setIsGoogleLoading(false);
    setWalletLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Welcome Back
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Get started with a preferred option
        </p>
      </div>

      <div className="space-y-[32px]">
        <div className="space-y-[16px]">
          <Button
            disabled={
              connectWithEmailPending || isGoogleLoading || isWalletLoading
            }
            className="group w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
            onClick={handleWalletLogin}
          >
            {isWalletLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
              </div>
            ) : (
              <img
                className="h-auto w-10 rounded-full"
                src="/cryptoIcons/12000000.svg"
                alt=""
              />
            )}
            Connect Wallet
          </Button>

          <Button
            disabled={
              connectWithEmailPending ||
              !import.meta.env.VITE_GOOGLE_AUTH_URL ||
              isGoogleLoading ||
              isWalletLoading
            }
            onClick={handleGoogleLogin}
            className="w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
          >
            {isGoogleLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
              </div>
            ) : (
              <FcGoogle style={{ width: "24px", height: "24px" }} />
            )}
            Use Google
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
            disabled={
              connectWithEmailPending || isGoogleLoading || isWalletLoading
            }
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
            disabled={
              connectWithEmailPending || isGoogleLoading || isWalletLoading
            }
          />

          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              type="submit"
              disabled={
                connectWithEmailPending || isGoogleLoading || isWalletLoading
              }
            >
              {connectWithEmailPending ? "Processing" : "Continue"}
              <ArrowRight />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GetStarted;
