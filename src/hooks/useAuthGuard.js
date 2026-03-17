import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import { useSelector } from "react-redux";

export const useAuthGuard = (currentPath) => {
  const navigate = useNavigate();
  const { token, email, otp, username, authMethod, user } = useAuth();
  const { publicKey } = useSelector((state) => state.wallet);

  const hasWallet = !!publicKey;

  useEffect(() => {
    if (!token) {
      navigate("/get-started", { replace: true });
      return;
    }

    switch (currentPath) {
      case "/get-started": {
        if (username) {
          if (authMethod === "WALLET") {
            if (!email) {
              navigate("/get-started/bind-email", { replace: true });
            } else if (!hasWallet) {
              navigate("/get-started/create-wallet", { replace: true });
            } else if (!user?.bio) {
              navigate("/get-started/account-configuration", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          } else {
            if (!email) {
              navigate("/get-started/bind-email", { replace: true });
            } else if (!otp) {
              navigate("/get-started/verify-email", { replace: true });
            } else if (!hasWallet) {
              navigate("/get-started/create-wallet", { replace: true });
            } else if (!user?.bio) {
              navigate("/get-started/account-configuration", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }
        }
        break;
      }

      case "/get-started/verify-email": {
        if (!email) {
          navigate("/get-started", { replace: true });
        } else if (otp) {
          if (authMethod === "WALLET" && !email) {
            navigate("/get-started/bind-email", { replace: true });
          } else if (!username) {
            navigate("/get-started/username", { replace: true });
          } else if (!hasWallet) {
            navigate("/get-started/create-wallet", { replace: true });
          } else if (!user?.bio) {
            navigate("/get-started/account-configuration", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
        break;
      }

      case "/get-started/username": {
        if (username) {
          if (authMethod === "WALLET") {
            if (!email) {
              navigate("/get-started/bind-email", { replace: true });
            } else if (!hasWallet) {
              navigate("/get-started/create-wallet", { replace: true });
            } else if (!user?.bio) {
              navigate("/get-started/account-configuration", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          } else {
            if (!email) {
              navigate("/get-started/bind-email", { replace: true });
            } else if (!otp) {
              navigate("/get-started/verify-email", { replace: true });
            } else if (!hasWallet) {
              navigate("/get-started/create-wallet", { replace: true });
            } else if (!user?.bio) {
              navigate("/get-started/account-configuration", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }
        }
        break;
      }

      case "/get-started/bind-email": {
        if (!username) {
          navigate("/get-started/username", { replace: true });
        } else if (email) {
          if (authMethod === "WALLET") {
            if (!hasWallet) {
              navigate("/get-started/create-wallet", { replace: true });
            } else if (!user?.bio) {
              navigate("/get-started/account-configuration", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          } else {
            if (!otp) {
              navigate("/get-started/verify-email", { replace: true });
            } else if (!hasWallet) {
              navigate("/get-started/create-wallet", { replace: true });
            } else if (!user?.bio) {
              navigate("/get-started/account-configuration", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }
        }
        break;
      }

      case "/get-started/create-wallet": {
        if (!username) {
          navigate("/get-started/username", { replace: true });
        } else if (!email) {
          navigate("/get-started/bind-email", { replace: true });
        } else if (authMethod === "WALLET" || hasWallet) {
          if (!user?.bio) {
            navigate("/get-started/account-configuration", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
        break;
      }

      case "/get-started/account-configuration": {
        if (!username) {
          navigate("/get-started/username", { replace: true });
        } else if (user?.bio) {
          navigate("/", { replace: true });
        }
        break;
      }

      default:
        break;
    }
  }, [
    currentPath,
    token,
    email,
    otp,
    username,
    authMethod,
    user,
    hasWallet,
    navigate,
  ]);

  return {
    token,
    email,
    otp,
    username,
    authMethod,
    hasWallet,
  };
};
