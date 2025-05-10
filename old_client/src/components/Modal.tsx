interface ModalProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal = ({
  message = "저장하시겠습니까?",
  onConfirm,
  onCancel,
}: ModalProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
      <div className="relative p-2 bg-orange border-[3px] border-text rounded-lg w-[366px] h-[167px] flex flex-col items-center justify-center">
        <div className="p-6 gap-3 w-[350px] h-[151px] bg-yellowBorder border-[3px] border-orangeBorder rounded-lg flex flex-col items-center justify-center">
          <div className="text-text text-center">{message}</div>
          <div className="flex items-center gap-3">
            <button
              onClick={onConfirm}
              className="w-[130px] h-[50px] flex justify-center items-center p-2 bg-green border-[3px] border-text rounded-lg"
            >
              <div className="text-yellowBorder">예</div>
            </button>
            <button
              onClick={onCancel}
              className="w-[130px] h-[50px] flex justify-center items-center p-2 bg-red border-[3px] border-text rounded-lg"
            >
              <span className="text-yellowBorder">아니오</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
