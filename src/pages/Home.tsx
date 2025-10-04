import { useAuth } from "../lib/authcontext";
import { useEffect, useState, useCallback, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { icons } from "../constants/icons";
import { images } from "../constants/images";

interface Paper {
  id: number;
  subject: string;
  previewImageUrl: string;
  fileUrl: string;
}

interface PaperDetail extends Paper {
  description: string;
  college: string;
  course: string;
  semester: number;
  userEmail: string;
}

export default function Home(): JSX.Element {
  const { userName, userVerified, userEmail } = useAuth();
  const router = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState<string>("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPaper, setSelectedPaper] = useState<PaperDetail | null>(null);
  const [userNameState, setUserNameState] = useState<string | null>(userName);
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    setUserNameState(userName);
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) setSelected(parseInt(savedAvatar, 10));
    if (userVerified) fetchAllPapers();
  }, [userVerified, userName]);

  const fetchAllPapers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/papers`);
      const data = await response.json();
      const sorted = [...data].sort((a, b) => b.id - a.id);
      setPapers(sorted || []);
    } catch {
      console.error("Failed to load papers.");
    } finally {
      setLoading(false);
    }
  };

  const searchPapers = async (text: string) => {
    if (!userVerified) return;
    if (!text.trim()) {
      fetchAllPapers();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/papers/search?subject=${encodeURIComponent(text)}`);
      const data = await response.json();
      const sorted = [...data].sort((a, b) => b.id - a.id);
      setPapers(sorted);
    } catch {
      console.error("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(searchPapers, 500), [userVerified]);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const fetchPaperById = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/papers/${id}`);
      const data = await response.json();
      setSelectedPaper(data);
    } catch {
      window.alert("Failed to load paper details.");
    }
  };

  const downloadAndOpenDocument = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      window.alert("Unable to open this document.");
    }
  };

  const confirmDelete = (id?: number) => {
    if (!id) return;
    const confirmed = window.confirm("Are you sure you want to delete this paper?");
    if (confirmed) handleDelete(id);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/papers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.alert("Paper has been deleted.");
        setSelectedPaper(null);
        fetchAllPapers();
      } else {
        window.alert("Failed to delete paper.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      window.alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] mx-auto w-full px-4 pt-10 text-white relative">
      <div className="flex items-center mb-6 " >
        <div className="flex items-center min-w-[90%] mx-auto cursor-pointer" onClick={() => router("/Profile")}>
          <img
            src={selected === 1 ? images.AvatarBoy : images.AvatarGirl}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="ml-2 text-base">{userNameState || "Student"}</span>
        </div>
      </div>

      <div className="flex items-center w-[90%] mx-auto border border-gray-600 bg-[#1a1a2e] relative rounded-full mb-4">
        <input
          type="text"
          placeholder="Search Subject"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-[#1a1a2e] w-full text-white px-4 py-2 rounded-full placeholder-gray-400"
        />
        <img src={icons.search} alt="Search" className="w-5 absolute h-5 right-0 mr-4" />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-6">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-400"></div>
        </div>
      )}

      <div className="flex flex-wrap align-center justify-center p-4 rounded-xl gap-4 mb-20">
        {papers.length > 0 ? (
          papers.map((paper) => (
            <div key={paper.id}  className="bg-[#1a1a2e] cursor-pointer flex flex-col mt-2 rounded-xl p-3 flex-wrap min-w-[30%]">
              <button onClick={() => fetchPaperById(paper.id)} className="w-full">
                <img
                  src={paper.previewImageUrl}
                  alt={paper.subject}
                  className=" h-[55vh] w-full object-contain cursor-pointer rounded-lg mb-2"
                />
                <p className="text-sm font-bold text-center">{paper.subject}</p>
              </button>
              <div className="flex justify-center mt-2">
              <button
                onClick={() => downloadAndOpenDocument(paper.fileUrl)}
                className="bg-green-600 cursor-pointer py-1.5 rounded-md p-2 mt-2 font-semibold"
              >
                Download Paper
              </button>
              </div>
            </div>
          ))
        ) : (
          !loading &&
          query && (
            <p className="text-center col-span-2 mt-4">
              No papers found starting with “{query}”
            </p>
          )
        )}
      </div>

      {!userVerified && (
        <div className="text-center mt-4">
          <p className="text-red-500">Access denied. Please verify your account.</p>
          <button
            onClick={() => router("/Profile")}
            className="bg-indigo-600 px-6 py-2 rounded mt-4 text-white"
          >
            Verify Now
          </button>
        </div>
      )}

      {selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center px-6 z-50">
          <div className="bg-[#1a1a2e] p-4 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">{selectedPaper.subject}</h2>
            <p className="text-gray-300 mb-1">College: {selectedPaper.college}</p>
            <p className="text-gray-300 mb-1">Course: {selectedPaper.course}</p>
            <p className="text-gray-300 mb-1">Semester: {selectedPaper.semester}</p>
            <p className="text-gray-300 mb-1">Uploaded by: {selectedPaper.userEmail}</p>
            <p className="text-gray-300 mb-3">{selectedPaper.description}</p>

            {selectedPaper.userEmail === userEmail && (
              <div className="flex justify-around mb-2">
                <button
                  onClick={() => {
                    setSelectedPaper(null);
                    router(`/edit-paper?paperId=${selectedPaper.id}`);
                  }}
                  className="bg-yellow-600 py-2 cursor-pointer px-4 rounded-md font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(selectedPaper.id)}
                  className="bg-red-600 py-2 px-4 cursor-pointer rounded-md font-semibold"
                >
                  Delete
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedPaper(null)}
              className="bg-blue-600 py-2 w-full cursor-pointer rounded-md font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <p className="text-center text-gray-400 mt-8 mb-0 text-sm">
        &copy; {new Date().getFullYear()} AU Exam Papers. All rights reserved.
      </p>
    </div>
  );
}
