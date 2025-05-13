import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PhotoTerms from "../../components/PhotoTerms";
import { connectAndEnterSession } from "../../sockets/sessionSocket";
import { useGuestLogin } from "../../api/auth";

const RoomPwdPage = () => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isFilled, setIsFilled] = useState(false);

  const [searchParams] = useSearchParams();
  const sessionCode = searchParams.get("r");

  const guestLoginMutation = useGuestLogin();

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

  const handleLogin = () => {
    guestLoginMutation.mutate(undefined, {
      onSuccess: () => {
        handleEnterRoom();
        console.log("로그인 성공");
      },
      onError: (error) => {
        console.error("에러 발생:", error);
      },
    });
  };

  const handleEnterRoom = async () => {
    if (!sessionCode) {
      alert("방 코드가 없습니다.");
      return;
    }

    const passwordStr = inputsRef.current
      .map((input) => input?.value ?? "")
      .join("");
    const password = Number(passwordStr);

    await connectAndEnterSession(sessionCode, password);

    navigate(`/waiting?r=${sessionCode}`);
  };

  return (
    <div className="flex flex-col justify-center w-full h-full p-16 gap-5">
      <h2 className="text-heading1 font-bold mb-2 z-10">
        비밀번호를 입력해주세요.
      </h2>
      <div>
        <PhotoTerms />
      </div>
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
        onClick={handleLogin}
      >
        동의하고 입장하기
      </button>
    </div>
  );
};

export default RoomPwdPage;
