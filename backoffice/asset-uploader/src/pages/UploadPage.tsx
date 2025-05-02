import { useState } from "react";
import axios from "axios";
import "./UploadPage.css";

type AssetType = "floor" | "wall" | "furniture";

const typeMap: Record<AssetType, number> = {
  floor: 1,
  wall: 2,
  furniture: 3,
};

const UploadPage = () => {
  const [type, setType] = useState<AssetType>("floor");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("이미지를 선택해주세요.");

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const width = img.width;
      const height = img.height;

      const metadata = {
        type: typeMap[type],
        fileName: file.name,
        contentType: file.type,
        width,
        height,
      };

      try {
        const presignRes = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/s3/upload`,
          metadata,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const { uploadUrl, fileUrl } = presignRes.data.result;

        console.log("uploadUrl", uploadUrl);
        console.log("Content-Type used in PUT", file.type);
        console.log("metadata", metadata);

        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        alert("업로드 성공!");
        console.log("파일 접근 주소:", fileUrl);
        setFile(null);
      } catch (err) {
        console.error(err);
        alert("업로드 실패");
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };
  };

  return (
    <div className="form-box">
      <form className="upload-form" onSubmit={handleSubmit}>
        <div>
          <label>타입 선택: </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AssetType)}
          >
            <option value="floor">바닥</option>
            <option value="wall">벽</option>
            <option value="furniture">가구</option>
          </select>
        </div>

        <div>
          <label>이미지 선택: </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>

        <button type="submit">업로드</button>
      </form>
    </div>
  );
};

export default UploadPage;
