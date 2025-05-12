const PHOTO_CONSENT_TEXT = [
  "1. 브라우저를 통해 기기의 카메라 사용을 허용합니다.",
  "2. 촬영된 사진은 24시간 동안만 저장되며, 사용자 간 낙서 및 공유 기능에 활용됩니다.",
  "3. 외부에 공개되지 않으며, 언제든지 사용을 중단할 수 있습니다.",
];

const PhotoTerms = () => {
  return (
    <div>
      <div className="font-bold">사진 촬영 및 활용 동의서</div>
      {PHOTO_CONSENT_TEXT.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
};

export default PhotoTerms;
