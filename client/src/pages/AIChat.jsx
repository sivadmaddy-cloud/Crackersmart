import { useState } from "react";

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "AI error");

      setMessages([
        ...newMessages,
        { role: "ai", text: data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "ai", text: "❌ Error getting response" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className=" h-150 flex flex-col bg-gray-100">
      
      {/* HEADER */}
      <div className=" text-red-600 rounded-lg   p-5 text-4xl font-bold">
        AI Assistant 🤖
        
      </div>



      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-white p-3 rounded-lg w-fit">
            Thinking...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 rounded"
        >
          Send
        </button>


        
      </div>
              {/* 👇 ADD BELOW INPUT */}
<div className=" text-sm text-center text-gray-500">
  💡Claude is AI and can make mistakes. Please double-check responses.
</div>
      
    </div>
    
  );
}

export default AIChat;