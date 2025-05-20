export const uploadToS3 = async (presignedUrl: string, file: File) => {
  await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
};
