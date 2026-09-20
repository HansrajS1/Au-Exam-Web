import { useState, useRef, useEffect, type JSX } from "react";
import { Send, CornerDownLeft } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../lib/authcontext";
import { useNavigate } from "react-router-dom";
import { images } from "../constants/images";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type AvatarChoice = "1" | "2" | "custom" | null;

const STORAGE_KEY = "chat_messages";
const AVATAR_KEY = "avatar";
const AVATAR_IMAGE_KEY = "avatarImage";

const fontImport = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap');
    .ap-serif { font-family: 'Source Serif 4', Georgia, serif; }
    .ap-sans { font-family: 'Inter', system-ui, sans-serif; }
    .ap-field:focus { outline: none; border-color: #B08D57; box-shadow: 0 0 0 3px rgba(176,141,87,0.18); }
    .ap-scrollbar::-webkit-scrollbar { width: 6px; }
    .ap-scrollbar::-webkit-scrollbar-thumb { background: #2A3552; border-radius: 3px; }
  `}</style>
);

const ChatMessage = ({
  role,
  content,
  avatarSrc,
}: Message & { avatarSrc: string | null }): JSX.Element => {
  const isUser = role === "user";
  return (
    <div className={clsx("flex w-full items-center gap-3", isUser && "justify-end")}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full border border-[#B08D57] flex items-center justify-center">
          <span className="ap-serif text-[#B08D57] text-xs">AI</span>
        </div>
      )}
      <div
        className={clsx(
          "ap-sans max-w-[80%] whitespace-pre-wrap rounded-sm px-4 py-3 text-[15px] leading-relaxed",
          isUser
            ? "bg-[#F6F1E7] text-[#171A21] border border-[#DCD1B8]"
            : "bg-[#141B2E] text-[#D7DAE3] border border-[#232B44]"
        )}
      >
        {content}
      </div>
      {isUser &&
        (avatarSrc ? (
          <img
            src={avatarSrc}
            alt="You"
            className="flex-shrink-0 h-8 w-8 rounded-full object-cover border border-[#DCD1B8]"
          />
        ) : (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#F6F1E7] flex items-center justify-center">
            <span className="ap-serif text-[#171A21] text-xs">You</span>
          </div>
        ))}
    </div>
  );
};

export default function AskAI(): JSX.Element {
  const { userVerified } = useAuth();
  const router = useNavigate();

  const [avatarChoice, setAvatarChoice] = useState<AvatarChoice>(null);
  const [customAvatarSrc, setCustomAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!userVerified) {
      console.log("Please verify your email to access this section.");
    }
  }, [userVerified, router]);

  useEffect(() => {
    const saved = localStorage.getItem(AVATAR_KEY) as AvatarChoice;
    if (saved === "1" || saved === "2") {
      setAvatarChoice(saved);
    } else if (saved === "custom") {
      const savedImage = localStorage.getItem(AVATAR_IMAGE_KEY);
      if (savedImage) {
        setAvatarChoice("custom");
        setCustomAvatarSrc(savedImage);
      }
    }
  }, []);

  const avatarSrc: string | null =
    avatarChoice === "custom"
      ? customAvatarSrc
      : avatarChoice === "1"
      ? images.AvatarBoy
      : avatarChoice === "2"
      ? images.AvatarGirl
      : null;

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Message[]) : [];
  });

  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages: Message[] = [...messages, createUserMessage(trimmed)];
    setMessages(newMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        let errorText = "Something went wrong.";
        switch (response.status) {
          case 401:
            errorText = "Unauthorized: Check your API key or login.";
            break;
          case 403:
            errorText = "Forbidden: You don't have access to this model.";
            break;
          case 429:
            errorText = "Rate limit exceeded. Please wait and try again.";
            break;
          case 423:
            errorText = "Model is temporarily locked. Try again later.";
            break;
          case 400:
            errorText = "Bad request. Please check your input.";
            break;
          default:
            errorText = `Unexpected error (${response.status})`;
        }

        const updated = [...newMessages, createAssistantMessage(`Error: ${errorText}`)];
        setMessages(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return;
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "No response.";
      const updated = [...newMessages, createAssistantMessage(reply)];
      setMessages(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Network error occurred.";
      const updated = [...newMessages, createAssistantMessage(`Error: ${errorMessage}`)];
      setMessages(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const createUserMessage = (content: string): Message => ({
    role: "user",
    content,
  });

  const createAssistantMessage = (content: string): Message => ({
    role: "assistant",
    content,
  });

  if (!userVerified) {
    return (
      <div className="ap-sans min-h-screen flex items-center justify-center bg-[#0B1220] p-4">
        {fontImport}
        <div className="w-full max-w-md bg-[#F6F1E7] border-l-4 border-[#B08D57] rounded-sm shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] p-8 text-center">
          <p className="ap-serif text-[#171A21] text-2xl mb-2">Verify your email</p>
          <p className="text-[#6B6455] text-sm leading-relaxed mb-6">
            Ask AI is available once your email has been verified.
          </p>
          <button
            onClick={() => router("/profile")}
            className="bg-[#0B1220] hover:bg-[#1C2740] transition-colors text-[#F6F1E7] text-sm font-medium px-6 py-2.5 rounded-sm"
          >
            Go to profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-sans bg-[#0B1220] bg-[radial-gradient(circle_at_80%_0%,#141B2E,transparent_50%)] h-screen text-[#D7DAE3] flex flex-col">
      {fontImport}

      <header className="flex-shrink-0 border-b border-[#232B44]">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-center px-4 sm:px-6">
          <h1 className="ap-serif text-[#F6F1E7] text-xl">Ask AI</h1>
        </div>
      </header>

      <main
        className={clsx(
          "flex-1 overflow-y-auto ap-scrollbar",
          messages.length === 0 && "flex flex-col items-center justify-center"
        )}
      >
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 space-y-6">
          {messages.length === 0 && !loading ? (
            <div className="text-center mt-10">
              <div className="mx-auto mb-5 h-12 w-12 rounded-full border border-[#B08D57] flex items-center justify-center">
                <span className="ap-serif text-[#B08D57] text-sm">AI</span>
              </div>
              <h2 className="ap-serif text-[#F6F1E7] text-2xl mb-2">Ask anything from your syllabus</h2>
              <p className="text-[#8A90A6] text-sm mb-6">Start a conversation by typing below.</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <button
                  onClick={() => setInput("Summarize the key concepts of Machine Learning in CSE syllabus")}
                  className="border border-[#2A3552] text-[#D7DAE3] px-3 py-2 rounded-sm hover:border-[#B08D57] hover:text-[#B08D57] transition-colors"
                >
                  ML concepts summary
                </button>
                <button
                  onClick={() => setInput("Explain backpropagation algorithm in simple terms")}
                  className="border border-[#2A3552] text-[#D7DAE3] px-3 py-2 rounded-sm hover:border-[#B08D57] hover:text-[#B08D57] transition-colors"
                >
                  Backpropagation explained
                </button>
                <button
                  onClick={() => setInput("How do I make an HTTP request in Javascript?")}
                  className="border border-[#2A3552] text-[#D7DAE3] px-3 py-2 rounded-sm hover:border-[#B08D57] hover:text-[#B08D57] transition-colors"
                >
                  HTTP request in JS
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => <ChatMessage key={idx} {...msg} avatarSrc={avatarSrc} />)
          )}

          {loading && (
            <div className="flex w-full items-center gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full border border-[#B08D57] flex items-center justify-center">
                <span className="ap-serif text-[#B08D57] text-xs">AI</span>
              </div>
              <div className="rounded-sm border border-[#232B44] bg-[#141B2E] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-[#B08D57] rounded-full animate-pulse [animation-delay:0ms]"></span>
                  <span className="h-1.5 w-1.5 bg-[#B08D57] rounded-full animate-pulse [animation-delay:150ms]"></span>
                  <span className="h-1.5 w-1.5 bg-[#B08D57] rounded-full animate-pulse [animation-delay:300ms]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="flex-shrink-0 border-t border-[#232B44] bg-[#0B1220] pb-4 mb-10 sm:pb-4 min-[760px]:mb-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="mx-auto flex max-w-3xl items-end gap-2 p-3 sm:p-4"
        >
          <button
            type="button"
            onClick={resetChat}
            className="flex-shrink-0 h-11 px-4 rounded-sm border border-[#2A3552] text-[#D7DAE3] text-sm font-medium hover:border-[#B08D57] hover:text-[#B08D57] transition-colors"
          >
            New chat
          </button>

          <div className="relative flex-1 flex flex-col">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your question…"
              className="ap-field w-full resize-none rounded-sm border border-[#2A3552] bg-[#141B2E] p-3 pr-10 text-[15px] text-[#F0F1F5] placeholder:text-[#5B6172] transition-shadow"
              style={{ height: "48px", maxHeight: "200px" }}
            />
            <div className="absolute bottom-2 right-3 text-xs text-[#5B6172] hidden sm:flex items-center gap-1">
              Shift + <CornerDownLeft size={12} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-sm bg-[#B08D57] hover:bg-[#96754A] text-[#0B1220] disabled:cursor-not-allowed disabled:bg-[#2A3552] disabled:text-[#5B6172] transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}