
import React, { useState } from "react";
import "./App.css";

function App() {
  const [translations, setTranslations] = useState([]);

  const handleWordClick = async (word) => {
    try {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://linguee-api.fly.dev/api/v2/translations?query=${word}&src=de&dst=en&guess_direction=false&follow_corrections=never`
        )}`
      );
      const data = await response.json();
      const result = JSON.parse(data.contents);

      if (result && result.translations && result.translations.length > 0) {
        setTranslations([{ word, translation: result.translations[0] }]);
      } else {
        setTranslations([{ word, translation: "No translation found" }]);
      }
    } catch (error) {
      console.error("Error fetching translation:", error);
      setTranslations([{ word, translation: "Error fetching translation" }]);
    }
  };

  return (
    <div className="container">
      <div className="text-container">
        <textarea
          className="text-input"
          placeholder="Enter German text here..."
        />
        <div className="text-display">
          {" "}
          {"Geben Sie hier Ihren deutschen Text ein und klicken Sie auf ein Wort.".split(" ").map((word, index) => (
            <span
              key={index}
              className="clickable-word"
              onClick={() => handleWordClick(word)}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      <div className="sidebar">
        <h2>Translation</h2>
        {translations.map((t, index) => (
          <p key={index}>
            <strong>{t.word}</strong>: {t.translation}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;

/* CSS Changes in App.css */

.container {
  display: flex;
  height: 100vh;
}

.text-container {
  flex: 3;
  padding: 20px;
}

.text-input {
  width: 100%;
  height: 150px;
  font-size: 16px;
}

.text-display {
  margin-top: 20px;
}

.clickable-word {
  cursor: pointer;
  padding: 5px;
  margin: 2px;
  display: inline-block;
  background: lightgray;
  border-radius: 5px;
  transition: background 0.2s;
}

.clickable-word:hover {
  background: darkgray;
}

.sidebar {
  flex: 1;
  background: black;
  color: white;
  padding: 20px;
  overflow-y: auto;
  min-width: 250px;
}
