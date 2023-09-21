import React, { useState, useEffect } from "react";
import "../loginBody/Login.css";

const LoginLeft = () => {
  const words = ["Capture", "Conquer", "Elevate"];
  const colors = ["#FF4500", "#008080", "#8B0000"];

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWord((prevWord) => {
        const currentIndex = words.indexOf(prevWord);
        const nextIndex = (currentIndex + 1) % words.length;
        setCurrentColor(colors[nextIndex]);
        return words[nextIndex];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const dynamicStyles = {
    color: currentColor,
    // Add more styles if you want
  };

  return (
    <div>
      <h2 className="heading1">Introducing</h2>
      <h1 className="heading heading2">LifeScribe</h1>
      <h1 className="heading heading3">Life Management Hub!</h1>
      <h1 className="heading">
        <span className="word animated bounceInDown" style={dynamicStyles}>
          {currentWord}
        </span>
      </h1>
      <h1 className="heading heading4">Every Moment of Your Life.</h1>
    </div>
  );
};

export default LoginLeft;
