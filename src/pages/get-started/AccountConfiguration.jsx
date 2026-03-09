import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { FaPlus, FaUserLarge, FaCheck } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router";
import { PiGithubLogoFill } from "react-icons/pi";
import { FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  getItemFromLocalStorage,
  getItemFromSessionStorage,
  removeItemFromSessionStorage,
  setItemInSessionStorage,
} from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { updateBio, uploadProfilePicture } from "@/services";
import { ImSpinner5 } from "react-icons/im";

const ACCOUNTS_TO_LINK = [
  {
    title: "Github",
    icon: <PiGithubLogoFill className="text-[27px]" />,
  },
  {
    title: "Discord",
    icon: <FaDiscord className="text-[27px] text-[#5865F2]" />,
  },
  {
    title: "X Account",
    icon: <FaSquareXTwitter className="text-[27px]" />,
  },
  {
    title: "Telegram",
    icon: <FaTelegram className="text-[27px] text-[#23B7EC]" />,
  },
];

function AccountConfiguration() {
  const { login, token, username } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    () => getItemFromSessionStorage("imageUrl") || null,
  );
  const [saving, setSaving] = useState(false);
  const [user] = useState(() => getItemFromSessionStorage("user"));
  const [linkingAccount, setLinkingAccount] = useState(null);
  const [linkedAccount, setLinkedAccount] = useState(null);

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username");
    }
  }, [navigate, username]);

  useEffect(() => {
    const linked = searchParams.get("linked");
    if (linked === "github") {
      setLinkedAccount("github");
      toast.success("GitHub account linked successfully");
      navigate("/get-started/account-configuration", { replace: true });
    } else if (linked === "discord") {
      setLinkedAccount("discord");
      toast.success("Discord account linked successfully");
      navigate("/get-started/account-configuration", { replace: true });
    }

    const error = searchParams.get("error");
    if (error) {
      toast.error(`Failed to link account: ${error}`);
      navigate("/get-started/account-configuration", { replace: true });
    }
  }, [searchParams, navigate]);

  const handleLinkAccount = async (accountType) => {
    if (accountType === "github") {
      setLinkingAccount("github");
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/github`;
    } else if (accountType === "discord") {
      setLinkingAccount("discord");
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/discord`;
    }
  };

  const [bio, setBio] = useState("");

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (uploading) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const response = await uploadProfilePicture(file);

      if (response?.data?.content?.profileImageUrl) {
        setImageUrl(response.data.content.profileImageUrl);
        setItemInSessionStorage(
          "imageUrl",
          response.data.content.profileImageUrl,
        );
        toast.success("Profile picture updated");
      } else {
        toast.error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to upload profile picture",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();

    if (!bio) {
      navigate("/");
      login({
        token,
        email: null,
        user: {
          ...user,
          ...(imageUrl && { profileImageUrl: imageUrl }),
        },
        otp: null,
        username: null,
      });
      removeItemFromSessionStorage("user");
      removeItemFromSessionStorage("imageUrl");
    } else {
      setSaving(true);
      try {
        const res = await updateBio(bio);

        if (res?.data?.content?.bio) {
          toast.success("Bio updated successfully");
        } else {
          toast.error("Failed to save bio");
          setSaving(false);
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to save bio");
        return;
      } finally {
        setSaving(false);
      }

      navigate("/");
      login({
        token,
        email: null,
        user: {
          ...user,
          ...(imageUrl && { profileImageUrl: imageUrl }),
          bio,
        },
        otp: null,
        username: null,
      });
      removeItemFromSessionStorage("user");
      removeItemFromSessionStorage("imageUrl");
    }
  };

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Account Configuration
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Connect your other profiles for maximum access to tasks and engagement
        </p>
        <Link
          to="/"
          onClick={() => {
            login({
              token,
              email: null,
              user: {
                ...user,
                ...(imageUrl && { profileImageUrl: imageUrl }),
              },
              otp: null,
              username: null,
            });
            removeItemFromSessionStorage("user");
            removeItemFromSessionStorage("imageUrl");
          }}
          className="absolute top-5 right-10 text-base font-medium text-[#2F0FD1] sm:top-10"
        >
          Skip till Later &gt;&gt;
        </Link>
      </div>

      <div className="space-y-[40px]">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Label
            htmlFor="image"
            className="relative flex h-[80px] w-[80px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F7F9FD]"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Selected avatar"
                className="h-[50px] w-[50px] rounded-full"
              />
            ) : (
              <FaUserLarge className="text-[40px] text-[#B2B9C7]" />
            )}
            <Input
              onChange={handleImageSelect}
              type="file"
              id="image"
              className="hidden"
              disabled={uploading}
            />
            <div className="absolute right-0 bottom-0 rounded-full bg-[#F7F9FD] p-2">
              {uploading ? (
                <ImSpinner5 className="animate-spin" />
              ) : (
                <FaPlus className="text-[#2F0FD1]" />
              )}
            </div>
          </Label>
          <Textarea
            className="h-[80px] rounded-[12px] border-none bg-[#F7F9FD] px-4 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0"
            placeholder="Briefly tell us about you"
            onChange={(e) => setBio(e.target.value)}
            value={bio}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ACCOUNTS_TO_LINK.map((account) => {
            const accountKey = account.title.toLowerCase().replace(" ", "");
            const isLinked = linkedAccount === accountKey;
            const isLinking = linkingAccount === accountKey;

            return (
              <button
                key={account.title}
                type="button"
                disabled={isLinking || isLinked}
                onClick={() => handleLinkAccount(accountKey)}
                className="flex items-center justify-between rounded-[12px] bg-[#F7F9FD] px-4 py-3 disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  {account.icon}
                  <span className="text-base font-normal text-[#09032A]">
                    {account.title}
                  </span>
                </div>

                {isLinking ? (
                  <ImSpinner5 className="animate-spin text-[#5865F2]" />
                ) : isLinked ? (
                  <FaCheck className="text-green-500" />
                ) : (
                  <FaPlus className="text-[#5865F2]" />
                )}
              </button>
            );
          })}

          <div />

          <Button
            className="ml-auto w-full"
            disabled={
              uploading || (!imageUrl && bio.trim().length === 0) || saving
            }
            variant="secondary"
            size="lg"
            type="button"
            onClick={handleSaveDetails}
          >
            {saving ? "Saving..." : "Save Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AccountConfiguration;
