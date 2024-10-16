'use client';

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3002', {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('message', (data: string) => {
      console.log('Received message:', data); // Log incoming messages
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on('reply', (data: { message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      console.log('Sending message:', message); // Log the message being sent
      socket.emit('newMessage', message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Chat Room</h1>

      <div className="w-full max-w-md p-4 bg-white rounded shadow">
        {/* Chat Display */}
        <div className="h-64 overflow-y-auto mb-4 p-2 bg-gray-200 rounded">
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <div key={idx} className="text-sm mb-1">
                {msg}
              </div>
            ))
          ) : (
            <div className="text-gray-500 w-full items-center flex justify-center text-sm">
              No messages yet.
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow p-2 border rounded-l-lg focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
