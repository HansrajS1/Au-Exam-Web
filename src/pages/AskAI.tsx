import { useState, useRef, useEffect, type JSX } from "react";
import { Send, Bot, User, CornerDownLeft } from "lucide-react";
import clsx from "clsx";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "chat_messages";

const ChatMessage = ({ role, content }: Message): JSX.Element => {
  const isUser = role === "user";
  return (
    <div
      className={clsx("flex w-full items-start gap-3", isUser && "justify-end")}
    >
      {!isUser && (
        <div className="flex-shrink-0 bg-indigo-600 p-2 rounded-full">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}
      <div
        className={clsx(
          "max-w-[80%] whitespace-pre-wrap rounded-xl px-4 py-3",
          isUser ? "bg-indigo-600 text-white" : "bg-[#1e293b] text-gray-300"
        )}
      >
        {content}
      </div>
      {isUser && (
        <div className="flex-shrink-0 bg-gray-600 p-2 rounded-full">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default function AskAI(): JSX.Element {
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
            errorText = "Forbidden: You don’t have access to this model.";
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

        const updated = [
          ...newMessages,
          createAssistantMessage(`Error: ${errorText}`),
        ];
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
      const errorMessage =
        err instanceof Error ? err.message : "Network error occurred.";
      const updated = [
        ...newMessages,
        createAssistantMessage(`Error: ${errorMessage}`),
      ];
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white overflow-hidden pb-40">
      <header className="flex-shrink-0 border-b border-gray-700 bg-[#1e293b] z-10">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-center px-4 sm:px-6">
          <h1 className="text-xl font-bold">Ask AI</h1>
        </div>
      </header>

      <main
        className={clsx(
          "flex-1 overflow-y-auto scroll-smooth overscroll-contain",
          messages.length === 0 && "flex flex-col items-center justify-center"
        )}
      >
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 space-y-6">
          {messages.length === 0 && !loading ? (
            <div className="text-center text-gray-400 mt-30">
              <Bot size={48} className="mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Welcome to Ask AI</h2>
              <p className="mb-4">Start a conversation by typing below.</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <button
                  onClick={() =>
                    setInput(
                      "Summarize the key concepts of Machine Learning in CSE syllabus"
                    )
                  }
                  className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600"
                >
                  ML Concepts Summary
                </button>
                <button
                  onClick={() =>
                    setInput(
                      "Explain backpropagation algorithm in simple terms"
                    )
                  }
                  className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600"
                >
                  Backpropagation Explained
                </button>
                <button
                  onClick={() =>
                    setInput("How do I make an HTTP request in Javascript?")
                  }
                  className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600"
                >
                  HTTP request in JS
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => <ChatMessage key={idx} {...msg} />)
          )}

          {loading && (
            <div className="flex w-full items-start gap-3">
              <div className="flex-shrink-0 bg-indigo-600 p-2 rounded-full">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="max-w-[80%] whitespace-pre-wrap rounded-xl bg-[#1e293b] px-4 py-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                  <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                  <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="mx-auto flex max-w-3xl items-end content-center gap-2 p-2 sm:p-4"
        >
          <div className="relative flex align-center content-center w-full gap-2">
            <button
              onClick={resetChat}
              className="rounded-md bg-indigo-600 rounded-full h-15 p-2 mt-2.5  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              New Chat
            </button>
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
              placeholder="Type your question..."
              className="w-full resize-none rounded-lg border h-20 border-gray-600 bg-[#0f172a] p-3 pr-20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 scrollbar-hide"
              style={{ maxHeight: "200px" }}
            />
            <div className="absolute bottom-2.5 right-2 text-xs text-gray-500 scrollbar-hide hidden sm:block">
              Shift + <CornerDownLeft size={12} className="inline-block" /> for
              new line
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 flex-shrink-0 mb-3.5 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-900 disabled:opacity-70"
          >
            <Send className="h-6 w-6 " />
          </button>
        </form>
      </footer>
    </div>
  );
}
