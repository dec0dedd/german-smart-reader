import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [translations, setTranslations] = useState([]);
  const [text, setText] = useState("");
  const [articles, setArticles] = useState([]);
  const [dictionary, setDictionary] = useState({});
  const [examples, setExamples] = useState([]);

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "de-DE";
      speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech not supported in this browser.");
    }
  };

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const response = await fetch("german_english.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDictionary(data);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      }
    };
    fetchDictionary();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("dw_articles.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  const fetchExamples = async (word) => {
    try {
      const response = await fetch("word_examples.json"); // Make sure the file is in `public/`
      const data = await response.json();
      const lowerWord = word.toLowerCase();  // all dictionary keys are lowercase
      setExamples(data[lowerWord] || []);
    } catch (error) {
      console.error("Error fetching examples:", error);
      setExamples([]);
    }
  };

  const handleWordClick = (word) => {
    const lowerWord = word.toLowerCase().normalize("NFC");
    try {
      const translation = dictionary[lowerWord] || "No translation found";
      setTranslations([{ word, translation }]);
      fetchExamples(lowerWord);
    } catch(error) {
      console.error("Could not find word:", error);
    }
  };

  const handleArticleClick = (content) => {
    setText(content);
  };  

  return (
    <div className="container">
      <div className="text-container">
        <textarea
          className="text-input"
          placeholder="Enter German text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="text-display" lang="de">
          {text.split(/([^\p{L}\p{M}]+)/gu).map((segment, index) =>
            /\p{L}/u.test(segment) ? (
              <span
                key={index}
                className="clickable-word"
                onClick={() => handleWordClick(segment)}
              >
                {segment}
              </span>
            ) : (
              <span key={index}>{segment}</span>
            )
          )}
        </div>
        <div className="article-list">
          <h3>Wähle einen Artikel:</h3>
          {articles.map((article, index) => (
            <button
              key={index}
              className="article-button"
              onClick={() => handleArticleClick(article.content)}
            >
              {article.title}
            </button>
          ))}
        </div>
      </div>
      <div className="sidebar">
        <h2 className="sidebar-title">Translation</h2>
        <hr/>
        {translations.map((t, index) => (
          <div key={index} className="translation-item">
            <p className="translated-word" lang="de">{t.word}</p>
            <hr/>
            <p className="translated-text">{t.translation}</p>
            <hr/>
            <button className="speak-button" onClick={() => speakWord(t.word)}>🔊</button>
          </div>
        ))}

        <hr/>

        <h3>Example Usage</h3>
        {examples.length > 0 ? (
          <div className="example-container">
            <ul>
              {examples.slice(0, 4).map(([de, en], index) => (
                <li key={index} style={{ paddingBottom: index === examples.slice(0, 4).length - 1 ? '10px' : '0' }}>
                  <p><strong>DE:</strong> {de}</p>
                  <p><strong>EN:</strong> {en}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No examples found</p>
        )}
      </div>
    </div>
  );
}

export default App;