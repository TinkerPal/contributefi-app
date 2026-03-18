import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaPlus, FaUserLarge, FaCheck } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router";
import { PiGithubLogoFill } from "react-icons/pi";
import { FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import {
  getItemFromSessionStorage,
  removeItemFromSessionStorage,
  setItemInSessionStorage,
} from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { linkedAccount, updateBio, uploadProfilePicture } from "@/services";
import { ImSpinner5 } from "react-icons/im";

const ACCOUNT_KEYS = {
  github: "Github",
  discord: "Discord",
  twitter: "X Account",
  telegram: "Telegram",
};
const ACCOUNTS_TO_LINK = [
  {
    title: "Github",
    key: "github",
    icon: <PiGithubLogoFill className="text-[27px]" />,
  },
  {
    title: "Discord",
    key: "discord",
    icon: <FaDiscord className="text-[27px] text-[#5865F2]" />,
  },
  {
    title: "X Account",
    key: "twitter",
    icon: <FaSquareXTwitter className="text-[27px]" />,
  },
  {
    title: "Telegram",
    key: "telegram",
    icon: <FaTelegram className="text-[27px] text-[#23B7EC]" />,
  },
];
function AccountConfiguration() {
  const { login, token, username } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    () => getItemFromSessionStorage("imageUrl") || null,
  );
  const [saving, setSaving] = useState(false);
  const [user] = useState(() => getItemFromSessionStorage("user"));
  const [linkingAccount, setLinkingAccount] = useState(null);
  const [telegramLinkStep, setTelegramLinkStep] = useState("idle");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [telegramOtp, setTelegramOtp] = useState("");
  const [telegramPendingId, setTelegramPendingId] = useState(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const { data: linkedAccountsData, isLoading: loadingAccounts } = useQuery({
    queryKey: ["linkedAccounts", token],
    queryFn: () => linkedAccount(),
    enabled: !!token,
  });

  const linkedAccounts = React.useMemo(() => {
    if (!linkedAccountsData?.data?.content) return [];
    const content = linkedAccountsData.data.content;
    if (Array.isArray(content)) {
      if (content.length > 0 && typeof content[0] === "string") {
        return content.map((acc) => ({
          provider: acc.toLowerCase(),
          username: null,
        }));
      }
      return content
        .map((acc) => ({
          provider: acc.provider?.toLowerCase(),
          username: acc.username || null,
        }))
        .filter((acc) => acc.provider);
    }
    if (content.linkedAccounts && Array.isArray(content.linkedAccounts)) {
      return content.linkedAccounts.map((acc) => ({
        provider: acc.toLowerCase(),
        username: null,
      }));
    }
    return [];
  }, [linkedAccountsData]);

  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username");
    }
  }, [navigate, username]);

  useEffect(() => {
    console.log("AccountConfiguration mounted with:", { error, message });

    if (error) {
      const errorMessage = message
        ? decodeURIComponent(message)
        : "An error occurred while linking your account";

      toast.error(errorMessage);

      navigate(".", { replace: true });
    }
  }, [error, message, navigate]);

  const handleLinkAccount = async (accountType) => {
    const userId = user?.id;
    console.log({ accountType, userId });

    if (accountType === "github") {
      setLinkingAccount("github");
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/github?userId=${userId}`;
    } else if (accountType === "discord") {
      setLinkingAccount("discord");
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/discord?userId=${userId}`;
    } else if (accountType === "twitter") {
      setLinkingAccount("twitter");
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/twitter?token=${token}`;
    } else if (accountType === "telegram") {
      setShowUsernameModal(true);
    }
  };

  const handleTelegramSubmitUsername = async () => {
    if (!telegramUsername.trim()) {
      toast.error("Please enter your Telegram username");
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
    if (!usernameRegex.test(telegramUsername.trim())) {
      toast.error(
        "Invalid username format. Use 5-32 characters, letters, numbers, and underscores only.",
      );
      return;
    }
    setLinkingAccount("telegram");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/telegram/init-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: telegramUsername.trim() }),
        },
      );
      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`;
        toast.error(errorMessage);
        setTelegramLinkStep("idle");
        setLinkingAccount(null);
        return;
      }
      if (data?.content?.pendingId) {
        setTelegramPendingId(data.content.pendingId);
        setTelegramLinkStep("waiting_start");
        setShowUsernameModal(false);
        setShowInstructionModal(true);
        setLinkingAccount(null);
      } else {
        toast.error(data?.message || "Unexpected response from server");
        setTelegramLinkStep("idle");
        setLinkingAccount(null);
      }
    } catch (error) {
      toast.error("Failed to initiate linking");
      setTelegramLinkStep("idle");
      setLinkingAccount(null);
    }
  };

  const handleTelegramVerifyOtp = async () => {
    if (!telegramOtp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }
    setLinkingAccount("telegram");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/telegram/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp: telegramOtp.trim() }),
        },
      );
      const data = await response.json();
      if (data?.content?.success) {
        toast.success("Telegram account linked successfully!");
        setTelegramLinkStep("idle");
        setTelegramUsername("");
        setTelegramOtp("");
        setTelegramPendingId(null);
        setLinkingAccount(null);
        setShowOtpModal(false);
        window.location.reload();
      } else {
        toast.error(data?.message || "Invalid or expired OTP");
        setLinkingAccount(null);
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
      setLinkingAccount(null);
    }
  };

  const handleTelegramCancel = () => {
    setTelegramLinkStep("idle");
    setTelegramUsername("");
    setTelegramOtp("");
    setTelegramPendingId(null);
    setLinkingAccount(null);
    setShowUsernameModal(false);
    setShowInstructionModal(false);
    setShowOtpModal(false);
  };
  const [bio, setBio] = useState(() => getItemFromSessionStorage("bio") || "");
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
      removeItemFromSessionStorage("bio");
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
      removeItemFromSessionStorage("bio");
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
            removeItemFromSessionStorage("bio");
          }}
          className={`absolute top-5 right-10 text-base font-medium text-[#2F0FD1] sm:top-10 ${(imageUrl || bio.trim().length > 0 || linkedAccounts.length > 0) && "hidden"} `}
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
            onChange={(e) => {
              setBio(e.target.value);
              setItemInSessionStorage("bio", e.target.value);
            }}
            value={bio}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ACCOUNTS_TO_LINK.map((account) => {
            const linkedAccount = linkedAccounts.find(
              (acc) => acc.provider === account.key,
            );
            const isLinked = !!linkedAccount;
            const isLinking = linkingAccount === account.key;
            const isTelegramLinking =
              account.key === "telegram" && telegramLinkStep !== "idle";
            return (
              <div
                key={account.title}
                className="rounded-[12px] bg-[#F7F9FD] px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {account.icon}
                    <span className="text-base font-normal text-[#09032A]">
                      {isLinked && linkedAccount?.username
                        ? `@${linkedAccount.username}`
                        : account.title}
                    </span>
                  </div>
                  {loadingAccounts || isLinking ? (
                    <ImSpinner5 className="animate-spin text-[#5865F2]" />
                  ) : isLinked ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleLinkAccount(account.key)}
                      className="text-[#5865F2]"
                    >
                      <FaPlus />
                    </button>
                  )}
                </div>
                {isTelegramLinking && (
                  <div className="mt-3 space-y-3 border-t border-gray-200 pt-3">
                    {telegramLinkStep === "entering_username" && (
                      <div className="space-y-2">
                        <p className="text-sm text-[#525866]">
                          Enter your Telegram username
                        </p>
                        <Input
                          placeholder="username"
                          value={telegramUsername}
                          onChange={(e) => setTelegramUsername(e.target.value)}
                          className="bg-white"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleTelegramSubmitUsername}
                            disabled={linkingAccount === "telegram"}
                          >
                            {linkingAccount === "telegram" ? (
                              <ImSpinner5 className="animate-spin" />
                            ) : (
                              "Continue"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleTelegramCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    {telegramLinkStep === "waiting_start" && (
                      <div className="space-y-2">
                        <p className="text-sm text-[#525866]">
                          Waiting for OTP. Make sure you messaged the bot.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setShowOtpModal(true)}
                          >
                            Enter OTP
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleTelegramCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div />
          <Button
            className="ml-auto w-full"
            disabled={
              uploading ||
              (!imageUrl &&
                bio.trim().length === 0 &&
                linkedAccounts.length === 0) ||
              saving
            }
            variant="secondary"
            size="lg"
            type="button"
            onClick={handleSaveDetails}
          >
            {saving ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>

      <Modal
        open={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        heading="Link Telegram Account"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Enter your Telegram username</p>
          <Input
            placeholder="username"
            value={telegramUsername}
            onChange={(e) => setTelegramUsername(e.target.value)}
            className="bg-white"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleTelegramSubmitUsername}
              disabled={linkingAccount === "telegram"}
            >
              {linkingAccount === "telegram" ? (
                <ImSpinner5 className="animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowUsernameModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        heading="Enter OTP"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the OTP code sent to your Telegram
          </p>
          <Input
            placeholder="123456"
            value={telegramOtp}
            onChange={(e) => setTelegramOtp(e.target.value)}
            className="bg-white"
            maxLength={6}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleTelegramVerifyOtp}
              disabled={linkingAccount === "telegram"}
            >
              {linkingAccount === "telegram" ? (
                <ImSpinner5 className="animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowOtpModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showInstructionModal}
        onClose={() => setShowInstructionModal(false)}
        heading="Link Telegram Account"
      >
        <div className="space-y-4">
          <div className="space-y-2 text-sm text-gray-600">
            <p>Follow these steps to link your Telegram account:</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>
                Go to Telegram and open the{" "}
                <a
                  href="https://t.me/contributefi_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#2F0FD1] hover:underline"
                >
                  ContributeFi bot
                </a>
              </li>
              <li>Press /start</li>
              <li>You will receive an OTP code</li>
            </ol>
          </div>
          <p className="text-sm font-medium text-[#2F0FD1]">
            Waiting for OTP...
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setShowOtpModal(true)}>Enter OTP</Button>
            <Button variant="outline" onClick={handleTelegramCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default AccountConfiguration;
