import { useAuth } from "@/hooks/useAuth";
import { setItemInLocalStorage } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services";
import { PiWarningCircle } from "react-icons/pi";

function GoogleCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      setItemInLocalStorage("accessToken", tokenFromUrl);
      setToken(tokenFromUrl);
    }
  }, []);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(),
    enabled: !!token,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const user = data.data.content;

      if (!user.username) {
        login({
          token: token,
          email: user.email,
          user: null,
          otp: "123456",
          username: user.username,
        });
        toast.error("Kindly select a username");
        navigate("/get-started/username", { replace: true });
      } else if (!user.bio && !user.lastLogin) {
        login({
          token: token,
          email: user.email,
          user: null,
          otp: "123456",
          username: user.username,
        });
        navigate("/get-started/account-configuration", { replace: true });
      } else {
        login({
          token: token,
          email: null,
          user: user,
          otp: null,
          username: null,
        });
        navigate("/", { replace: true });
        toast.success("Login successful");
      }
    }
  }, [isSuccess, data, login, navigate, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full flex-col items-center justify-center text-center">
        <PiWarningCircle className="mb-3 text-[40px] text-red-500" />
        <p className="text-sm font-medium text-[#6D7A86]">
          Authentication failed
        </p>
        <p className="mt-1 text-xs text-[#1082E4]">
          {"An unexpected error occurred."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
    </div>
  );
}

export default GoogleCallback;
