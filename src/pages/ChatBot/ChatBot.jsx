import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const ChatBot = (props) => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(true);

  // Initialize chat with a message when the component mounts
  useEffect(() => {
    setChatHistory([
      {
        type: "bot",
        text: props.gptMessage,
      },
    ]);
    setIsSubmitted(true);
  }, []);

  const sendToChatBot = async () => {
    console.log("bot", props.prompt);

    const prompt = "" + props.prompt;
    console.log(prompt);
    try {
      const response = await axios.post("http://localhost:8000/ask", {
        prompt: prompt,
      });

      setChatHistory([...chatHistory, { type: "bot", text: response.data }]);

      setUserInput("");
    } catch (error) {
      console.log("Error:", error);
    }

    setIsSubmitted(false);
  };

  const [showChatBot, setShowChatBot] = useState(true);

  const closeChatbot = () => {
    setShowChatBot(false);
  };

  return (
    <div className="chatbot-container">
      {showChatBot && (
        <>
          <div className="chat-header">
            ChatBot
            <CloseOutlinedIcon onClick={closeChatbot} />
          </div>
          <div className="chat-history">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            {isSubmitted && (
              <button className="chat-send-button" onClick={sendToChatBot}>
                Send
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;
