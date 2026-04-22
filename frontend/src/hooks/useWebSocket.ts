'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from "@clerk/nextjs";

export function useWebSocket() {
  const { user } = useUser();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Use ws:// for local HTTP or wss:// for HTTPS in production
    const wsUrl = `ws://localhost:8000/ws/notifications/`;
    
    let ws: WebSocket;
    
    const connect = () => {
      ws = new WebSocket(`${wsUrl}?user_id=${user.id}`);
      
      ws.onopen = () => {
        setIsConnected(true);
        console.log('Connected to Pulse-Aid Real-time Engine');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
          
          // Optionally trigger native notifications
          if (Notification.permission === 'granted') {
            new Notification('Emergency Alert', {
              body: data.message || 'New emergency nearby',
              icon: '/favicon.ico'
            });
          }
        } catch (err) {
          console.error("Failed to parse message", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('Disconnected. Retrying in 3s...');
        // Basic reconnect logic
        setTimeout(connect, 3000);
      };
      
      ws.onerror = (err) => {
        console.error("WebSocket error", err);
      };

      setSocket(ws);
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [user]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
    }
  }, []);

  return { isConnected, messages, requestNotificationPermission };
}
