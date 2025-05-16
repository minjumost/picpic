import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { client } from "../api/axios";

const RoomSetUpPage: React.FC = () => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isFilled, setIsFilled] = useState(false);

  const [searchParams] = useSearchParams();

  const frameId = searchParams.get("f");

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
        frameId: Number(frameId),
        backgroundId: 1,
        password: Number(password),
      });

      const { sessionCode } = res.data.result;
      navigate(`/invite?r=${sessionCode}`);
    } catch (error) {
      console.error("방 생성 실패", error);
      alert("방 생성에 실패했습니다.");
    }
  };
  return (
    <div className="flex flex-col justify-center w-full h-full p-4 gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-bold text-gray-800">
          비밀번호를 입력해주세요.
        </h2>
        <p className="text-[18px] font-semibold text-gray-500">
          설정한 비밀번호로 방에 입장할 수 있어요.
        </p>
      </div>
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
              className="w-[80px] h-[80px] text-center text-3xl font-medium border border-gray-300 bg-white rounded-md focus:outline-none"
            />
          ))}
      </div>
      <button
        disabled={!isFilled}
        className={`w-full py-3 rounded-lg font-semibold transition-colors text-lg ${
          isFilled
            ? "bg-main1 text-white cursor-pointer"
            : "bg-gray-300 text-white cursor-not-allowed"
        }`}
        onClick={handleCreateRoom}
      >
        비밀방으로 시작
      </button>
    </div>
  );
};

export default RoomSetUpPage;
