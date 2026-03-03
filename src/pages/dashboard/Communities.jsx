import CommunitiesCard from "@/components/CommunitiesCard";
import CustomPagination from "@/components/CustomPagination";
import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { COMMUNITIES_OVERVIEW } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import Heading from "@/components/dashboard/Heading";
import MetricsContainer from "@/components/dashboard/MetricsContainer";
import MetricCard from "@/components/dashboard/MetricCard";
import CustomSearch from "@/components/Search";
import Sort from "@/components/Sort";
import CreateCommunityForm from "@/components/CreateCommunityForm";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { useAuth } from "@/hooks/useAuth";

import {
  useGetCommunities,
  useGetMemberCommunities,
} from "@/hooks/useGetCommunities";
import { useNavigate, useLocation } from "react-router";

function Communities() {
  const location = useLocation();
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [communityView, setCommunityView] = useState("all");
  const { user, isAuthenticated } = useAuth();
  const [communityOwnerId, setCommunityOwnerId] = useState("");
  const [displayedCommunities, setDisplayedCommunities] = useState([]);

  const navigate = useNavigate();

  const LIMIT = 10;
  const OFFSET = currentPage;

  const {
    communities,
    loadingCommunities,
    errorLoadingCommunities,
    totalPages: totalCommunityPages,
    refetch,
  } = useGetCommunities(LIMIT, OFFSET, sortOrder, communityOwnerId);

  const {
    memberCommunities,
    loadingMemberCommunities,
    errorLoadingMemberCommunities,
    totalPages: totalMemberCommunitiesPages,
  } = useGetMemberCommunities(LIMIT, OFFSET, communityView);

  useEffect(() => {
    if (communityView === "all" || communityView === "created") {
      setDisplayedCommunities(communities);
    }
  }, [communities, communityView]);

  useEffect(() => {
    if (communityView === "joined") {
      setDisplayedCommunities(memberCommunities);
    }
  }, [memberCommunities, communityView]);

  const handleChangeCommunityView = (view) => {
    if (!isAuthenticated && (view === "created" || view === "joined")) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setCommunityView(view);

    if (view === "created") {
      setCommunityOwnerId(user.id);
      refetch();
      return;
    }

    if (view === "joined") {
      setCommunityOwnerId("");
      return;
    }

    if (view === "all") {
      setCommunityOwnerId("");
      refetch();
      return;
    }
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
    refetch();
  };

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="md:hidden">
            <Heading />
          </div>

          <MetricsContainer>
            {COMMUNITIES_OVERVIEW.map((item, index) => (
              <MetricCard key={index}>
                <div className="rounded-full bg-[#F0F4FD] p-3">
                  {item.icon && (
                    <item.icon
                      className={`inline-block text-[30px] text-[#2F0FD1] ${item.title === "reputation score" && "rotate-270"}`}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[28px] font-bold text-[#050215]">
                    {item.value}
                  </span>
                  <span className="font-medium text-[#7A899B]">
                    {item.title}
                  </span>
                </div>
              </MetricCard>
            ))}
          </MetricsContainer>
        </div>

        <div className="space-y-4 rounded-[4px] p-4">
          <div className="flex flex-col items-center gap-3 sm:flex-row lg:hidden">
            <div className="w-full flex-1">
              <CustomSearch placeholder="search community" />
            </div>

            <div className="w-full flex-1">
              <CreateCommunityForm />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex w-full gap-4 rounded-[8px] bg-[#F7F9FD] p-2 lg:w-1/2">
              <Button
                onClick={() => handleChangeCommunityView("all")}
                variant="outline"
                className={`flex-1 cursor-pointer rounded-[2px] border-none ${communityView === "all" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
              >
                All
              </Button>

              <Button
                onClick={() => handleChangeCommunityView("joined")}
                variant="outline"
                className={`flex-1 cursor-pointer rounded-[2px] border-none ${communityView === "joined" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
              >
                Joined
              </Button>

              <Button
                onClick={() => handleChangeCommunityView("created")}
                variant="outline"
                className={`flex-1 cursor-pointer rounded-[2px] border-none ${communityView === "created" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
              >
                Created
              </Button>
            </div>

            <div className="flex gap-4">
              <Filter />
              <Sort order={sortOrder} onToggle={handleSort} />
            </div>
          </div>

          {loadingCommunities || loadingMemberCommunities ? (
            <Loader />
          ) : errorLoadingCommunities || errorLoadingMemberCommunities ? (
            <Error title="Failed to load communities." />
          ) : displayedCommunities.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-2xl font-bold">No communities found...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {displayedCommunities.map((community, i) => (
                <CommunitiesCard community={community} key={i} />
              ))}
            </div>
          )}

          <CustomPagination
            currentPage={currentPage}
            totalPages={
              totalMemberCommunitiesPages && communityView === "joined"
                ? totalMemberCommunitiesPages
                : totalCommunityPages
            }
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
}

export default Communities;
