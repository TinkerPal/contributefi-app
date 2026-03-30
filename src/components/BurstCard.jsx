import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

function BurstCard({ burst, tag }) {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`detail/${encodeURIComponent(burst.id)}`, {
      replace: false,
    });
  };

  console.log("BurstCard render with burst:", burst);

  return (
    <div
      onClick={handleOpen}
      className={`flex cursor-pointer ${tag === "home-page" || tag === "task-page" ? "" : "cursor-pointer"} flex-col justify-center gap-8 rounded-[8px] border-2 border-[#F0F4FD] bg-white px-[24px] py-[28px]`}
    >
      {/* <div className="space-y-4">
        <div className="flex items-center gap-2 border-2"> */}
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
      {/* <div className="flex shrink-0 items-center gap-1">
            <p className="flex gap-1.5 text-base font-semibold text-[#8791A7]">
              <img src="/UsersThree.svg" alt="" />
              <span className="font-light">
                {task.rewardType === "Token"
                  ? `${task.numberOfWinners} winner${task.numberOfWinners > 1 ? "s" : ""}`
                  : "All participants win"}
              </span>
            </p>
          </div> */}
      {/* </div>
      </div> */}

      <div className={`space-y-2`}>
        <p className="max-w-full truncate overflow-hidden font-semibold whitespace-nowrap text-[#09032A]">
          {burst?.burstTitle}
        </p>
        <p className="text-[15px] text-[#48484A]">
          Ends in <span className="font-semibold text-[#09032A]">01:32:24</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="w-fit bg-[#D9F3DC] px-3 py-[5px]">{burst.platform}</div>

        <div className="flex items-center gap-2">
          <p className="flex shrink-0 gap-1.5 font-semibold text-[#2F0FD1]">
            <img src="/Gift.svg" alt="" />
            {burst.tokensForWinner} {burst.symbol}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-[#636366]" />
            <p className="flex gap-1.5 font-semibold text-[#8791A7]">
              <img src="/UsersThree.svg" alt="" /> {burst.participantCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BurstCard;
