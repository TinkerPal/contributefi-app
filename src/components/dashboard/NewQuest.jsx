import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import GrowthQuest from "./GrowthQuest";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import OnChainQuest from "./OnChainQuest";
import TechnicalQuest from "./TechnicalQuest";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function NewQuest({
  sheetIsOpen,
  setSheetIsOpen,
  setOpenQuestSuccess,
  communityId,
}) {
  const isDesktop = useIsDesktop();
  const { requireAuth } = useRequireAuth();

  const side = isDesktop ? "right" : "bottom";

  const handleOpenChange = (open) => {
    if (open) {
      requireAuth(() => setSheetIsOpen(true));
    } else {
      setSheetIsOpen(false);
    }
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 hover:bg-[#2F0FD1]/70">
          Create Quest
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className={`bg-white ${side === "bottom" ? "h-[80%]" : "sm:max-w-xl"} px-4`}
      >
        <SheetHeader className="relative">
          <SheetTitle className="font-bricolage text-[28px] font-bold text-[#09032A]">
            Create New Quest
          </SheetTitle>
          <SheetDescription className="font-[300] text-[#525866]">
            Which type of quest do you want to create?
          </SheetDescription>
        </SheetHeader>

        <GrowthQuest
          setSheetIsOpen={setSheetIsOpen}
          setOpenQuestSuccess={setOpenQuestSuccess}
          communityId={communityId}
        />

        <OnChainQuest
          setSheetIsOpen={setSheetIsOpen}
          setOpenQuestSuccess={setOpenQuestSuccess}
          communityId={communityId}
        />
        <TechnicalQuest
          setSheetIsOpen={setSheetIsOpen}
          setOpenQuestSuccess={setOpenQuestSuccess}
          communityId={communityId}
        />
      </SheetContent>
    </Sheet>
  );
}

export default NewQuest;
