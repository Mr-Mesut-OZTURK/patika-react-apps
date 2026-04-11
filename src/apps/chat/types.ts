export interface ChatMessage {
  id: string;
  type: "message";
  username: string;
  socketId: string;
  text: string;
  at: number;
}

export interface SystemMessage {
  id: string;
  type: "join" | "leave";
  username: string;
  at: number;
}

export type AnyMessage = ChatMessage | SystemMessage;

export interface ChatUser {
  socketId: string;
  username: string;
}
