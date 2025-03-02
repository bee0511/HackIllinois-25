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
    const result = await response.json();
    console.log(result);
    // parse the result, result has the Event, HP, DEF, ATK

    const { Event, HP, DEF, ATK, ret } = result;
    console.log('Event:', Event);
    console.log('HP:', HP);
    console.log('DEF:', DEF);
    console.log('ATK:', ATK);
    console.log('ret:', ret);
    // return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}
