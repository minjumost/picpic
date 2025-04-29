interface ButtonProps {
  width: number;
  height: number;
  text: string;
}
const Button: React.FC<ButtonProps> = ({ width, height, text }) => {
  return (
    <button
      className="flex justify-center items-center p-1 bg-green border-[3px] border-text rounded-lg"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="flex justify-center items-center px-2 py-1 w-full h-full border-[3px] border-greenBorder rounded-lg">
        <span className=" text-[#FCF9E5]">{text}</span>
      </div>
    </button>
  );
};

export default Button;
