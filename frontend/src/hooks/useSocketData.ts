import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export function useSocketData(eventName: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const socket = io("http://localhost:3001", { withCredentials: true });

    socket.on(eventName, (newData) => {
      setData(newData);
    });

    return () => {
      socket.disconnect();
    };
  }, [eventName]);

  return data;
}