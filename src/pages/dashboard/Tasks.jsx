import BackButton from "@/components/BackButton";
import CustomPagination from "@/components/CustomPagination";
import Heading from "@/components/dashboard/Heading";
import MetricCard from "@/components/dashboard/MetricCard";
import MetricsContainer from "@/components/dashboard/MetricsContainer";
import Empty from "@/components/Empty";
import Error from "@/components/Error";
import Filter from "@/components/Filter";
import Loader from "@/components/Loader";
import CustomSearch from "@/components/Search";
import Sort from "@/components/Sort";
import TasksCard from "@/components/TasksCard";
import { Button } from "@/components/ui/button";
import { TASK_TAG_BG, TASKS_OVERVIEW } from "@/lib/constants";
import { getQuests } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function Tasks() {
  const [sortOrder, setSortOrder] = useState("DESC");
  const [taskView, setTaskView] = useState("active-tasks");

  const handleChangeTaskView = (view) => {
    setTaskView(view);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const LIMIT = 10;
  const OFFSET = currentPage;

  const {
    data: questData,
    isLoading: loadingQuests,
    isError: errorLoadingQuests,
  } = useQuery({
    queryKey: ["quests", LIMIT, OFFSET],
    queryFn: () => getQuests({ limit: LIMIT, offset: OFFSET }),
    keepPreviousData: true,
  });

  const quests = questData?.data ?? [];
  const totalPages = questData?.totalPages ?? 1;

  const handleSort = (order) => {
    setSortOrder(order);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="md:hidden">
            <Heading />
          </div>

          <MetricsContainer>
            {TASKS_OVERVIEW.map((item, index) => (
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="w-full lg:hidden xl:order-2 xl:w-fit">
              <CustomSearch placeholder="Search task" />
            </div>

            <div className="flex w-full flex-1 shrink-0 gap-4 rounded-[8px] bg-[#F7F9FD] p-2 xl:w-1/2">
              <Button
                onClick={() => handleChangeTaskView("active-tasks")}
                variant="outline"
                className={`flex-1 cursor-pointer rounded-[2px] border-none ${taskView === "active-tasks" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
              >
                Active
              </Button>

              <Button
                onClick={() => handleChangeTaskView("my-tasks")}
                variant="outline"
                className={`flex-1 cursor-pointer rounded-[2px] border-none ${taskView === "my-tasks" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
              >
                My Tasks
              </Button>

              <Button
                onClick={() => handleChangeTaskView("completed")}
                variant="outline"
                className={`flex-1 cursor-pointer rounded-[2px] border-none ${taskView === "completed" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
              >
                Completed
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
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Tasks;
