import { useState } from "react";
import axios from "axios";
import "./UploadPage.css";

type AssetType = "floor" | "wall" | "furniture";

const UploadPage = () => {
  const [type, setType] = useState<AssetType>("floor");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("image", file);

    try {
      await axios.post("/api/assets/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("업로드 성공!");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("업로드 실패");
    }
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
