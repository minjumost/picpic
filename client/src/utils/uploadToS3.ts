export const uploadToS3 = async (presignedUrl: string, file: File) => {
  console.log(file);
  await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
};
