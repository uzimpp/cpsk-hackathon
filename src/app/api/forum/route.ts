import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json();
    const filePath = path.join(process.cwd(), "src", "data", `${type}.json`);

    // Read existing data
    const existingData = JSON.parse(
      await fs.promises.readFile(filePath, "utf-8")
    );

    // Update data based on type
    if (type === "posts") {
      existingData.posts = data;
    } else if (type === "replies") {
      existingData.replies = data;
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
