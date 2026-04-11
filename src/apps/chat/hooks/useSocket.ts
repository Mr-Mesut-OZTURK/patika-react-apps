import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { AnyMessage, ChatMessage, ChatUser } from "../types";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3001";

export const useSocket = (username: string) => {
  const [messages, setMessages] = useState<AnyMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [mySocketId, setMySocketId] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!username) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setMySocketId(socket.id ?? "");
      socket.emit("join", { username });
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setUsers([]);
    });

    socket.on("connect_error", () => {
      setConnected(false);
    });

    socket.on("message", (msg: Omit<ChatMessage, "type">) => {
      setMessages((prev) => [...prev, { ...msg, type: "message" }]);
    });

    socket.on(
      "user_joined",
      ({ username: u, at }: { username: string; at: number }) => {
        setMessages((prev) => [
          ...prev,
          { id: `join-${at}-${u}`, type: "join", username: u, at },
        ]);
      },
    );

    socket.on(
      "user_left",
      ({ username: u, at }: { username: string; at: number }) => {
        setMessages((prev) => [
          ...prev,
          { id: `leave-${at}-${u}`, type: "leave", username: u, at },
        ]);
      },
    );

    socket.on("user_list", (list: ChatUser[]) => {
      setUsers(list);
    });

    socket.on("typing", ({ username: u }: { username: string }) => {
      setTypingUsers((prev) => (prev.includes(u) ? prev : [...prev, u]));
    });

    socket.on("stop_typing", ({ username: u }: { username: string }) => {
      setTypingUsers((prev) => prev.filter((x) => x !== u));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [username]);

  const sendMessage = useCallback((text: string) => {
    socketRef.current?.emit("message", { text });
  }, []);

  const emitTyping = useCallback((isTyping: boolean) => {
    socketRef.current?.emit(isTyping ? "typing" : "stop_typing");
  }, []);

  return {
    messages,
    users,
    connected,
    typingUsers,
    sendMessage,
    emitTyping,
    mySocketId,
  };
};
