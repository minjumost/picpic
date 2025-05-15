import { useRef } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router";
import CompositeImage from "../../components/CompositeImage";
import { useSessionCode } from "../../hooks/useSessionCode";
import { useGetSelectedFrames } from "../../api/frame";
import { useGetSessionImages } from "../../api/getImage";
import { getCurrentDateTimeString } from "../CameraPage";
import { getPresignedUrl } from "../CameraPage/useUploadImage";
import { usePostCollageImage } from "../../api/sendCompImg";

const PreviewPage = () => {
  const captureRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const sessionCode = useSessionCode();
  const sessionId = Number(sessionStorage.getItem("sessionId"));
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

    const canvas = await html2canvas(captureRef.current);
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
      await postImage.mutateAsync(
        await postImage.mutateAsync({
          sessionId: sessionId,
          collageImageUrl: imageUrl,
        })
      );
      console.log("성공");
      navigate(`/guide?r=${sessionCode}`);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-xl font-bold">사진이 완성되었어요 🥳</p>
      <div className="w-[720px] h-[590px]" ref={captureRef}>
        {imageList && frame && (
          <CompositeImage images={imageList} frameSrc={frame?.frameImageUrl} />
        )}
      </div>

      <div className="flex gap-4">
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={async () => {
            await handleCapture();
            navigate(`/guide?r=${sessionCode}`);
          }}
        >
          꾸미기 시작
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
