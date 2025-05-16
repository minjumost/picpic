const PHOTO_CONSENT_TEXT = [
  "브라우저를 통해 기기의 카메라 사용을 허용합니다.",
  "촬영된 사진은 24시간 동안만 저장되며, 낙서 및 공유 기능에 활용됩니다.",
  "외부에 공개되지 않으며, 언제든지 사용을 중단할 수 있습니다.",
];

const PhotoTerms = () => {
  return (
    <div className="w-full flex flex-col gap-4 p-4 rounded-xl border border-gray-200 bg-white">
      <div className="text-2xl font-semibold text-gray-800">
        📸 사진 촬영 및 활용 동의서
      </div>

      <ul className="flex flex-col gap-2 text-gray-700 text-sm leading-relaxed list-disc pl-5">
        {PHOTO_CONSENT_TEXT.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
};

export default PhotoTerms;
