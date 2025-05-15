import { client } from "../../api/axios";

export async function getPresignedUrl({
  type,
  fileName,
  contentType,
}: {
  type: "photo" | "collage";
  fileName: string;
  contentType: string;
}) {
  const res = await client.get(
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/presigned-url?type=${type}&fileName=${fileName}&contentType=${contentType}`
  );
  console.log(res.data.result);

  return res.data.result; // { presignedUrl, imageUrl }
}

async function mirrorImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // 미러링 적용
      ctx.translate(img.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);

      // Canvas를 Blob으로 변환
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Could not create blob"));
          return;
        }
        // 새로운 File 객체 생성
        const mirroredFile = new File([blob], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        });
        resolve(mirroredFile);
      }, file.type);
    };
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadToS3(presignedUrl: string, file: File) {
  // 이미지 미러링 적용
  const mirroredFile = await mirrorImage(file);

  await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: mirroredFile,
  });
}
