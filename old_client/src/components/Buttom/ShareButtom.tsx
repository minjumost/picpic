import shareIcon from "../../assets/share.png";

const ShareButton = () => {
  return (
    <button className="flex justify-center items-center p-0.5 w-[150px] h-[55px] bg-green border-[3px] border-text rounded-lg">
      <div className="flex justify-center items-center gap-3 w-full h-full border-[3px] border-greenBorder rounded-lg px-1">
        <img src={shareIcon} alt="공유" className="w-5 h-5" />
        <span className="text-[#FCF9E5]">공유</span>
      </div>
    </button>
  );
};

export default ShareButton;
