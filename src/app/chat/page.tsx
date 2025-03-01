'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      model: "Qwen/Qwen2.5-VL-72B-Instruct",
      messages: [
        {
          role: "system",
          content: `
    You are a game master for a role-playing game. Your role is to set the scene and determine the events based on player input. After each dialogue, you should update the player's character attributes (HP, DEF, ATK) and output your response in JSON format.
     
    The JSON response should include the following keys:
    - "scene": A description of the current scenario.
    - "event": A description of the event that just happened.
    - "stats": An object containing the character's updated stats, e.g. { "HP": number, "DEF": number, "ATK": number }.
    - "narrative": (Optional) Any additional narrative or instructions.
    
    Make sure the JSON is valid and contains no additional text.
          `.trim()
        },
        {
          role: "user",
          content: `
    You are a game master for a role-playing game. Your role is to set the scene and determine the events based on player input. After each dialogue, you should update the player's character attributes (HP, DEF, ATK) and output your response in JSON format.
     
    The JSON response should include the following keys:
    - "scene": A description of the current scenario.
    - "event": A description of the event that just happened.
    - "stats": An object containing the character's updated stats, e.g. { "HP": number, "DEF": number, "ATK": number }.
    - "narrative": (Optional) Any additional narrative or instructions.
    
    Make sure the JSON is valid and contains no additional text.
          `.trim() + ", and the following is the user input:" + prompt
        }
      ],
      temperature: 0.1,
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
      const result = await response.text();
      setResponse(result);
    } 
    catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h1>OpenAI Integration with Next.js</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <button type="submit">Generate</button>
      </form>
      {response && <div><h2>Response:</h2><p>{response}</p></div>}
    </div>
  );
}