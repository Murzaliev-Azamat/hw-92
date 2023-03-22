import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, IncomingMessage, IncomingMessageForUsers, User } from '../../../types';
import { Container } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlise';

const Chat = () => {
  const user = useAppSelector(selectUser);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');
    ws.current.onclose = () => {
      console.log('ws closed');
      // setOnlineUsers(onlineUsers.slice(-1, 1));
    };
    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;
      console.log(decodedMessage);

      if (decodedMessage.type === 'NEW_MESSAGE') {
        console.log(decodedMessage.payload);
        setMessages((messages) => [...messages, decodedMessage.payload]);
      }
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessageForUsers;

      if (decodedMessage.type === 'NEW_USER') {
        const existingUser = onlineUsers.find((user) => user._id === decodedMessage.payload._id);
        if (existingUser) {
          return;
        }
        setOnlineUsers((onlineUsers) => [...onlineUsers, decodedMessage.payload]);
      }
    };

    // ws.current.onmessage = (event) => {
    //   const decodedMessage = JSON.parse(event.data) as IncomingMessageForUsers;
    //
    //   if (decodedMessage.type === 'DELETE_USER') {
    //     setOnlineUsers(onlineUsers.slice(-1, 1));
    //   }
    // };
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (ws.current) {
      ws.current.onopen = () => {
        if (!ws.current) return;
        ws.current.send(
          JSON.stringify({
            type: 'LOGIN',
            payload: user?.token,
          }),
        );
      };
    }
  }, [user]);

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ws.current) return;

    ws.current.send(
      JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: messageText,
      }),
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <div style={{ marginBottom: '16px', border: '1px solid black', padding: '5px' }}>
        <p>Online users:</p>
        {user ? (
          onlineUsers.map((onlineUser) => (
            <p key={onlineUser._id} style={{ margin: '0' }}>
              {onlineUser.displayName}
            </p>
          ))
        ) : (
          <div></div>
        )}
      </div>
      {messages.map((message, idx) => (
        <div key={idx}>
          <b>фыв</b>
          {message.text}
        </div>
      ))}

      <form onSubmit={sendMessage}>
        <input type="text" name="messageText" value={messageText} onChange={changeMessage} />
        <input type="submit" value="Send" />
      </form>
    </Container>
  );
};

export default Chat;
