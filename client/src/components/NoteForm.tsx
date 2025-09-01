import { useState, useEffect } from "react";

interface Props {
  onSave: (title: string, content: string) => void;
  editingTitle?: string;
  editingContent?: string;
  onCancelEdit?: () => void;
}

export default function NoteForm({ onSave, editingTitle = "", editingContent = "", onCancelEdit }: Props) {
  const [title, setTitle] = useState(editingTitle);
  const [content, setContent] = useState(editingContent);

  useEffect(() => {
    setTitle(editingTitle);
    setContent(editingContent);
  }, [editingTitle, editingContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onSave(title, content);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        placeholder="Title"
        className="w-full mb-2 p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        className="w-full mb-2 p-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {editingTitle ? "Update Note" : "Add Note"}
        </button>
        {onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}