import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { client } from "../api/axios";

const RoomSetUpPage: React.FC = () => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isFilled, setIsFilled] = useState(false);

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
        frameId: 1,
        backgroundId: 1,
        password: Number(password),
      });

      const { sessionId, sessionCode } = res.data.result; // 백엔드 응답 형식에 따라 수정 필요
      sessionStorage.setItem("sessionId", sessionId);
      navigate(`/invite?r=${sessionCode}`);
    } catch (error) {
      console.error("방 생성 실패", error);
      alert("방 생성에 실패했습니다.");
    }
  };
  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2 z-10">
        비공개로 설정할까요?
      </h2>
      <p className="text-body1 font-bold text-gray-500 mb-6 z-10">
        비밀번호를 입력해야 입장할 수 있어요.
      </p>

      <div className="flex gap-4 mb-10 z-10 w-full justify-center">
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
              className="w-[100px] h-[100px] text-center text-lg font-bold border border-gray-300 bg-white rounded-md focus:outline-none"
            />
          ))}
      </div>

      <button
        disabled={!isFilled}
        className={`w-full py-3 rounded-lg shadow-md mb-4 font-bold transition-colors ${
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
