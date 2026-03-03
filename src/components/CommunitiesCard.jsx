import { useAuth } from "@/hooks/useAuth";
import { COMMUNITY_TAG_BG } from "@/lib/constants";
import { getCommunity, joinCommunity, leaveCommunity } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImSpinner5 } from "react-icons/im";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

function CommunitiesCard({ community }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const handleOpen = () => {
    navigate(`/communities/${encodeURIComponent(community.communityAlias)}`, {
      replace: false,
    });
  };

  const { data } = useQuery({
    queryKey: ["community", community.id],
    queryFn: () => getCommunity(community.id),
    enabled: isAuthenticated && !!community.id,
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 0,
  });

  const { mutate: joinCommunityMutation, isPending: joinCommunityPending } =
    useMutation({
      mutationFn: () => joinCommunity(community.id),
      onMutate: async () => {
        await queryClient.cancelQueries(["community", community.id]);

        const previousCommunity = queryClient.getQueryData([
          "community",
          community.id,
        ]);

        queryClient.setQueryData(["community", community.id], (old) => ({
          ...old,
          isMember: true,
          totalMembers: (old?.totalMembers ?? 0) + 1,
        }));

        return { previousCommunity };
      },

      onError: (error, _, context) => {
        // Rollback on error
        queryClient.setQueryData(
          ["community", community.id],
          context.previousCommunity,
        );
        toast.error(
          error?.response?.data?.message || "Failed to join community",
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["community", community.id]);
      },
      onSuccess: (data) => {
        if (data.status === 201) {
          toast.success("Community joined successfully");
        } else {
          toast.error("Something went wrong");
        }
      },
    });

  const handleJoinCommunity = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    joinCommunityMutation(community.id);
  };

  const { mutate: leaveCommunityMutation, isPending: leaveCommunityPending } =
    useMutation({
      mutationFn: () => leaveCommunity(community.id, user?.id),
      onMutate: async () => {
        await queryClient.cancelQueries(["community", community.id]);
        const previousCommunity = queryClient.getQueryData([
          "community",
          community.id,
        ]);

        queryClient.setQueryData(["community", community.id], (old) => ({
          ...old,
          isMember: false,
          totalMembers: Math.max((old?.totalMembers ?? 1) - 1, 0),
        }));

        return { previousCommunity };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(
          ["community", community.id],
          context.previousCommunity,
        );
        toast.error(
          error?.response?.data?.message || "Failed to leave community",
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["community", community.id]);
      },
      onSuccess: (data) => {
        if (data.status === 201) {
          toast.success("Successfully left the community");
        } else {
          toast.error("Something went wrong");
        }
      },
    });

  const handleLeaveCommunity = (e) => {
    e.stopPropagation();
    leaveCommunityMutation(community.id);
  };

  return (
    <div
      onClick={handleOpen}
      className={`flex cursor-pointer flex-col justify-center gap-8 rounded-[8px] border-2 border-[#F0F4FD] bg-white px-[24px] py-[28px]`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {community?.logoUrl ? (
              <img src={community?.logoUrl} alt="" />
            ) : (
              <img src="/ChartPolar.svg" alt="" />
            )}

            <div className="space-y-1">
              <p className="font-semibold text-[#050215]">
                {community?.communityName}
              </p>

              <p className="flex gap-1 text-[14px] text-[#2F0FD1]">
                <img src="/UsersThree (1).svg" alt="" />{" "}
                <span className="shrink-0">
                  {community?.members > 1
                    ? `${community?.members} members`
                    : `${community?.members} member`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* {community?.tag.map((t, i) => (
              <div
                className={`rounded-[4px] px-[12px] py-[5px] text-sm font-normal text-[#313131] ${COMMUNITY_TAG_BG[t]}`}
                key={i}
              >
                {t}
              </div>
            ))} */}
          </div>
        </div>

        <p className="text-sm font-light text-[#050215]">
          {community?.communityDescription}
        </p>
      </div>

      <div className="flex items-end justify-between rounded-[4px] border-[0.5px] border-[#F0F4FD] bg-[#F7F9FD] p-4">
        <div className="space-y-2 text-sm font-normal text-[#525866]">
          <div className="flex gap-1.5">
            <img src="/Briefcase.svg" alt="" />
            <span> {community?.newTasks} new tasks</span>
          </div>
          <div className="flex gap-1.5">
            <img src="/Coins.svg" alt="" />
            <span>{community?.totalSpent ?? 0} tokens spent</span>
          </div>
        </div>

        <button
          disabled={joinCommunityPending || leaveCommunityPending}
          onClick={data?.isMember ? handleLeaveCommunity : handleJoinCommunity}
          className={`cursor-pointer font-medium ${data?.isMember ? "text-[#F31307]" : "text-[#2F0FD1]"} disabled:cursor-not-allowed`}
        >
          {community?.communityOwnerId === user?.id ? (
            ""
          ) : joinCommunityPending || leaveCommunityPending ? (
            <ImSpinner5 className="animate-spin" />
          ) : data?.isMember ? (
            "Leave"
          ) : (
            "+ Join"
          )}
        </button>
      </div>
    </div>
  );
}

export default CommunitiesCard;
