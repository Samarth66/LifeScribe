import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatBot.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const ChatBot = (props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setChatHistory([
      {
        type: "bot",
        text: props.gptMessage,
      },
    ]);
  }, [props.gptMessage]);

  const sendToChatBot = async () => {
    const prompt = "" + props.prompt;
    console.log("Send button clicked");
    setIsSubmitted(true); // Start the loading process.
    setUserInput(""); // Clear the chat message input.
    setChatHistory([]); // Clear chat history.

    try {
      const response = await axios.post(`${apiBaseUrl}/ask`, {
        prompt: prompt,
      });

      setChatHistory([{ type: "bot", text: response.data }]); // Set chat history to just the bot's response.
    } catch (error) {
      console.log("Error:", error);
    }

    setIsSubmitted(false); // End the loading process.
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
            {isSubmitted ? (
              <div className="spinner"></div>
            ) : (
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
