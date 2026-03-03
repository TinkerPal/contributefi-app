import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import CustomInput from "./CustomInput";
import { Textarea } from "./ui/textarea";
import { CreateCommunitySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { checkUsernameAvailability, createCommunity } from "@/services";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router";

function CreateCommunityForm() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(CreateCommunitySchema),
  });

  const [usernameInput, setUsernameInput] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(usernameInput);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [usernameInput]);

  const isCommunityAliasValid = !errors.communityUsername;

  const { data: usernameCheckData, isFetching: checkingUsername } = useQuery({
    queryKey: ["checkUsername", debouncedUsername],
    queryFn: () => checkUsernameAvailability(debouncedUsername),
    enabled: !!debouncedUsername && isCommunityAliasValid,
  });

  useEffect(() => {
    if (usernameCheckData?.data?.content) {
      setUsernameAvailable(usernameCheckData.data.content.isAvailable);
    } else {
      setUsernameAvailable(null);
    }
  }, [usernameCheckData]);

  const { mutate: createCommunityMutation, isPending: createCommunityPending } =
    useMutation({
      mutationFn: (data) => createCommunity(data),
      onSuccess: async (data) => {
        if (data.status === 201) {
          toast.success("Community created successfully");
          reset();
          setOpen(false);
          queryClient.invalidateQueries(["communities"]);
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
    if (usernameAvailable === false) {
      toast.error("Please choose an available username");
      return;
    }
    createCommunityMutation(data);
  };

  useEffect(() => {
    if (!open) {
      reset();
      setUsernameInput("");
      setDebouncedUsername("");
    }
  }, [open, reset]);

  const handleUsernameChange = (e) => {
    setUsernameInput(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={() => {
          if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
          }
          setOpen(true);
        }}
      >
        Create Community
      </Button>
      <DialogContent className="scrollbar-hidden max-h-[calc(100vh-150px)] overflow-scroll bg-white p-10 sm:max-w-[980px]">
        <DialogHeader>
          <DialogTitle className="text-left text-[18px] text-[#050215] sm:text-[24px]">
            New Community
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter the community details here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 sm:grid-cols-2"
        >
          <CustomInput
            label="Community Name"
            placeholder="Enter Text"
            type="text"
            error={errors.communityName?.message}
            {...register("communityName")}
          />

          <div>
            <CustomInput
              label="Community Username"
              placeholder="Enter Text"
              type="text"
              error={errors.communityUsername?.message}
              {...register("communityUsername", {
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
                <p className="text-left text-sm text-[#F31307]">
                  Username taken
                </p>
              )
            )}
          </div>

          <CustomInput
            label="Website"
            placeholder="Paste URL"
            prefix="https://"
            type="text"
            error={errors.websitePage?.message}
            {...register("websitePage")}
          />
          <CustomInput
            label="Github (Optional)"
            placeholder="Paste URL"
            prefix="https://"
            type="text"
            error={errors.githubPage?.message}
            {...register("githubPage")}
          />
          <CustomInput
            label="Twitter (Optional)"
            placeholder="Paste URL"
            prefix="https://"
            type="text"
            error={errors.twitterPage?.message}
            {...register("twitterPage")}
          />
          <CustomInput
            label="Instagram (Optional)"
            placeholder="Paste URL"
            prefix="https://"
            type="text"
            error={errors.instagramPage?.message}
            {...register("instagramPage")}
          />

          <Label className="flex flex-col items-start gap-2 text-base font-light text-[#09032A]">
            Community Description (Optional)
            <Textarea
              className="h-[96px] rounded-[12px] border-none bg-[#F7F9FD] px-4 text-base placeholder:text-base placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0"
              placeholder="What's the community about?"
              error={errors.communityDescription?.message}
              {...register("communityDescription")}
            />
          </Label>

          <Button
            disabled={
              createCommunityPending ||
              checkingUsername ||
              usernameAvailable === false
            }
            variant="secondary"
            size="lg"
            type="submit"
            className="mt-auto ml-auto w-fit"
          >
            {createCommunityPending ? "Processing" : "Proceed"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCommunityForm;
