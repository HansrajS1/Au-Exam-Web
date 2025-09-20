import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditPaper() {
  const [searchParams] = useSearchParams();
  const paperId = searchParams.get("paperId");
  const router = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paper, setPaper] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/papers/${paperId}`);
        const data = await response.json();
        setPaper(data);
      } catch {
        window.alert("Failed to load paper.");
      }
    };
    if (paperId) fetchPaper();
  }, [paperId]);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handlePreviewPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setPreviewImage(selected);
  };

  const handleUpdate = async () => {
    if (!paper.subject || !paper.description || !paper.userEmail) {
      window.alert("Subject, description, and user email are required.");
      return;
    }

    const dto = {
      college: paper.college,
      course: paper.course,
      semester: paper.semester,
      subject: paper.subject,
      description: paper.description,
      userEmail: paper.userEmail,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(dto));

    if (file) formData.append("file", file);
    if (previewImage) formData.append("preview", previewImage);

    try {
      await axios.put(`${BASE_URL}/api/papers/${paperId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.alert("Paper updated successfully!");
      router("/");
    } catch (error) {
      console.error("Update error:", error);
      window.alert("Update failed. Please try again.");
    }
  };

  if (!paper) return null;

  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center px-4 py-6 text-white">
      <div className="w-full max-w-xl">
        <h1 className="text-xl mb-4 text-center">Edit Paper</h1>

        <input
          type="text"
          placeholder="Subject"
          value={paper.subject}
          onChange={(e) => setPaper({ ...paper, subject: e.target.value })}
          className="w-full bg-white text-black rounded-md px-4 py-2 mb-4"
        />

        <textarea
          placeholder="Short Description"
          value={paper.description}
          onChange={(e) => setPaper({ ...paper, description: e.target.value })}
          className="w-full bg-white text-black rounded-md px-4 py-2 mb-4"
        />

        <label className="block text-sm mb-2">Replace Paper File (optional)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFilePick}
          className="w-full mb-4"
        />

        <label className="block text-sm mb-2">Replace Preview Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePreviewPick}
          className="w-full mb-4"
        />

        <button
          onClick={handleUpdate}
          className="bg-green-600 w-[50%] mx-auto rounded-md px-4 py-2 text-white font-semibold"
        >
          Update
        </button>
      </div>
    </div>
  );
}
