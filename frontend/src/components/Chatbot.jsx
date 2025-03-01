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
        <div style={{ width: "400px", margin: "auto", textAlign: "center", border: "1px solid black", padding: "10px" }}>
            <h3>FAQ Chatbot</h3>
            <div style={{ height: "200px", overflowY: "scroll", border: "1px solid gray", padding: "10px" }}>
                {messages.map((msg, i) => (
                    <p key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                        <b>{msg.sender === "user" ? "You" : "Bot"}:</b> {msg.text}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chatbot;
