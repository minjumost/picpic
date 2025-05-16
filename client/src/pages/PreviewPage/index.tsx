import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";

import { useGetSelectedFrames } from "../../api/frame";
import { useGetSessionImages } from "../../api/getImage";
import { getCurrentDateTimeString } from "../CameraPage";
import { getPresignedUrl } from "../CameraPage/useUploadImage";
import { usePostCollageImage } from "../../api/CompImg";
import { useNavigate } from "react-router";
import { useSessionCode } from "../../hooks/useSessionCode";
import { setHandlers } from "../../sockets/stompClient";
import { sendDrawStart } from "../../sockets/sessionSocket";

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
    setHandlers({ stroke_start: () => navigate(`/decorate?r=${sessionCode}`) });
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
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });
    const dataUrl = canvas.toDataURL("image/png");
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
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-xl font-bold">사진이 완성되었어요 🥳</p>
      <p className="text-heading3 font-bold text-gray-500 mb-6">
        🎨 한 컷씩 같이 꾸밀 수 있어요.
      </p>

      <p className="text-heading3 font-bold text-gray-500 mb-6">
        ⏰ 2분 안에 꾸미기를 완료해주세요.
      </p>

      <p className="text-heading3 font-bold text-gray-500 mb-6">
        ❌ 되돌릴 수 없으니 신중하게 꾸며주세요.
      </p>
      <div ref={captureRef} className="relative w-[720px] h-[590px]">
        {imageList && frame && (
          <>
            {imageList.map((img, idx) => {
              const { top, left, width, height } = SLOT_POSITIONS[idx];
              return (
                <img
                  key={img.slotIndex}
                  src={img.photoImageUrl}
                  alt={`photo-${idx}`}
                  style={{
                    position: "absolute",
                    top,
                    left,
                    width,
                    height,
                    objectFit: "cover",
                  }}
                />
              );
            })}
            <img
              src={frame.frameImageUrl}
              alt="frame"
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
          </>
        )}
      </div>

      <button
        className="w-full bg-main1 text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        onClick={async () => {
          await handleCapture();
          sendDrawStart(sessionId, sessionCode);
        }}
      >
        꾸미러 가기
      </button>
    </div>
  );
};

export default PreviewPage;
