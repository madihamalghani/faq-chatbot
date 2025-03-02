import React, { useState } from "react";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input) return;

        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);

        try {
            const response = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question: input })
            });

            const data = await response.json();
            const botMessage = { text: data.answer, sender: "bot" };
            setMessages([...messages, userMessage, botMessage]);
        } catch (error) {
            console.error("Error connecting to the chatbot API:", error);
        }

        setInput("");
    };
    return (
<div className="flex items-center justify-center h-screen  p-4">
            <div className="w-full max-w-3xl h-full bg-white height rounded-2xl shadow-lg p-5 flex flex-col">
                <h3 className="text-xl font-bold text-green-600 text-center mb-4">FAQ UE Chatbot</h3>
                <div className="flex-1 overflow-y-auto border rounded-md p-3 bg-gray-100">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10 ">Start a conversation...</p>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className={`mb-2 text-sm p-2 rounded-md ${msg.sender === "user" ? "bg-green-200 text-right" : "bg-white text-left"}`}>
                                <b className={msg.sender === "user" ? "text-green-700" : "text-gray-700"}>{msg.sender === "user" ? "You" : "Bot"}:</b> {msg.text}
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-4 flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <button 
                        onClick={sendMessage} 
                        className="btn btn-success mx-2 ">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
    
};

export default Chatbot;
