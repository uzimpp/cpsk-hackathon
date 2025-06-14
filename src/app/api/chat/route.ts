import { NextResponse } from "next/server";

const API_KEY =
  process.env.AI_API_KEY ||
  "rag_admin_dKb5HyxT2CMUxTyif-ZDZ48lOZyBmWTwejaDoQbETiA";
const API_URL = process.env.AI_API_URL || "http://localhost:8000/query";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        question: message,
        k: 5, // Number of documents to retrieve
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to get AI response");
    }

    const data = await response.json();
    return NextResponse.json({
      response: data.answer,
      documents: data.retrieved_documents,
      usage: data.usage_info,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to get AI response",
      },
      { status: 500 }
    );
  }
}
