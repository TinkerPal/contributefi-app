import DashboardLayoutContainer from "./DashboardLayoutContainer";
import DashboardMobileHeader from "./DashboardMobileHeader";
import MobileNavigation from "../MobileNavigation";
import DashboardNavigation from "./DashboardNavigation";
import { useState } from "react";
import DashboardSidebarContainer from "./DashboardSidebarContainer";
import DashboardDesktopHeader from "./DashboardDesktopHeader";
import { Outlet, useLocation, useParams } from "react-router";
import DashboardContainer from "./DashboardContainer";
import BackButton from "../BackButton";
import CustomSearch from "../Search";
import Heading from "./Heading";
import CreateCommunityForm from "../CreateCommunityForm";
import DashboardLogo from "./DashboardLogo";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "../ui/label";
import { setItemInLocalStorage } from "@/lib/utils";
import { uploadProfilePicture } from "@/services";
import { toast } from "react-toastify";
import { FaUserLarge } from "react-icons/fa6";
import { Input } from "../ui/input";
import { FaPlus } from "react-icons/fa";
import { ImSpinner5 } from "react-icons/im";
import ScrollToTop from "../ScrollToTop";

function DashboardLayout() {
  const { user, isAuthenticated, setUser } = useAuth();

  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPath = pathSegments[pathSegments.length - 1];

  const { communityAlias: communityId } = useParams();
  const { taskId } = useParams();

  const [uploading, setUploading] = useState(false);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        setUser((prevUser) => {
          const updatedUser = {
            ...prevUser,
            profileImageUrl: response.data.content.profileImageUrl,
          };
          setItemInLocalStorage("user", updatedUser);
          return updatedUser;
        });
      } else {
        toast.error("Failed to upload profile picture");
        return;
      }

      toast.success("Profile picture updated");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to upload profile picture",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayoutContainer>
      <ScrollToTop />
      <DashboardMobileHeader>
        <MobileNavigation
          side="left"
          sheetIsOpen={sheetIsOpen}
          setSheetIsOpen={setSheetIsOpen}
          tag="dashboard"
        >
          <DashboardNavigation
            setSheetIsOpen={setSheetIsOpen}
            platform="mobile"
          />
        </MobileNavigation>

        <DashboardLogo />

        {isAuthenticated && (
          <>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Label
                htmlFor="image"
                className="relative flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F7F9FD]"
              >
                {user?.profileImageUrl ? (
                  <img
                    src={user?.profileImageUrl}
                    alt="Selected avatar"
                    height={40}
                    width={40}
                    className="h-[40px] w-[40px] rounded-full"
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

                <div className="absolute right-0 bottom-0 rounded-full bg-[#F7F9FD] p-1 shadow">
                  {uploading ? (
                    <ImSpinner5 className="animate-spin" />
                  ) : (
                    <FaPlus className="text-[#2F0FD1]" />
                  )}
                </div>
              </Label>
            </div>
          </>
        )}
      </DashboardMobileHeader>

      <DashboardSidebarContainer>
        <div className="h-[70px] border-b border-gray-300 bg-white py-4 text-center">
          <DashboardLogo />
        </div>

        <DashboardNavigation
          setSheetIsOpen={setSheetIsOpen}
          platform="desktop"
        />
      </DashboardSidebarContainer>

      <DashboardDesktopHeader>
        {communityId || taskId ? <BackButton /> : <Heading />}

        <div className="flex items-center gap-4">
          {currentPath === "communities" && !communityId && (
            <div className="hidden items-center gap-3 lg:flex lg:flex-row">
              <div>
                <CustomSearch placeholder="Search community" />
              </div>

              <div>
                <CreateCommunityForm />
              </div>
            </div>
          )}

          {currentPath === "tasks" && !taskId && (
            <div className="hidden items-center gap-3 lg:flex lg:flex-row">
              <div>
                <CustomSearch placeholder="Search task" />
              </div>
            </div>
          )}

          {isAuthenticated && (
            <>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Label
                  htmlFor="image"
                  className="relative flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F7F9FD]"
                >
                  {user?.profileImageUrl ? (
                    <img
                      src={user?.profileImageUrl}
                      alt="Selected avatar"
                      height={40}
                      width={40}
                      className="h-[40px] w-[40px] rounded-full"
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

                  <div className="absolute right-0 bottom-0 rounded-full bg-[#F7F9FD] p-1 shadow">
                    {uploading ? (
                      <ImSpinner5 className="animate-spin" />
                    ) : (
                      <FaPlus className="text-[#2F0FD1]" />
                    )}
                  </div>
                </Label>
              </div>
            </>
          )}
        </div>
      </DashboardDesktopHeader>

      <DashboardContainer>
        <Outlet />
      </DashboardContainer>
    </DashboardLayoutContainer>
  );
}

export default DashboardLayout;
