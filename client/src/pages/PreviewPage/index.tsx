import html2canvas from "html2canvas-pro";
import { useEffect, useRef } from "react";

import { useNavigate } from "react-router";
import { usePostCollageImage } from "../../api/CompImg";
import { useGetSelectedFrames } from "../../api/frame";
import { useGetSessionImages } from "../../api/getImage";
import Button from "../../components/Button";
import Frame1 from "../../components/Layouts/Frame";
import MainLayout from "../../components/Layouts/MainLayout";
import { useSessionCode } from "../../hooks/useSessionCode";
import { sendDrawStart } from "../../sockets/sessionSocket";
import { setHandlers } from "../../sockets/stompClient";
import { getCurrentDateTimeString } from "../CameraPage";
import { getPresignedUrl } from "../CameraPage/useUploadImage";

const SLOT_POSITIONS = [
  { top: 158, left: 11, width: 338, height: 204 },
  { top: 12, left: 371, width: 338, height: 204 },
  { top: 374, left: 11, width: 338, height: 204 },
  { top: 228, left: 371, width: 338, height: 204 },
];

const PreviewPage = () => {
  const captureRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const sessionCode = useSessionCode();
  const sessionId = Number(sessionStorage.getItem("sessionId"));

  useEffect(() => {
    setHandlers({
      stroke_start: (data: { startTime: string; duration: number }) =>
        navigate(`/decorate?r=${sessionCode}`, {
          state: {
            startTime: data.startTime,
            duration: data.duration,
          },
          replace: true,
        }),
    });
  }, []);

  const postImage = usePostCollageImage();

  const { data: frame, isLoading: frameLoading } =
    useGetSelectedFrames(sessionId);
  const { data: imageList, isLoading: imagesLoading } =
    useGetSessionImages(sessionId);

  if (frameLoading || imagesLoading) return <div>로딩 중..</div>;

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const uploadToS3 = async (presignedUrl: string, file: File) => {
    console.log(file);
    await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
  };

  const handleCapture = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, {
      scale: 6,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });
    const dataUrl = canvas.toDataURL("image/png");
    console.log("캡쳐본: ", dataUrl);
    const fileName = `${getCurrentDateTimeString()}.png`;
    const file = dataURLtoFile(dataUrl, fileName);

    const { presignedUrl, imageUrl } = await getPresignedUrl({
      type: "collage",
      fileName: file.name,
      contentType: file.type,
    });

    await uploadToS3(presignedUrl, file);

    try {
      await postImage.mutateAsync({
        sessionId: sessionId,
        collageImageUrl: imageUrl,
      });

      console.log("성공");
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <MainLayout
      title="사진 촬영이 끝났어요"
      description={["이제 다같이 꾸며볼까요?"]}
      footer={
        <Button
          label="꾸미러 가기"
          onClick={async () => {
            await handleCapture();
            sendDrawStart(sessionId, sessionCode);
          }}
        />
      }
    >
      {/* {imageList && (
        <Frame1
          photos={imageList.map((img) => ({
            slotIndex: img.slotIndex,
            photoImageUrl: img.photoImageUrl ?? "",
          }))}
        />
      )} */}
      <div
        ref={captureRef}
        style={{
          width: "1080px",
          height: "1440px",
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          pointerEvents: "none",
          opacity: 1,
        }}
      >
        {imageList && (
          <Frame1
            photos={imageList.map((img) => ({
              slotIndex: img.slotIndex,
              photoImageUrl: img.photoImageUrl ?? "",
            }))}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default PreviewPage;
