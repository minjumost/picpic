import { PlacedObject } from "../../types/object";
import deleteIcon from "../../assets/delete.png";

interface DeleteButtonProps {
  object: PlacedObject;
  onDelete: (object: PlacedObject) => void;
}

const DeleteButton = ({ object, onDelete }: DeleteButtonProps) => {
  return (
    <button
      onClick={() => onDelete(object)}
      className="flex items-center justify-center p-1 hover:opacity-80"
      aria-label="delete object"
    >
      <img src={deleteIcon} alt="Delete" className="w-6 h-6 object-contain" />
    </button>
  );
};

export default DeleteButton;
