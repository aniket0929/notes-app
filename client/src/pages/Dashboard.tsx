import { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios";
import DashboardHeader from "../components/DashboardHeader";
import WelcomeCard from "../components/WelcomeCard";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async (title: string, content: string) => {
    try {
      if (editingNote) {
        await axiosInstance.put(`/notes/${editingNote._id}`, { title, content });
      } else {
        await axiosInstance.post("/notes", { title, content });
      }
      fetchNotes();
      closeModal();
      setEditingNote(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    openModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = () => {
    setEditingNote(null); // Clear editing note
    openModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <DashboardHeader />
        <WelcomeCard />
        <button
          onClick={handleCreate}
          className="bg-blue-500 w-full   text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-4 lg:w-60px"
        >
          Create Note
        </button>

        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded shadow-md w-full max-w-md md:max-w-full md:h-full md:p-6">
              <NoteForm
                onSave={handleSave}
                editingTitle={editingNote?.title}
                editingContent={editingNote?.content}
                onCancelEdit={closeModal}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              title={note.title}
              content={note.content}
              onEdit={() => handleEdit(note)}
              onDelete={() => handleDelete(note._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}