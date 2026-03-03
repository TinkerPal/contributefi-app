import { TASK_TAG_BG } from "@/lib/constants";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

function TasksCard({ task, tag }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pathLength = location.pathname.split("/").length;
  let pathname = location.pathname.split("/");

  pathname = pathname[1] + "/" + pathname[2];

  const handleOpen = () => {
    if (!task.isActive) {
      toast.error("Quest is no longer available");
      return;
    }
    if (pathLength === 3 && location.pathname.startsWith("/communities")) {
      navigate(
        `/${location.pathname.slice(1, location.pathname.length)}/${encodeURIComponent(task.id)}`,
        {
          replace: false,
        },
      );
      return;
    } else if (pathLength === 4) {
      navigate(`/${pathname}/${encodeURIComponent(task.id)}`, {
        replace: false,
      });
      return;
    } else {
      navigate(`/tasks/${encodeURIComponent(task.id)}`, {
        replace: false,
      });
      return;
    }
  };

  return (
    <div
      onClick={handleOpen}
      className={`flex cursor-pointer ${tag === "home-page" || tag === "task-page" ? "" : "cursor-pointer"} flex-col justify-center gap-8 rounded-[8px] border-2 border-[#F0F4FD] bg-white px-[24px] py-[28px]`}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div
            className={`w-fit rounded-[4px] px-[12px] py-[5px] text-sm font-normal text-[#313131] ${TASK_TAG_BG[task.category]}`}
          >
            {task.category === "ON_CHAIN"
              ? "On Chain"
              : task.category === "GROWTH"
                ? "Growth"
                : "Technical"}
          </div>

          <div
            className={`w-fit rounded-[4px] px-[12px] py-[5px] text-sm font-normal text-[#313131] ${TASK_TAG_BG[task.rewardType]}`}
          >
            {task.rewardType}
          </div>
          <div
            className={`w-fit rounded-[4px] px-[12px] py-[5px] text-sm font-normal text-[#313131] ${task.isActive ? "bg-green-400" : "bg-red-400"} text-white`}
          >
            {task.isActive ? "Active" : "Expired"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <p className="flex shrink-0 gap-1.5 font-semibold text-[#2F0FD1]">
            <img src="/Gift.svg" alt="" />
            {task.amount} XLM
          </p> */}
          {/* <div className="flex shrink-0 items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-[#636366]" />
            <p className="flex gap-1.5 font-semibold text-[#8791A7]">
              <img src="/UsersThree.svg" alt="" /> {task.numberOfMembers}
            </p>
          </div> */}
          <div className="flex shrink-0 items-center gap-1">
            <p className="flex gap-1.5 text-base font-semibold text-[#8791A7]">
              <img src="/UsersThree.svg" alt="" />
              <span className="font-light">
                {task.rewardType === "Token"
                  ? `${task.numberOfWinners} winner${task.numberOfWinners > 1 ? "s" : ""}`
                  : "All participants win"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className={`space-y-2`}>
        <p className="max-w-full truncate overflow-hidden font-semibold whitespace-nowrap text-[#1C1C1E]">
          {task.title || task.questTitle}
        </p>
        <p className="max-w-full truncate overflow-hidden text-[15px] font-normal whitespace-nowrap text-[#636366]">
          by {task.communityName}
        </p>
      </div>
    </div>
  );
}

export default TasksCard;
