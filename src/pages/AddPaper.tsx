import { useAuth } from "../lib/authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AddPaper() {
  const { userVerified, userEmail } = useAuth();
  const [college, setCollege] = useState("Alliance University");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [submitMsg, setSubmitMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useNavigate();

  useEffect(() => {
    if (!userVerified) {
      console.log("Please verify your email to access this section.");
    }
  }, [userVerified, router]);

  const showTemporaryMessage = (message: string, success: boolean) => {
    setSubmitMsg(message);
    setIsSuccess(success);
    setTimeout(() => {
      setSubmitMsg("");
      router("/");      
    }, 800);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!course || !semester || !subject || !file || !previewImage || !userEmail) {
      showTemporaryMessage("Please fill out all fields and upload both files.", false);
      setIsSubmitting(false);
      return;
    }

    const dto = { college, course, semester: parseInt(semester), subject, description, userEmail };

    const formData = new FormData();
    formData.append("data", JSON.stringify(dto));
    formData.append("file", file);
    formData.append("preview", previewImage);

    try {
      await axios.post(`/api/papers/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showTemporaryMessage("Paper uploaded successfully!", true);
      setCollege("Alliance University");
      setCourse("");
      setSemester("");
      setSubject("");
      setDescription("");
      setFile(null);
      setPreviewImage(null);
      (document.getElementById('file-input') as HTMLInputElement).value = "";
      (document.getElementById('preview-input') as HTMLInputElement).value = "";

    } catch (error) {
      console.error("Upload error:", error);
      showTemporaryMessage("Upload failed. Please check your input and try again.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userVerified) {
    return (
        <div className="absolute w-full top-0 h-full flex flex-col items-center justify-center bg-[#030014] text-white">
            <h2 className="text-red-500 text-lg mb-2">Access Denied</h2>
            <p className="text-lg mb-4">Please verify your email to add papers.</p>
            <button
            onClick={() => router("/Profile")}
            className="bg-indigo-600 px-6 py-2 rounded text-white"
            >
            Verify Now
            </button>
        </div>
    );
  }
  
  return (
    <div className="bg-[#030014] min-h-screen relative">
      <div className=" flex min-h-screen justify-center items-center px-4 py-6 text-white">
        <div className="w-full max-w-xl align-center flex flex-col mx-auto">
          <h1 className="text-xl mb-4 text-center">Add Paper</h1>

          <input type="text" placeholder="College" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full bg-white text-black rounded-md px-4 py-2 mb-4" />
          <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} className="w-full bg-white text-black rounded-md px-4 py-2 mb-4" />
          <input type="text" placeholder="Semester" value={semester} onChange={(e) => { const val = e.target.value; if (/^(10|[1-9])?$/.test(val)) { setSemester(val); } }} inputMode="numeric" className="w-full bg-white text-black rounded-md px-4 py-2 mb-4" />
          <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-white text-black rounded-md px-4 py-2 mb-4" />
          <textarea placeholder="Short Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white text-black rounded-md px-4 py-2 mb-4" />

          <div className="border p-2 flex justify-between items-center rounded mb-4">
            <label className="text-sm">Upload Paper (PDF, Word)</label>
            <input id="file-input" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="bg-blue-500 cursor-pointer text-black rounded-md px-2 py-1 text-xs" />
          </div>
          <div className="border p-2 flex justify-between items-center rounded mb-4">
            <label className="text-sm">Upload Preview Image</label>
            <input id="preview-input" type="file" accept="image/*" onChange={(e) => setPreviewImage(e.target.files?.[0] || null)} className="bg-blue-500 cursor-pointer text-black rounded-md px-2 py-1 text-xs" />
          </div>

          <div className="h-6 mb-2 text-center">
            {submitMsg && (
              <p className={isSuccess ? "text-green-400" : "text-red-400"}>
                {submitMsg}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 w-[50%] mx-auto cursor-pointer rounded-md px-4 py-2 mb-4 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
      <p className="absolute bottom-0 left-0 right-0 text-center bg-[#030014] text-gray-400 text-xs">
        Thank you for contributing!
      </p>
    </div>
  );
}