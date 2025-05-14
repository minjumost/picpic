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
  console.log(import.meta.env.VITE_BASE_URL);
  console.log(contentType);

  return res.data.result; // { presignedUrl, imageUrl }
}

export async function uploadToS3(presignedUrl: string, file: File) {
  await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
}
