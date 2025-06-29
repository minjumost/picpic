import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { client } from "../api/axios";
import Button from "../components/Button";
import MainLayout from "../components/Layouts/MainLayout";
import { usePageExitEvent } from "../hooks/usePageExitEvent";
import { useFrameStore } from "../store/store";

const RoomSetUpPage: React.FC = () => {
  usePageExitEvent("RoomSetUpPage");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isFilled, setIsFilled] = useState(false);

  const frameStore = useFrameStore();

  const navigate = useNavigate();

  const updateFilledStatus = () => {
    const allFilled = inputsRef.current.every(
      (input) => input?.value?.length === 1
    );
    setIsFilled(allFilled);
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const input = inputsRef.current[index];
    if (input) input.value = value;

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    updateFilledStatus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleCreateRoom = async () => {
    const password = inputsRef.current.map((input) => input?.value).join("");

    try {
      const res = await client.post("/api/v1/session", {
        frameId: Number(frameStore.selectedFrame === "four" ? 1 : 2),
        backgroundId: 1,
        password: Number(password),
      });

      const { sessionCode } = res.data.result;
      navigate(`/invite?r=${sessionCode}`, { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("방 생성에 실패했습니다.");
    }
  };
  return (
    <MainLayout
      title="방 비밀번호를 설정 해주세요."
      description={["4자리 숫자만 입력할 수 있어요"]}
      footer={
        <Button
          label="방 만들기"
          onClick={handleCreateRoom}
          disabled={!isFilled}
        />
      }
    >
      <div className="flex gap-4 w-full justify-center">
        {Array(4)
          .fill(0)
          .map((_, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-full aspect-square text-center text-3xl font-medium border border-gray-300 bg-white rounded-md focus:outline-none"
            />
          ))}
      </div>
    </MainLayout>
  );
};

export default RoomSetUpPage;
