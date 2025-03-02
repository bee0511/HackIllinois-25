'use client'
import { useState, FormEvent } from 'react';

interface Stats {
  HP: number;
  DEF: number;
  ATK: number;
}

interface HistoryItem {
  event: string;
  userInput: string;
  ret: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [stats, setStats] = useState<Stats>({ HP: 10, DEF: 10, ATK: 10 });
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newHistoryItem: HistoryItem = {
      event: "",
      userInput: prompt,
      ret: ""
    };

    const data = {
      model: "Qwen/Qwen2.5-VL-72B-Instruct",
      messages: [
        {
          role: "system",
          content: `
You are a game master for a role-playing game. Your role is to set the scene, determine events based on player input, and update the player's character attributes (HP, DEF, ATK). In addition, you are provided with a background story that you should incorporate into the scenario.
The background story need to include a challenge like fighting with a monster or stuck in somewhere, and then you ask player what will they do. They may give you interesting ideas.

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
The background story need to include a challenge like fighting with a monster or stuck in somewhere, and then you ask player what will they do. They may give you interesting ideas.
Make sure to think about challenge, so that users can think of how to solve it.

Your response must be in valid JSON format with the following keys exactly as specified:
- "Event": A description of the event that occurred, including where it happened. You need to consider the user input and generate a response based on it. Do not generate a negative event.
- "HP": The updated HP value (number).
- "DEF": The updated DEF value (number).
- "ATK": The updated ATK value (number).

Ensure the JSON is valid and contains no additional text.
Do not include the \`\`\`json\`\`\` block.
`.trim() + ". The following is the user prompt: " + prompt + " The history events is: " + history.map(h => h.event).join(", ")
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

      newHistoryItem.event = result.Event;
      newHistoryItem.ret = `HP: +${result.HP}, DEF: +${result.DEF}, ATK: +${result.ATK}`;
      setHistory([...history, newHistoryItem]);
    } 
    catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <div>
        <h2>Stats</h2>
        <p>HP: {stats.HP}</p>
        <p>DEF: {stats.DEF}</p>
        <p>ATK: {stats.ATK}</p>
      </div>
      <div>
        <h2>History</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <p><strong>User Input:</strong> {item.userInput}</p>
              <p><strong>Event:</strong> {item.event}</p>
              <p><strong>Updated Stats:</strong> {item.ret}</p>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <button type="submit">Send the message</button>
      </form>
    </div>
  );
}