import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();
    const filePath = path.join(process.cwd(), "src", "data", `${type}.json`);

    let existingData;
    try {
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      existingData = JSON.parse(fileContent);
    } catch (readError) {
      // Initialize with proper structure based on type
      existingData = type === "posts" ? { posts: [] } : { replies: {} };
    }

    if (type === "posts") {
      // Ensure posts is an array
      if (!Array.isArray(existingData.posts)) {
        existingData.posts = [];
      }
      // Add new post
      existingData.posts.push(data);
    } else if (type === "replies") {
      // Ensure replies object exists
      if (!existingData.replies) {
        existingData.replies = {};
      }
      // Add new reply to the correct post
      const postId = data.postId;
      if (!existingData.replies[postId]) {
        existingData.replies[postId] = [];
      }
      existingData.replies[postId].push(data.reply);
    }

    // Save updated data
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(existingData, null, 2)
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { type, data } = await request.json();
    const filePath = path.join(process.cwd(), "src", "data", `${type}.json`);

    let existingData;
    try {
      const fileContent = await fs.promises.readFile(filePath, "utf-8");
      existingData = JSON.parse(fileContent);
    } catch (readError) {
      return NextResponse.json(
        { success: false, error: "Failed to read data for update" },
        { status: 500 }
      );
    }

    if (type === "posts") {
      // Ensure posts is an array
      if (!Array.isArray(existingData.posts)) {
        existingData.posts = [];
      }
      // Update post
      const postIndex = existingData.posts.findIndex(
        (post: any) => post.id === data.id
      );
      if (postIndex !== -1) {
        existingData.posts[postIndex] = {
          ...existingData.posts[postIndex],
          ...data,
        };
      }
    } else if (type === "replies") {
      // Ensure replies object exists
      if (!existingData.replies) {
        existingData.replies = {};
      }
      // Update reply
      const { postId, replyId, ...updateData } = data;
      if (existingData.replies[postId]) {
        const replyIndex = existingData.replies[postId].findIndex(
          (reply: any) => reply.id === replyId
        );
        if (replyIndex !== -1) {
          existingData.replies[postId][replyIndex] = {
            ...existingData.replies[postId][replyIndex],
            ...updateData,
          };
        }
      }
    }

    // Save updated data
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(existingData, null, 2)
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update data" },
      { status: 500 }
    );
  }
}
