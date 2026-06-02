import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { env } from "../config/env";

export function useSocketData(eventName: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const socket = io(env.socketUrl, { withCredentials: true });

    socket.on(eventName, (newData) => {
      setData(newData);
    });

    return () => {
      socket.disconnect();
    };
  }, [eventName]);

  return data;
}