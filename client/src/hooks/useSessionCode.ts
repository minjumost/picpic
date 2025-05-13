import { useMemo } from "react";
import { useSearchParams } from "react-router";

export const useSessionCode = (): string => {
  const [searchParams] = useSearchParams();

  const sessionCode = useMemo(() => {
    return searchParams.get("r") ?? "";
  }, [searchParams]);

  if (!sessionCode) {
    throw new Error("❌ sessionCode가 URL에 존재하지 않습니다.");
  }

  return sessionCode;
};
