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
    }, 2000);
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
      (document.getElementById("file-input") as HTMLInputElement).value = "";
      (document.getElementById("preview-input") as HTMLInputElement).value = "";
    } catch (error) {
      console.error("Upload error:", error);
      showTemporaryMessage("Upload failed. Please check your input and try again.", false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fontImport = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap');
      .ap-serif { font-family: 'Source Serif 4', Georgia, serif; }
      .ap-sans { font-family: 'Inter', system-ui, sans-serif; }
      .ap-field:focus { outline: none; border-color: #B08D57; box-shadow: 0 0 0 3px rgba(176,141,87,0.18); }
    `}</style>
  );

  if (!userVerified) {
    return (
      <div className="absolute w-full top-0 h-full flex items-center justify-center bg-[#030014] px-4">
        {fontImport}
        <div className="ap-sans w-full max-w-md bg-[#F6F1E7] border-l-4 border-[#B08D57] rounded-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] p-8 text-center">
          <p className="ap-serif text-[#8C2E27] text-2xl mb-2">Access denied</p>
          <p className="text-[#4A4636] text-sm leading-relaxed mb-6">
            You need a verified email before you can add papers to the archive.
          </p>
          <button
            onClick={() => router("/Profile")}
            className="ap-sans bg-[#030014] hover:bg-[#1C2740] transition-colors text-[#F6F1E7] text-sm font-medium px-6 py-2.5 rounded-sm"
          >
            Verify your email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-sans min-h-screen bg-[#030014] bg-[radial-gradient(circle_at_20%_20%,#141B2E,transparent_45%)] relative">
      <div className="flex min-h-screen justify-center items-center px-4 py-10">
        {fontImport}

        <div className="w-full max-w-2xl bg-[#F6F1E7] border border-[#DCD1B8] border-l-4 border-l-[#B08D57] rounded-sm shadow-[0_25px_60px_-20px_rgba(0,0,0,0.65)] px-8 py-8 sm:px-10 sm:py-10">
          <div className="mb-8 pb-6 border-b border-[#DCD1B8]">
            <h1 className="ap-serif text-[#171A21] text-[28px] sm:text-[32px] leading-tight">
              Add a paper to the archive
            </h1>
            <p className="text-[#6B6455] text-sm mt-2 max-w-md">
              Contributed papers help other students at your college find past material faster.
              Fill in the details below and attach the paper along with a preview image.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[#4A4636] text-xs font-medium mb-1.5">College</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="ap-field w-full bg-[#FBF8F1] text-[#171A21] border border-[#DCD1B8] rounded-sm px-3.5 py-2.5 text-sm transition-shadow"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[#4A4636] text-xs font-medium mb-1.5">Course</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="ap-field w-full bg-[#FBF8F1] text-[#171A21] placeholder:text-[#A79E88] border border-[#DCD1B8] rounded-sm px-3.5 py-2.5 text-sm transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[#4A4636] text-xs font-medium mb-1.5">Semester</label>
                <input
                  type="text"
                  placeholder="1–10"
                  value={semester}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^(10|[1-9])?$/.test(val)) {
                      setSemester(val);
                    }
                  }}
                  inputMode="numeric"
                  className="ap-field w-full bg-[#FBF8F1] text-[#171A21] placeholder:text-[#A79E88] border border-[#DCD1B8] rounded-sm px-3.5 py-2.5 text-sm transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#4A4636] text-xs font-medium mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="e.g. Data Structures and Algorithms"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="ap-field w-full bg-[#FBF8F1] text-[#171A21] placeholder:text-[#A79E88] border border-[#DCD1B8] rounded-sm px-3.5 py-2.5 text-sm transition-shadow"
              />
            </div>

            <div>
              <label className="block text-[#4A4636] text-xs font-medium mb-1.5">
                Short description <span className="text-[#A79E88] font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="What does this paper cover — mid-sem, end-sem, a particular unit?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="ap-field w-full bg-[#FBF8F1] text-[#171A21] placeholder:text-[#A79E88] border border-[#DCD1B8] rounded-sm px-3.5 py-2.5 text-sm transition-shadow resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="border border-dashed border-[#C7BA98] rounded-sm px-4 py-3.5 bg-[#FBF8F1]/50">
                <p className="text-[#171A21] text-sm font-medium mb-0.5">Paper file</p>
                <p className="text-[#A79E88] text-xs mb-2.5">PDF or Word document</p>
                <label
                  htmlFor="file-input"
                  className="inline-block cursor-pointer text-xs font-medium text-[#8C6F3F] border border-[#B08D57] rounded-sm px-3 py-1.5 hover:bg-[#B08D57] hover:text-[#F6F1E7] transition-colors"
                >
                  {file ? "Change file" : "Choose file"}
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {file && <p className="text-[#4A4636] text-xs mt-2 truncate">{file.name}</p>}
              </div>

              <div className="border border-dashed border-[#C7BA98] rounded-sm px-4 py-3.5 bg-[#FBF8F1]/50">
                <p className="text-[#171A21] text-sm font-medium mb-0.5">Preview image</p>
                <p className="text-[#A79E88] text-xs mb-2.5">Shown on the paper listing</p>
                <label
                  htmlFor="preview-input"
                  className="inline-block cursor-pointer text-xs font-medium text-[#8C6F3F] border border-[#B08D57] rounded-sm px-3 py-1.5 hover:bg-[#B08D57] hover:text-[#F6F1E7] transition-colors"
                >
                  {previewImage ? "Change image" : "Choose image"}
                </label>
                <input
                  id="preview-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPreviewImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {previewImage && <p className="text-[#4A4636] text-xs mt-2 truncate">{previewImage.name}</p>}
              </div>
            </div>

            {submitMsg && (
              <div
                className={
                  "border-l-4 rounded-sm px-4 py-2.5 text-sm " +
                  (isSuccess
                    ? "border-[#3F7D58] bg-[#3F7D58]/10 text-[#2E5C41]"
                    : "border-[#B23A34] bg-[#B23A34]/10 text-[#8C2E27]")
                }
              >
                {submitMsg}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ap-sans bg-[#030014] hover:bg-[#1C2740] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#F6F1E7] text-sm font-medium px-7 py-2.5 rounded-sm"
              >
                {isSubmitting ? "Submitting…" : "Submit paper"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="absolute bottom-0 left-0 right-0 text-center py-2 text-[#5B6172] text-xs bg-[#030014]">
        Thank you for contributing to the archive.
      </p>
    </div>
  );
}