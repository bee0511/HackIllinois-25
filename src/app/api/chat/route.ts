import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { model, messages, temperature, course_name, stream, api_key, retrieval_only } = await request.json();
  
  const url = "https://uiuc.chat/api/chat-api/chat";
  const headers = {
    'Content-Type': 'application/json',
  };
  const data = {
    model,
    messages,
    temperature,
    course_name,
    stream,
    api_key,
    retrieval_only,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    const result = await response.text();
    return new Response(result, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}
