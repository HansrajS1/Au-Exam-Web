/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import _ from "lodash";

export default function EditPaper() {
  const [searchParams] = useSearchParams();
  const paperId = searchParams.get("paperId");
  const router = useNavigate();

  const [paper, setPaper] = useState<any>(null);
  const [initialPaper, setInitialPaper] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitMsg, setSubmitMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await fetch(`/api/papers/${paperId}`);
        if (!response.ok) throw new Error("Paper not found");
        const data = await response.json();
        setPaper(data);
        setInitialPaper(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (paperId) fetchPaper();
    else setIsLoading(false);
  }, [paperId]);

  const showTemporaryMessage = (message: string, success: boolean) => {
    setSubmitMsg(message);
    setIsSuccess(success);
    setTimeout(() => {
      setSubmitMsg("");
      if (success) {
        router("/");
      }
    }, 800);
  };
  
  const handleUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!paper.subject.trim()) {
      showTemporaryMessage("Subject field cannot be empty.", false);
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
    if (file) formData.append("file", file);
    if (previewImage) formData.append("preview", previewImage);

    try {
      const response = await axios.put(`/api/papers/${paperId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const updatedPaper = response.data as any;
      setInitialPaper(updatedPaper);
      setPaper(updatedPaper);

      setFile(null);
      setPreviewImage(null);
      (document.getElementById('file-input') as HTMLInputElement).value = "";
      (document.getElementById('preview-input') as HTMLInputElement).value = "";
      
      showTemporaryMessage("Paper updated successfully!", true);

    } catch (error) {
      console.error("Update error:", error);
      showTemporaryMessage("Update failed. Please try again.", false);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const hasChanged = initialPaper && (!_.isEqual(initialPaper, paper) || file !== null || previewImage !== null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030014] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-gray-400"></div>
      </div>
    );
  }

  if (!paper) {
    return (
        <div className="min-h-screen bg-[#030014] flex justify-center items-center text-white">
            <p>Paper not found or could not be loaded.</p>
        </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#030014]">
      <div className="min-h-screen max-w-xl flex flex-col mx-auto px-4 py-6 items-center justify-center text-white">
        <h1 className="text-xl mb-4 text-center">Edit Paper</h1>
        
        <input type="text" placeholder="Subject" value={paper.subject} onChange={(e) => setPaper({ ...paper, subject: e.target.value })} className="w-full bg-white text-black rounded-md px-4 py-2 mb-4" />
        <textarea placeholder="Short Description" value={paper.description} onChange={(e) => setPaper({ ...paper, description: e.target.value })} className="w-full bg-white text-black rounded-md px-4 py-2 mb-4" />
        
        <div className="border p-2 w-full flex justify-between items-center rounded mb-4">
          <label className="text-sm">New Paper File (Optional)</label>
          <input id="file-input" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="bg-blue-500 text-black rounded-md px-2 py-1 text-xs" />
        </div>
        <div className="border p-2 w-full flex justify-between items-center rounded mb-4">
          <label className="text-sm">New Preview Image (Optional)</label>
          <input id="preview-input" type="file" accept="image/*" onChange={(e) => setPreviewImage(e.target.files?.[0] || null)} className="bg-blue-500 text-black rounded-md px-2 py-1 text-xs" />
        </div>

        <div className="h-6 mb-2 text-center">
          {submitMsg && (
            <p className={isSuccess ? "text-green-400" : "text-red-400"}>
              {submitMsg}
            </p>
          )}
        </div>

        <button
          onClick={handleUpdate}
          disabled={!hasChanged || isSubmitting}
          className="bg-green-600 w-[50%] mx-auto rounded-md px-4 py-2 text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
}