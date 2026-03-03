import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSendOtp } from "@/hooks/useSendOtp";
import { maskEmail } from "@/lib/utils";
import { VerifyEmailSchema } from "@/schemas";
import { verifyEmail } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function VerifyEmail() {
  const { login, token, email, otp } = useAuth();

  const RESEND_OTP_TIME = 60;

  const [secondsLeft, setSecondsLeft] = useState(RESEND_OTP_TIME);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (canResend) return;

    if (secondsLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, canResend]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/get-started");
    }
  }, [navigate, email]);

  useEffect(() => {
    if (otp) {
      navigate("/get-started/username");
    }
  }, [navigate, otp]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(VerifyEmailSchema),
  });

  const { mutate: verifyEmailMutation, isPending: verifyEmailPending } =
    useMutation({
      mutationFn: (data) => verifyEmail(data),
      onSuccess: async (data, variable) => {
        if (data.status === 200) {
          login({
            token: token,
            email: email,
            user: null,
            otp: variable.otp,
            username: null,
          });
          navigate("/get-started/username");
          toast.success("Email verified successfully");
          reset();
        } else {
          toast.error("Something went wrong");
        }
      },
      onError: (error) => {
        console.error("Error:", error.response.data.message);
        toast.error(error.response.data.message);
      },
    });

  const { resendOTPMutation, resendOTPPending } = useSendOtp();

  const handleResendOTP = () => {
    if (!email || resendOTPPending) return;
    resendOTPMutation(
      { email },
      {
        onSuccess: () => {
          setCanResend(false);
          setSecondsLeft(RESEND_OTP_TIME);
        },
      },
    );
  };

  const onSubmit = (data) => {
    verifyEmailMutation({ ...data, email });
  };

  if (!email) {
    return null;
  }

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Check Your Email
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          A six-digit code has been sent to {maskEmail(email)}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[32px]">
        <CustomInput
          className="h-[48px]"
          label="Provide OTP"
          placeholder="Enter OTP"
          type="text"
          inputMode="numeric"
          error={errors.otp?.message}
          maxLength={6}
          {...register("otp", {
            onChange: (e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 6);
              e.target.value = onlyNumbers;
            },
          })}
          disabled={resendOTPPending}
        />

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="secondary"
            size="lg"
            type="submit"
            disabled={verifyEmailPending || resendOTPPending}
          >
            {verifyEmailPending ? "Processing" : "Submit OTP"}
          </Button>

          <div className="text-base text-[#09032A]">
            {!canResend ? (
              <span className="text-[#525866]">
                Resend OTP in{" "}
                <span className="font-semibold">
                  {String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:
                  {String(secondsLeft % 60).padStart(2, "0")}
                </span>
              </span>
            ) : (
              <>
                <span>You missed it? </span>
                <button
                  onClick={handleResendOTP}
                  disabled={resendOTPPending}
                  type="button"
                  className="cursor-pointer text-[#2F0FD1] disabled:cursor-not-allowed disabled:text-[#2F0FD150]"
                >
                  {resendOTPPending ? "Resending OTP..." : "Resend OTP"}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default VerifyEmail;
