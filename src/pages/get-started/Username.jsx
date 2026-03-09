import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { setItemInSessionStorage } from "@/lib/utils";
import { UsernameSchema } from "@/schemas";
import { checkUsernameAvailability, createUsername } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function Username() {
  const { login, token, otp, username, email } = useAuth();
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(usernameInput);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [usernameInput]);

  useEffect(() => {
    if (!otp && username) {
      navigate("/get-started/bind-email");
    } else if (!otp) {
      navigate("/get-started/verify-email");
    }
  }, [navigate, otp, username]);

  useEffect(() => {
    if (username && !email) {
      navigate("/get-started/bind-email");
    } else if (username && email) {
      navigate("/get-started/create-wallet");
    }
  }, [navigate, username, email, otp]);

  console.log({ otp, username, email });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(UsernameSchema),
    mode: "onChange",
  });

  const { mutate: createUserNameMutation, isPending: createUsernamePending } =
    useMutation({
      mutationFn: (data) => createUsername(data),
      onSuccess: async (data, variable) => {
        console.log({ data });
        if (data.status === 200) {
          const content = data.data.content;

          setItemInSessionStorage("user", content);

          if (content.authMethod === "WALLET") {
            login({
              token,
              email: null,
              user: null,
              otp: null,
              username: variable.username,
            });
            navigate("/get-started/bind-email", { replace: true });
          } else {
            login({
              token,
              email,
              user: null,
              otp,
              username: variable.username,
            });
            navigate("/get-started/create-wallet", { replace: true });
          }
          toast.success("Username created successfully");
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

  const onSubmit = (data) => {
    createUserNameMutation(data);
  };

  const isUsernameValid = !errors.username;

  const { data: usernameCheckData, isFetching: checkingUsername } = useQuery({
    queryKey: ["checkUsername", debouncedUsername],
    queryFn: () => checkUsernameAvailability(debouncedUsername),
    enabled: !!debouncedUsername && isUsernameValid,
  });

  const handleUsernameChange = (e) => {
    setUsernameInput(e.target.value);
  };

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Provide a Username
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          This username will be your identity on Contribute.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[32px]">
        <div className="space-y-2">
          <CustomInput
            className="h-[48px]"
            label="Username"
            placeholder="Enter Username"
            type="text"
            error={errors.username?.message}
            {...register("username", {
              onChange: handleUsernameChange,
            })}
          />

          {checkingUsername ? (
            <p className="text-left text-sm text-gray-500">...</p>
          ) : usernameCheckData?.data.content.isAvailable === true ? (
            <p className="text-left text-sm text-[#1082E4]">
              Username available
            </p>
          ) : (
            usernameCheckData?.data.content.isAvailable === false && (
              <p className="text-left text-sm text-[#F31307]">Username taken</p>
            )
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="secondary"
            size="lg"
            type="submit"
            disabled={
              createUsernamePending ||
              usernameCheckData?.data.content.isAvailable === false
            }
          >
            {createUsernamePending ? "Processing" : "Proceed"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Username;
