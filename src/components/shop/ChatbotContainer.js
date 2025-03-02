import { useState, useEffect } from "react";
import styles from "./styles/Chatbot.module.css";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const ChatbotContainer = ({ adventureName, backgroundColor, textColor }) => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ HP: 10, DEF: 10, ATK: 10 });
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMessages([{ text: `Starting your adventure...`, isBot: true }]);
  }, []);

  const sendMessage = async (message, newHistoryItem = null) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isBot: false }
    ]);

    const data = {
      model: "Qwen/Qwen2.5-VL-72B-Instruct",
      messages: [
        {
          role: "system",
          content: `
You are a game master for a role-playing game. Your role is to set the scene, determine events based on player input, and update the player's character attributes (HP, DEF, ATK). In addition, you are provided with a background story that you should incorporate into the scenario.

Your response must be in valid JSON format with the following keys exactly as specified:
- "Event": A description of the event that occurred, including where it happened. You need to consider the user input and generate a response based on it. Do not generate a negative event.
- "HP": The updated HP value (number).
- "DEF": The updated DEF value (number).
- "ATK": The updated ATK value (number).

Ensure the JSON is valid and contains no additional text. Do not include the \`\`\`json\`\`\` block.
`.trim()
        },
        {
          role: "user",
          content: `
You are a game master for a role-playing game. Your role is to set the scene, determine events based on player input, and update the player's character attributes (HP, DEF, ATK). In addition, you are provided with a background story that you should incorporate into the scenario.

Your response must be in valid JSON format with the following keys exactly as specified:
- "Event": A description of the event that occurred, including where it happened. You need to consider the user input and generate a response based on it. Do not generate a negative event.
- "HP": The updated HP value (number).
- "DEF": The updated DEF value (number).
- "ATK": The updated ATK value (number).

Ensure the JSON is valid and contains no additional text.
Do not include the \`\`\`json\`\`\` block.
`.trim() + ". The following is the user prompt: " + message + " The history events is: " + history.map(h => h.event).join(", ")
        },
      ],
      temperature: 0.6,
      course_name: "Hackillinois",
      stream: true,
      api_key: "uc_11a8b18a4e844a63b0c092e3457b0f47",
      retrieval_only: false
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      // Update stats
      const updatedStats = {
        HP: stats.HP + result.HP,
        DEF: stats.DEF + result.DEF,
        ATK: stats.ATK + result.ATK,
      };
      setStats(updatedStats);

      if (newHistoryItem) {
        newHistoryItem.event = result.Event;
        newHistoryItem.ret = `HP: +${result.HP}, DEF: +${result.DEF}, ATK: +${result.ATK}`;
        setHistory([...history, newHistoryItem]);
      }

      // Add event message to user bubble
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: result.Event, isBot: true }
      ]);
    } 
    catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message');
    }
  };

  return (
    <div className={styles.chatContainer} style={{ background: backgroundColor || "#ffffff" }}>
      <div className={styles.chatHeader}>
        <h2 style={{ color: textColor || "#ffffff" }}>Chat</h2>
        <button className={styles.backButton} onClick={() => window.location.reload()}>Back</button>
      </div>

      <div className={styles.statsContainer}>
        <p>❤️ HP: {stats.HP}</p>
        <p>🛡️ DEF: {stats.DEF}</p>
        <p>⚔️ ATK: {stats.ATK}</p>
      </div>

      <div className={styles.chatBox}>
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} isBot={msg.isBot} />
        ))}
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatbotContainer;