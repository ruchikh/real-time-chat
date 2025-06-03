'use client';

import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // On connection
    socket.on('connect', () => {
      console.log('Socket connected, id:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // On receiving a message
    socket.on('message', (msg: string) => {
      console.log('[message received]', msg);
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, []);

  console.log(messages, 'messages')

  const joinRoom = () => {
    if (username.trim() && room.trim()) {
      console.log(`[joining room] ${room} as ${username}`);
      socket.emit('join', { username, room });
      setJoined(true);
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', { room, username, message: input });
      setInput('');
    }
  };

  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Join Chat Room</h2>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          style={{ padding: 8, marginRight: 10 }}
        />
        <input
          value={room}
          onChange={e => setRoom(e.target.value)}
          placeholder="Room name"
          style={{ padding: 8, marginRight: 10 }}
        />
        <button onClick={joinRoom} style={{ padding: 8 }}>Join</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Room: {room}, {username}</h2>
      <div style={{
        height: 300,
        overflowY: 'scroll',
        border: '1px solid #ccc',
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: '10px'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '8px' }}>{msg}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message"
        style={{ padding: 8, width: '80%' }}
      />
      <button onClick={sendMessage} style={{ padding: 8, marginLeft: 10 }}>Send</button>
    </div>
  );
}
