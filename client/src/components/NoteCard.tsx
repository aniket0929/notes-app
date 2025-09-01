import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Props {
  title: string;
  content: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function NoteCard({ title, content, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-700">{content}</p>
      </div>
      <div className="flex space-x-2">
        <button
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          onClick={onEdit}
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
          onClick={onDelete}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}