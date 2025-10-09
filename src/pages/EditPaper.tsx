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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (
      !paper.subject ||
      !paper.description ||
      !paper.userEmail ||
      !file ||
      !previewImage
    ) {
      window.alert("All fields including file and preview image are required.");
      setIsSubmitting(false);
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
    formData.append("file", file);
    formData.append("preview", previewImage);

    try {
      await axios.put(`${BASE_URL}/api/papers/${paperId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.alert("Paper updated successfully!");
      router("/");
    } catch {
      console.error("Update error");
      window.alert("Update failed. Please try again.");
    }
  };

  if (!paper) return null;

  return (
    <div className="min-h-screen bg-[#030014]">
      <div className="min-h-screen max-w-xl flex flex-col mx-auto px-4 py-6 items-center justify-center text-white">
        <h1 className="text-xl mb-4 text-center">Edit Paper</h1>

        <input
          type="text"
          placeholder="Subject"
          value={paper.subject}
          onChange={(e) => setPaper({ ...paper, subject: e.target.value })}
          className="w-full bg-white text-black rounded-md px-4 py-2 mb-4"
          required
        />

        <textarea
          placeholder="Short Description"
          value={paper.description}
          onChange={(e) => setPaper({ ...paper, description: e.target.value })}
          className="w-full bg-white text-black rounded-md px-4 py-2 mb-4"
          required
        />
        <div className="border p-2 flex justify-evenly flex-wrap gap-2 rounded mb-4">
          <label className="text-sm min-w-[180px] align-center m-1">Upload Paper File</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFilePick}
            required
            className="bg-blue-500 cursor-pointer align-center text-black rounded-md px-2 py-1"
          />
        </div>
        <div className="border p-2 flex justify-evenly flex-wrap gap-2 rounded mb-4">
        <label className="text-sm min-w-[180px] m-1">Upload Preview Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePreviewPick}
          required
          className="bg-blue-500 cursor-pointer text-black rounded-md px-2 py-1"
          />
          </div>

        <button
          onClick={handleUpdate}
          disabled={isSubmitting || !file || !previewImage}
          className={`bg-green-600  w-[50%] mx-auto rounded-md px-4 py-2 text-white font-semibold ${
            !file || !previewImage ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Update
        </button>
      </div>
    </div>
  );
}
