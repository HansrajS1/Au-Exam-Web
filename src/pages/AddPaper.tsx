import { useAuth } from "../lib/authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AddPaper() {
  const { userVerified, userEmail } = useAuth();
  const router = useNavigate();

  const [college, setCollege] = useState("Alliance University");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userVerified) {
      console.log("Please verify your email to access this section.");
    }
  }, [userVerified, router]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (
      !course ||
      !semester ||
      !subject ||
      !file ||
      !previewImage ||
      !userEmail
    ) {
      alert("Please fill out all fields and upload both files.");
      setIsSubmitting(false);
      return;
    }

    const dto = {
      college,
      course,
      semester: parseInt(semester),
      subject,
      description,
      userEmail,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(dto));
    formData.append("file", file);
    formData.append("preview", previewImage);

    try {
      const response = await axios.post(
        `/api/papers/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Upload response:", response.data);
      alert("Paper uploaded successfully!");
      router("/");
      setCollege("Alliance University");
      setCourse("");
      setSemester("");
      setSubject("");
      setDescription("");
      setFile(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please check your input and try again.");
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
          <input
            type="text"
            placeholder="College"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full bg-white text-black rounded-md px-4 py-2 mb-4"
          />
          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full bg-white text-black rounded-md px-4 py-2 mb-4"
          />
          <input
            type="number"
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full bg-white text-black rounded-md px-4 py-2 mb-4"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-white text-black rounded-md px-4 py-2 mb-4"
          />
          <textarea
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white text-black rounded-md px-4 py-2 mb-4"
          />

          <div className="border p-2 flex justify-center flex-wrap justify-evenly gap-2 align-center rounded mb-4">
            <label className="text-sm min-w-[180px] align-center m-1">
              Upload Paper (PDF, Word)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="bg-blue-500 cursor-pointer align-center text-black rounded-md px-2 py-1"
            />
          </div>

          <div className="border p-2 flex justify-evenly flex-wrap gap-2 rounded mb-4">
            <label className="text-sm text-center min-w-[180px] m-1">
              Upload Preview Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPreviewImage(e.target.files?.[0] || null)}
              className="bg-blue-500 text-black cursor-pointer rounded-md px-2 py-1"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 w-[50%] mx-auto cursor-pointer rounded-md px-4 py-2 mb-4 text-white font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
      <p className="absolute bottom-0 left-0 right-0 text-center bg-[#030014] text-gray-400 text-xs">
        Thank you for contributing!
      </p>
    </div>
  );
}
