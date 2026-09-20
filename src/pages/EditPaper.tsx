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

  const fontImport = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap');
      .ap-serif { font-family: 'Source Serif 4', Georgia, serif; }
      .ap-sans { font-family: 'Inter', system-ui, sans-serif; }
      .ap-field:focus { outline: none; border-color: #B08D57; box-shadow: 0 0 0 3px rgba(176,141,87,0.18); }
    `}</style>
  );

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
      (document.getElementById("file-input") as HTMLInputElement).value = "";
      (document.getElementById("preview-input") as HTMLInputElement).value = "";

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
      <div className="ap-sans min-h-screen bg-[#0B1220] flex justify-center items-center">
        {fontImport}
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#2A3552] border-t-[#B08D57]"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="ap-sans min-h-screen bg-[#0B1220] flex justify-center items-center px-4">
        {fontImport}
        <div className="bg-[#F6F1E7] border-l-4 border-[#B23A34] rounded-sm px-8 py-7 text-center max-w-sm">
          <p className="ap-serif text-[#171A21] text-lg mb-1">Paper not found</p>
          <p className="text-[#6B6455] text-sm">This paper could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-sans min-h-screen bg-[#0B1220] bg-[radial-gradient(circle_at_20%_20%,#141B2E,transparent_45%)] relative">
      <div className="flex min-h-screen justify-center items-center px-4 py-10">
        {fontImport}

        <div className="w-full max-w-xl bg-[#F6F1E7] border border-[#DCD1B8] border-l-4 border-l-[#B08D57] rounded-sm shadow-[0_25px_60px_-20px_rgba(0,0,0,0.65)] px-8 py-8 sm:px-10 sm:py-10">
          <div className="mb-8 pb-6 border-b border-[#DCD1B8]">
            <h1 className="ap-serif text-[#171A21] text-[28px] sm:text-[32px] leading-tight">Edit paper</h1>
            <p className="text-[#6B6455] text-sm mt-2 max-w-md">
              Update the details below. You can leave the file or preview image
              unchanged unless you want to replace them.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[#4A4636] text-xs font-medium mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="Subject"
                value={paper.subject}
                onChange={(e) => setPaper({ ...paper, subject: e.target.value })}
                className="ap-field w-full bg-[#FBF8F1] text-[#171A21] placeholder:text-[#A79E88] border border-[#DCD1B8] rounded-sm px-3.5 py-2.5 text-sm transition-shadow"
              />
            </div>

            <div>
              <label className="block text-[#4A4636] text-xs font-medium mb-1.5">
                Short description <span className="text-[#A79E88] font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="Short description"
                value={paper.description}
                onChange={(e) => setPaper({ ...paper, description: e.target.value })}
                rows={3}
                className="ap-field w-full bg-[#FBF8F1] text-[#171A21] placeholder:text-[#A79E88] border border-[#DCD1B8] rounded-sm px-3.5 py-2.5 text-sm transition-shadow resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="border border-dashed border-[#C7BA98] rounded-sm px-4 py-3.5 bg-[#FBF8F1]/50">
                <p className="text-[#171A21] text-sm font-medium mb-0.5">New paper file</p>
                <p className="text-[#A79E88] text-xs mb-2.5">Optional — PDF or Word document</p>
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
                <p className="text-[#171A21] text-sm font-medium mb-0.5">New preview image</p>
                <p className="text-[#A79E88] text-xs mb-2.5">Optional — shown on the listing</p>
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
                onClick={handleUpdate}
                disabled={!hasChanged || isSubmitting}
                className="ap-sans bg-[#0B1220] hover:bg-[#1C2740] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[#F6F1E7] text-sm font-medium px-7 py-2.5 rounded-sm"
              >
                {isSubmitting ? "Updating…" : "Update paper"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}