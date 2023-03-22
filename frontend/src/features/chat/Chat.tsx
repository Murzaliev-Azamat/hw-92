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
  const [usernameText, setUsernameText] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');
    ws.current.onclose = () => {
      console.log('ws closed');
      // setOnlineUsers(onlineUsers.slice(-1, 1));
    };
    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (decodedMessage.type === 'NEW_MESSAGE') {
        setMessages((messages) => [...messages, decodedMessage.payload]);
      }
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessageForUsers;

      if (decodedMessage.type === 'NEW_USER') {
        if (onlineUsers.indexOf(decodedMessage.payload) === -1) {
          setOnlineUsers((onlineUsers) => [...onlineUsers, decodedMessage.payload]);
        }
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

  const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameText(e.target.value);
  };

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const setUsername = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ws.current) return;

    ws.current.send(
      JSON.stringify({
        type: 'SET_USERNAME',
        payload: usernameText,
      }),
    );

    setLoggedIn(true);
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

  // let chat = (
  //   <div>
  //     {messages.map((message, idx) => (
  //       <div key={idx}>
  //         <b>{message.username}: </b>
  //         {message.text}
  //       </div>
  //     ))}
  //
  //     <form onSubmit={sendMessage}>
  //       <input type="text" name="messageText" value={messageText} onChange={changeMessage} />
  //       <input type="submit" value="Send" />
  //     </form>
  //   </div>
  // );
  //
  // if (!isLoggedIn) {
  //   chat = (
  //     <form onSubmit={setUsername}>
  //       <input type="text" name="username" value={usernameText} onChange={changeUsername} />
  //       <input type="submit" value="Enter Chat" />
  //     </form>
  //   );
  // }

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
          <b>{message.username}: </b>
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
