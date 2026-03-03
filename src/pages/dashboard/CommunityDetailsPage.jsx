import { FaLink } from "react-icons/fa6";
import { RiTwitterXFill } from "react-icons/ri";
import { RiInstagramFill } from "react-icons/ri";
import { LuGithub } from "react-icons/lu";
import BackButton from "@/components/BackButton";
import { COMMUNITIES_DETAILS, COMMUNITIES_TAG } from "@/lib/constants";
import TasksCard from "@/components/TasksCard";
import NewQuest from "@/components/dashboard/NewQuest";
import QuestSuccess from "@/components/dashboard/QuestSuccess";
import Empty from "@/components/Empty";
import { Fragment, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCommunity,
  getQuestsByCommunity,
  joinCommunity,
  leaveCommunity,
} from "@/services";
import { useNavigate, useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { Button } from "@/components/ui/button";
import CustomSearch from "@/components/Search";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";
import CustomPagination from "@/components/CustomPagination";
import { ImSpinner5 } from "react-icons/im";

function CommunityDetailsPage() {
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [openQuestSuccess, setOpenQuestSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { communityAlias: communityId } = useParams();
  const { user, isAuthenticated } = useAuth();

  const {
    data: community,
    isLoading: loadingCommunity,
    isError: errorLoadingCommunity,
  } = useQuery({
    queryKey: ["community", communityId],
    queryFn: () => getCommunity(communityId),
    enabled: !!communityId,
  });

  const LIMIT = 10;
  const questOffset = (currentPage - 1) * LIMIT;

  const {
    data: questData,
    isLoading: loadingQuests,
    isError: errorLoadingQuests,
    refetch,
  } = useQuery({
    queryKey: ["quests", community?.id, LIMIT, currentPage],
    queryFn: () =>
      getQuestsByCommunity({
        limit: LIMIT,
        offset: questOffset,
        communityId: community.id,
      }),
    enabled: !!community?.id,
  });

  const quests = questData?.data ?? [];
  const questTotalPages = questData?.totalPages ?? 1;

  const [detailView, setDetailView] = useState("tasks");

  const handleChangeDetailView = (view) => {
    setDetailView(view);
  };

  const { mutate: joinCommunityMutation, isPending: joinCommunityPending } =
    useMutation({
      mutationFn: () => joinCommunity(community.id),
      onMutate: async () => {
        await queryClient.cancelQueries(["community", communityId]);

        const previousCommunity = queryClient.getQueryData([
          "community",
          communityId,
        ]);

        queryClient.setQueryData(["community", communityId], (old) => ({
          ...old,
          isMember: true,
          totalMembers: (old?.totalMembers ?? 0) + 1,
        }));

        return { previousCommunity };
      },

      onError: (error, _, context) => {
        // Rollback on error
        queryClient.setQueryData(
          ["community", communityId],
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

  const handleJoinCommunity = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    joinCommunityMutation(communityId);
  };

  const { mutate: leaveCommunityMutation, isPending: leaveCommunityPending } =
    useMutation({
      mutationFn: () => leaveCommunity(community.id, user?.id),
      onMutate: async () => {
        await queryClient.cancelQueries(["community", communityId]);
        const previousCommunity = queryClient.getQueryData([
          "community",
          communityId,
        ]);

        queryClient.setQueryData(["community", communityId], (old) => ({
          ...old,
          isMember: false,
          totalMembers: Math.max((old?.totalMembers ?? 1) - 1, 0),
        }));

        return { previousCommunity };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(
          ["community", communityId],
          context.previousCommunity,
        );
        toast.error(
          error?.response?.data?.message || "Failed to leave community",
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["community", communityId]);
      },
      onSuccess: (data) => {
        if (data.status === 201) {
          toast.success("Successfully left the community");
        } else {
          toast.error("Something went wrong");
        }
      },
    });

  const handleLeaveCommunity = () => {
    leaveCommunityMutation(communityId);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
    refetch();
  };

  return (
    <>
      <div className="space-y-6">
        <QuestSuccess
          openQuestSuccess={openQuestSuccess}
          setOpenQuestSuccess={setOpenQuestSuccess}
        />
        <div className="md:hidden">
          <BackButton />
        </div>

        {loadingCommunity ? (
          <Loader />
        ) : errorLoadingCommunity ? (
          <Error title="Failed to load community details." />
        ) : (
          <>
            <div className="relative space-y-20 lg:space-y-25">
              <div
                className={`relative h-[180px] rounded-[4px] ${community?.coverImageUrl ? `bg-[url(${community?.coverImageUrl})]` : "bg-[url(/Mask-group.svg)]"} bg-cover bg-center bg-no-repeat lg:h-[229px]`}
              >
                {/* <Label
                  htmlFor="image"
                  className="absolute right-0 bottom-0 flex h-[80px] w-[80px] shrink-0 cursor-pointer items-center justify-center rounded-full"
                >
                  <Input
                    onChange={handleImageSelect}
                    type="file"
                    id="image"
                    className="hidden"
                    disabled={
                      uploading ||
                      !user ||
                      user.id !== community?.communityOwnerId
                    }
                  />
                  <div className="absolute right-0 bottom-0 rounded-full bg-[#F7F9FD] p-2">
                    {uploading ? (
                      <ImSpinner5 className="animate-spin" />
                    ) : (
                      <FaPlus className="text-[#2F0FD1]" />
                    )}
                  </div>
                </Label> */}
                <div className="absolute -bottom-1/3 left-1/2 h-[118px] w-[118px] -translate-x-1/2 rounded-full bg-white p-2 lg:left-10 lg:h-[140px] lg:w-[140px] lg:translate-x-0">
                  <div className="h-full rounded-full bg-[#F2F2F7] p-5">
                    {community?.logoUrl ? (
                      <img src={community?.logoUrl} alt="" />
                    ) : (
                      <img src="/ChartPolar (1).svg" alt="" />
                    )}
                  </div>

                  {/* <Label
                    htmlFor="image"
                    className="absolute right-7 bottom-10 flex h-[80px] w-[80px] shrink-0 cursor-pointer items-center justify-center rounded-full"
                  >
                    <Input
                      onChange={handleImageSelect}
                      type="file"
                      id="image"
                      className="hidden"
                      disabled={
                        uploading ||
                        !user ||
                        user.id !== community?.communityOwnerId
                      }
                    />
                    <div className="absolute right-0 bottom-0 rounded-full bg-[#F7F9FD] p-2">
                      {uploading ? (
                        <ImSpinner5 className="animate-spin" />
                      ) : (
                        <FaPlus className="text-[#2F0FD1]" />
                      )}
                    </div>
                  </Label> */}
                </div>
              </div>

              <div
                className={`flex flex-col justify-between gap-5 xl:flex-row`}
              >
                <div className="space-y-3 xl:space-y-4">
                  <h2 className="text-[20px] font-semibold text-[#050215] md:text-[24px]">
                    {community?.communityName}
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {COMMUNITIES_TAG.map((community, index) => (
                      <div
                        className="rounded-[4px] bg-[#E2F1FE] px-2 py-1 text-[14px] text-[#1082E4]"
                        key={index}
                      >
                        {community}
                      </div>
                    ))}
                  </div>
                  <p className="font-normal text-[#09032A] md:text-[18px]">
                    {community?.communityDescription
                      ? community?.communityDescription
                      : "..."}
                  </p>
                </div>

                <div
                  className={`top-[42%] right-0 flex flex-wrap items-center justify-between gap-2 xl:absolute xl:top-[53%] xl:w-1/2`}
                >
                  <div className="flex flex-wrap gap-2">
                    {community?.communityLinks.map((link, i) => {
                      return (
                        <Fragment key={i}>
                          {link.title === "Website" && (
                            <div className="bg-white p-2">
                              <a href={link.url} target="_blank">
                                <FaLink className="rounded-[4px] text-[24px] text-[#777F90]" />
                              </a>
                            </div>
                          )}

                          {link.title === "GitHub" && (
                            <div className="bg-white p-2">
                              <a href={link.url} target="_blank">
                                <RiTwitterXFill className="rounded-[4px] text-[24px] text-[#777F90]" />
                              </a>
                            </div>
                          )}

                          {link.title === "Twitter" && (
                            <div className="bg-white p-2">
                              <a href={link.url} target="_blank">
                                <RiInstagramFill className="rounded-[4px] text-[24px] text-[#777F90]" />
                              </a>
                            </div>
                          )}

                          {link.title === "Instagram" && (
                            <div className="bg-white p-2">
                              <a href={link.url} target="_blank">
                                <LuGithub className="rounded-[4px] text-[24px] text-[#777F90]" />
                              </a>
                            </div>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>

                  {user?.id === community?.communityOwnerId ? (
                    <div className="flex flex-wrap gap-3.5">
                      <Button className="cursor-pointer rounded-md bg-[#FFFFFF] px-8 py-5 text-[#2F0FD1] hover:bg-[#FFFFFF]/50">
                        Edit Details
                      </Button>

                      <NewQuest
                        sheetIsOpen={sheetIsOpen}
                        setSheetIsOpen={setSheetIsOpen}
                        setOpenQuestSuccess={setOpenQuestSuccess}
                        communityId={community.id}
                      />
                    </div>
                  ) : (
                    <Button
                      onClick={
                        community?.isMember
                          ? handleLeaveCommunity
                          : handleJoinCommunity
                      }
                      disabled={joinCommunityPending || leaveCommunityPending}
                      className={`cursor-pointer rounded-md ${
                        community?.isMember
                          ? "bg-[#FCE9E9] text-[#F31307] hover:bg-[#FCE9E9]/70"
                          : "bg-[#2F0FD1] hover:bg-[#2F0FD1]/70"
                      } px-8 py-5`}
                    >
                      {joinCommunityPending || leaveCommunityPending ? (
                        <ImSpinner5 className="animate-spin" />
                      ) : community?.isMember ? (
                        "Leave"
                      ) : (
                        "Join"
                      )}
                    </Button>
                  )}
                </div>

                <div className="rounded-[4px] bg-white px-5 py-4 xl:w-1/2 xl:self-end">
                  <div className="grid grid-cols-2 divide-x divide-y divide-[#F0F4FD] lg:grid-cols-4 lg:divide-y-0">
                    {COMMUNITIES_DETAILS.map((com, index) => {
                      const disableRightLine = index === 1;
                      const disableTopLine = index === 2;
                      const isLastItem =
                        index === COMMUNITIES_DETAILS.length - 1;

                      return (
                        <div
                          key={index}
                          className={`space-y-1.5 px-4 py-3 lg:items-start ${disableRightLine ? "border-r-0" : ""} ${disableTopLine ? "border-b-0" : ""} border-[#F0F4FD] ${!isLastItem ? "lg:border-r" : ""}`}
                        >
                          <div className="text-[14px] font-normal text-[#525866]">
                            {com.title}
                          </div>
                          <div className="font-semibold text-[#09032A]">
                            {com.title === "Members"
                              ? (community?.totalMembers ?? 0)
                              : com.title === "Total Tasks"
                                ? (community?.totalTasks ?? 0)
                                : com.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[4px] p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="w-full xl:order-2 xl:w-fit">
                  <CustomSearch placeholder="Search task" />
                </div>

                <div className="flex w-full flex-1 shrink-0 gap-4 rounded-[8px] bg-[#F7F9FD] p-2 xl:w-1/2">
                  <Button
                    onClick={() => handleChangeDetailView("tasks")}
                    variant="outline"
                    className={`flex-1 cursor-pointer rounded-[2px] border-none ${detailView === "tasks" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
                  >
                    Tasks
                  </Button>

                  <Button
                    onClick={() => handleChangeDetailView("forum")}
                    variant="outline"
                    className={`flex-1 cursor-pointer rounded-[2px] border-none ${detailView === "forum" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
                  >
                    Forum
                  </Button>

                  <Button
                    onClick={() => handleChangeDetailView("leader-board")}
                    variant="outline"
                    className={`flex-1 cursor-pointer rounded-[2px] border-none ${detailView === "leader-board" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
                  >
                    Leader Board
                  </Button>
                </div>

                <div className="flex gap-4 xl:order-3">
                  <Filter />
                  <Sort order={sortOrder} onToggle={handleSort} />
                </div>
              </div>

              {loadingQuests ? (
                <Loader />
              ) : errorLoadingQuests ? (
                <Error title="Failed to load quests..." />
              ) : quests.length === 0 ? (
                <Empty title="No quests found..." />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {quests.map((quest, i) => (
                      <TasksCard task={quest} key={i} tag="task-page" />
                    ))}
                  </div>

                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={questTotalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CommunityDetailsPage;
