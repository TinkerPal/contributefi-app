import BackButton from "@/components/BackButton";
import CustomDateSelect from "@/components/CustomDateSelect";
import CustomInput from "@/components/CustomInput";
import CustomSelect from "@/components/CustomSelect";
import TokenSelectorModal from "@/components/dashboard/TokenSelectorModal";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getItemFromLocalStorage } from "@/lib/utils";
import { CreateGrowthQuestSchema } from "@/schemas";
import {
  REWARD_MODES,
  SENTIMENT_CHECK,
  SOCIAL_MEDIA_PLATFORM,
} from "@/utils/constants";
import { Checkbox, Field, Radio, RadioGroup } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiNotePencilFill } from "react-icons/pi";
import { useParams } from "react-router";
import { Switch } from "@/components/ui/switch";

function NewBurst() {
  const { newBurst } = useParams();
  const [openTokenSelectorModal, setOpenTokenSelectorModal] = useState(false);
  const [step, setStep] = useState(1);
  const [rewardToken, setRewardToken] = useState(
    getItemFromLocalStorage("rewardToken") || null,
  );

  const handleChangeToken = () => {
    setOpenTokenSelectorModal(true);
  };

  const handleContinue = () => {
    setStep(2);
  };

  const {
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(CreateGrowthQuestSchema),
  });

  console.log("NewBurst render - newBurst param:", newBurst);
  return (
    <div>
      <div className="space-y-8">
        <div className="space-y-[32px] rounded-[4px] bg-white px-[56px] pt-[32px] pb-[80px]">
          <BackButton />

          {step === 1 && (
            <div className="space-y-[24px]">
              <p className="font-bricolage text-[24px] font-[700] text-[#050215]">
                Create New Burst
              </p>

              <form
                //   onSubmit={handleSubmit(onSubmit)}
                className="grid gap-5 lg:grid-cols-2"
              >
                <CustomInput
                  label="Burst Title"
                  placeholder="Enter Title"
                  type="text"
                  // error={errors.questTitle?.message}
                  // {...register("questTitle")}
                />
                <Controller
                  name="socialMediaPlatform"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      label="Social Media Platform"
                      options={SOCIAL_MEDIA_PLATFORM}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.socialMediaPlatform?.message}
                    />
                  )}
                />
                <Controller
                  name="selectionMethod"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      label="Selection Method"
                      options={SOCIAL_MEDIA_PLATFORM}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.selectionMethod?.message}
                    />
                  )}
                />

                <CustomInput
                  label="How many selection?"
                  placeholder="1"
                  type="number"
                  error={errors.tokensPerWinner?.message}
                  // {...register("tokensPerWinner", { valueAsNumber: true })}
                />

                <CustomInput
                  label="Contract"
                  placeholder="Select or enter an asset or token"
                  type="text"
                  error={errors.tokenContract?.message}
                  // {...register("tokenContract")}
                  // className={
                  //   rewardType !== "Token"
                  //     ? "hidden"
                  //     : rewardToken
                  //       ? "pl-[30%]"
                  //       : ""
                  // }
                  onFocus={handleChangeToken}
                  handleClickIcon={() => {}}
                  icon={<IoMdArrowDropdown />}
                  token={
                    rewardToken && (
                      <div className="flex w-full items-center gap-2 text-sm text-black">
                        <span>
                          {rewardToken?.contract
                            ? "Sym:"
                            : rewardToken?.issuer
                              ? "Asset:"
                              : ""}
                        </span>
                        <span className="font-bold">{rewardToken?.code}</span>
                      </div>
                    )
                  }
                />

                <TokenSelectorModal
                  openTokenSelectorModal={openTokenSelectorModal}
                  setOpenTokenSelectorModal={setOpenTokenSelectorModal}
                  setRewardToken={setRewardToken}
                />

                <CustomInput
                  label="How many token for the winner?"
                  placeholder="eg 50"
                  type="number"
                  error={errors.tokensPerWinner?.message}
                  // {...register("tokensPerWinner", { valueAsNumber: true })}
                />

                <Label className="flex flex-col items-start gap-2 text-base font-light text-[#09032A] lg:col-span-2">
                  Which conversations do you want to engage in?
                  <Textarea
                    className="h-[96px] rounded-[12px] border-none bg-[#F7F9FD] px-4 text-base placeholder:text-base placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0"
                    placeholder="What's the community about?"
                    //   error={errors.communityDescription?.message}
                    //   {...register("communityDescription")}
                  />
                </Label>

                <div className="lg:col-span-2">
                  <Controller
                    name="rewardMode"
                    control={control}
                    render={({ field }) => (
                      <div className="grid gap-2">
                        <p className="text-base font-light text-[#09032A]">
                          Reward Mode
                        </p>
                        <RadioGroup
                          value={field.value}
                          onChange={field.onChange}
                          className="flex w-[100%] flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
                        >
                          {SENTIMENT_CHECK.map((plan) => (
                            <Field
                              key={plan}
                              className="flex w-[50%] items-center gap-2"
                            >
                              <Radio
                                value={plan}
                                className="group flex size-5 items-center justify-center rounded-full border bg-white data-checked:bg-[#2F0FD1]"
                              >
                                <span className="invisible size-2 rounded-full bg-white group-data-checked:visible" />
                              </Radio>
                              <Label className="text-[15px] font-[300] text-[#09032A]">
                                {plan}
                              </Label>
                            </Field>
                          ))}
                        </RadioGroup>

                        {errors.rewardMode && (
                          <span className="text-xs text-red-500">
                            {errors.rewardMode.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="flex items-center gap-3 lg:col-span-2">
                  <Controller
                    name="makeConcurrent"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                        className="group block size-4 shrink-0 rounded border border-[#D0D5DD] bg-white data-checked:border-none data-checked:bg-[#2F0FD1] data-disabled:cursor-not-allowed data-disabled:bg-orange-200"
                      >
                        <svg
                          className="stroke-white opacity-0 group-data-checked:opacity-100"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Checkbox>
                    )}
                  />
                  <p className="text-[14px] font-[300] text-[#09032A]">
                    Add reference image (3 max)
                  </p>
                </div>

                <div className="lg:col-span-2">
                  <FileUpload />
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full cursor-pointer rounded-md bg-[#2F0FD1] px-8 py-5 text-[16px] font-[300] hover:bg-[#2F0FD1]/70 hover:text-white lg:col-span-2"
                >
                  Continue
                </Button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-[24px]">
              <div className="flex items-center justify-between gap-4">
                <p className="font-bricolage text-[24px] font-[700] text-[#050215]">
                  Preview Burst
                </p>

                <Button
                  onClick={() => setStep(1)}
                  className="group cursor-pointer rounded-md bg-[#EDF2FF] px-8 py-5 text-[16px] font-[300] text-[#205CE2] hover:bg-[#2F0FD1] hover:text-white"
                >
                  Edit Burst
                  <PiNotePencilFill className="text-[#2F0FD1] group-hover:text-white" />
                </Button>
              </div>

              <div className="space-y-[16px]">
                <div className="flex items-center justify-between gap-2 text-left">
                  <p className="flex-1 text-[15px] text-[#48484A]">
                    Burst Title
                  </p>
                  <p className="flex-2">Join a Trending Topic about Errands</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-left">
                  <p className="flex-1 text-[15px] text-[#48484A]">
                    Social Media Platform
                  </p>
                  <p className="flex-2">Twitter</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-left">
                  <p className="flex-1 text-[15px] text-[#48484A]">
                    Number of Winners
                  </p>
                  <p className="flex-2">1</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-left">
                  <p className="flex-1 text-[15px] text-[#48484A]">
                    Burst Duration
                  </p>
                  <p className="flex-2">08:00 AM to 11:00 AM</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-left">
                  <p className="flex-1 text-[15px] text-[#48484A]">
                    Reward Per Winner
                  </p>
                  <p className="flex-2">50 XLM</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-left">
                  <p className="flex-1 text-[15px] text-[#48484A]">
                    Conversation Type
                  </p>
                  <p className="flex-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in repreh
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 text-left">
                  <p className="flex-1 text-[15px] text-[#48484A]">
                    Reference Images
                  </p>
                  <p className="flex-2">Twitter</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-left">
                  <p className="flex-1 text-[15px] text-[#48484A]">
                    Social Media Platform
                  </p>
                  <p className="flex-2">Twitter</p>
                </div>
              </div>

              <form
                //   onSubmit={handleSubmit(onSubmit)}
                className="grid gap-5 lg:grid-cols-3"
              >
                <div className="space-y-2 lg:col-span-3">
                  <p className="flex w-full items-center justify-between text-base font-light text-[#09032A]">
                    Quest Duration
                  </p>

                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <CustomDateSelect
                        startDate={field.value}
                        endDate={watch("endDate")}
                        onStartDateChange={field.onChange}
                        onEndDateChange={(date) =>
                          setValue("endDate", date, { shouldValidate: true })
                        }
                        runContinuously={watch("runContinuously")}
                        startDateError={errors.startDate?.message}
                        endDateError={errors.endDate?.message}
                        startTime={true}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center gap-3 lg:col-span-3">
                  <Controller
                    name="makeConcurrent"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#2F0FD1]"
                      />
                    )}
                  />

                  <p className="text-[14px] font-[300] text-[#09032A]">
                    Allow Contribute to auto-post the selected entry
                  </p>
                </div>

                <div className="flex items-center gap-3 lg:col-span-3">
                  <Controller
                    name="makeConcurrent"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#2F0FD1]"
                      />
                    )}
                  />

                  <p className="text-[14px] font-[300] text-[#09032A]">
                    Allow context check by AI
                  </p>
                </div>

                <div className="mt-6 space-y-2 rounded-[8px] bg-[#EDF2FF] px-9 py-6 lg:col-span-3">
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-[300] text-[#09032A]">
                        Total Rewards (to be deposited):
                      </p>
                      <p className="text-2xl font-bold text-[#050215]">
                        {/* {step1Data.rewardMode === "Overall Reward" &&
                          `${step1Data.tokensPerWinner * step1Data.numberOfWinners} ${step1Data?.symbol}`}

                        {step1Data.rewardMode === "Individual Task Reward" &&
                          `${step1Data.tasks.reduce((total, task) => total + task.tokensPerTask, 0) * step1Data.numberOfWinners} ${step1Data?.symbol}`} */}
                        50 XLM
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="font-[300] text-[#09032A]">
                        Fees to Charge
                      </p>
                      <p className="text-2xl font-bold text-[#050215]">
                        1.5 XLM
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      size="lg"
                      type="submit"
                      className="mt-5 w-full"
                      //   onClick={() => {
                      //     setStep((prev) => prev + 1);
                      //     setItemInLocalStorage("growthQuestStep", 3);
                      //   }}
                      //   disabled={rewardAllWithPoints && !extraPoints}
                    >
                      Deposit Token
                    </Button>
                  </>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewBurst;
