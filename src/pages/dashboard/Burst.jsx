import BurstCard from "@/components/BurstCard";
import MoreAboutBurst from "@/components/dashboard/MoreAboutBurst";
import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { BURST } from "@/lib/constants";
import React, { useState } from "react";
import { PiMegaphoneFill } from "react-icons/pi";
import { useNavigate } from "react-router";

function Burst() {
  const [burstView, setBurstView] = useState("all");
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleChangeBurstView = (view) => {
    setBurstView(view);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full items-center gap-4 min-[834px]:w-auto">
          <Filter />

          <div className="flex w-full gap-4 rounded-[8px] bg-[#F7F9FD] p-2">
            <Button
              onClick={() => handleChangeBurstView("all")}
              variant="outline"
              className={`flex-1 cursor-pointer rounded-[2px] border-none ${burstView === "all" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
            >
              All
            </Button>

            <Button
              onClick={() => handleChangeBurstView("created")}
              variant="outline"
              className={`flex-1 cursor-pointer rounded-[2px] border-none ${burstView === "created" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
            >
              Created
            </Button>

            <Button
              onClick={() => handleChangeBurstView("participated")}
              variant="outline"
              className={`flex-1 cursor-pointer rounded-[2px] border-none ${burstView === "participated" ? "bg-white text-[#2F0FD1]" : "bg-[#F7F9FD] text-[#525866]"} p-2 text-[15px] hover:bg-white hover:text-[#2F0FD1]`}
            >
              Participated
            </Button>
          </div>
        </div>

        <Button
          onClick={() => navigate("/burst/new-burst")}
          className="w-full cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 text-[16px] font-[300] hover:bg-[#2F0FD1]/70 hover:text-white min-[834px]:w-auto"
        >
          Create New Burst
        </Button>
      </div>

      {/* {burstView === "all" && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {BURST.map((burst, i) => (
            <BurstCard burst={burst} key={i} />
          ))}
        </div>
      )} */}

      <div className="mt-4 flex h-[calc(100vh-230px)] flex-col items-center justify-center gap-8 bg-white text-center min-[834px]:h-[calc(100vh-180px)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F9FD] text-[#2F0FD1]">
          <PiMegaphoneFill className="h-8 w-8" />
        </div>

        <div className="max-w-md space-y-4">
          <p className="font-bricolage text-[24px] font-bold text-[#050215]">
            Increase your brand or product visibility
          </p>
          <p className="text-[18px] text-[#525866]">
            Burst helps you to seamlessly engage in trends on social media
          </p>
        </div>

        <MoreAboutBurst
          sheetIsOpen={sheetIsOpen}
          setSheetIsOpen={setSheetIsOpen}
        />
      </div>
    </>
  );
}

export default Burst;
