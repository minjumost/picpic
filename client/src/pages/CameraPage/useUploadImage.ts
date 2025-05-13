import axios from "axios";

export async function getPresignedUrl({
  type,
  fileName,
  contentType,
}: {
  type: "photo" | "collage";
  fileName: string;
  contentType: string;
}) {
  const res = await axios.get(
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/presigned-url?type=${type}&fileName=${fileName}&contentType=${contentType}`
  );
  return res.data.result; // { presignedUrl, imageUrl }
}

export async function uploadToS3(presignedUrl: string, file: File) {
  await axios.put(presignedUrl, file, {
    headers: { "Content-Type": file.type },
  });
}
