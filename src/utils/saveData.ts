import fs from "fs";
import path from "path";

export async function saveToJson(data: any, filename: string) {
  try {
    const filePath = path.join(process.cwd(), "src", "data", filename);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    return false;
  }
}
