import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services";
import { PiWarningCircle } from "react-icons/pi";

function GoogleCallback() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const hasHandled = useRef(false);
  const navigateRef = useRef(navigate);
  const loginRef = useRef(login);

  // Keep refs in sync without triggering effects
  useEffect(() => {
    navigateRef.current = navigate;
    loginRef.current = login;
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      loginRef.current({
        token: tokenFromUrl,
        email: null,
        user: null,
        otp: null,
        username: null,
        authMethod: "GOOGLE",
      });
    } else {
      toast.error("Authentication failed");
      navigateRef.current("/login", { replace: true });
    }
  }, []);

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["getUser"],
    queryFn: getUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!isSuccess || hasHandled.current) return;
    hasHandled.current = true;

    const user = data.data.content;

    if (!user.username) {
      loginRef.current({
        token,
        email: user.email,
        user: null,
        otp: "123456",
        username: null,
      });
      navigateRef.current("/get-started/username", { replace: true });
    } else if (!user.bio && !user.lastLogin) {
      loginRef.current({
        token,
        email: user.email,
        user: null,
        otp: null,
        username: user.username,
      });
      navigateRef.current("/get-started/account-configuration", {
        replace: true,
      });
    } else {
      loginRef.current({
        token,
        email: null,
        user,
        otp: null,
        username: null,
      });
      toast.success("Login successful");
      navigateRef.current("/", { replace: true });
    }
  }, [isSuccess, data, token]);

  if (isError) {
    return (
      <div className="flex w-full flex-col items-center justify-center text-center">
        <PiWarningCircle className="mb-3 text-[40px] text-red-500" />
        <p className="text-sm font-medium text-[#6D7A86]">
          Authentication failed
        </p>
        <p className="mt-1 text-xs text-[#1082E4]">
          An unexpected error occurred.
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
