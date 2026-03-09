import axios from "./axios";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const askAI = async (messages: Message[]) => {
  const res = await axios.post("/user/tips/ask", { messages });
  return res.data.text;
};