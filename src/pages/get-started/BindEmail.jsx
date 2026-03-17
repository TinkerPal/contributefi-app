import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import CustomInput from "@/components/CustomInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BindEmailSchema } from "@/schemas";
import { useEffect } from "react";
import { bindEmail } from "@/services";
import { useMutation } from "@tanstack/react-query";

function BindEmail() {
  const { login, token, email, otp, username } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username");
    }
  }, [navigate, username]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BindEmailSchema),
  });

  const { mutate: sendOTPMutation, isPending: sendOTPPending } = useMutation({
    mutationFn: (data) => bindEmail(data),
    onSuccess: async (data, variables) => {
      if (data.status === 200) {
        login({
          token,
          email: variables.email,
          user: null,
          otp: null,
          username: null,
        });
        navigate("/get-started/verify-email", { replace: true });
        toast.success("OTP sent successfully");
      } else {
        toast.error("Something went wrong");
      }
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to send OTP";
      console.error("Error:", message);
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    sendOTPMutation({ email: data.email });
  };

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Add an Email Address
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Kindly use an email you have access to
        </p>
        <Link
          to="/get-started/account-configuration"
          onClick={() => {
            login({
              token: token,
              email: email,
              user: null,
              otp: otp,
              username: username,
            });
          }}
          className="absolute top-5 right-10 text-base font-medium text-[#2F0FD1] sm:top-10"
        >
          Skip till Later &gt;&gt;
        </Link>
      </div>

      <div className="space-y-[40px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[32px]">
          <CustomInput
            className="h-[48px]"
            label="Email Address"
            placeholder="Enter Email Address"
            type="text"
            error={errors.email?.message}
            {...register("email")}
            disabled={sendOTPPending}
          />

          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              type="submit"
              disabled={sendOTPPending}
            >
              {sendOTPPending ? "Processing" : "Submit Email Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BindEmail;
