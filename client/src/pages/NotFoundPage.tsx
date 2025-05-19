import { usePageExitEvent } from "../hooks/usePageExitEvent";

const NotFound = () => {
  usePageExitEvent("NotFoundPage");
  return (
    <div style={{ textAlign: "center", paddingTop: "5rem" }}>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>주소를 다시 확인해주세요.</p>
    </div>
  );
};

export default NotFound;
