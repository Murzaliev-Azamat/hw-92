import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, IncomingMessage } from '../types';
import AppToolBar from './components/UI/AppToolBar/AppToolBar';
import { Route, Routes } from 'react-router-dom';
import Register from './features/users/Register';
import Login from './features/users/Login';
import Chat from './features/chat/Chat';

function App() {
  return (
    <div className="App">
      <AppToolBar />
      <Routes>
        <Route path="/" element={<Chat />} />
        {/*<Route*/}
        {/*  path="/add-artist"*/}
        {/*  element={*/}
        {/*    <ProtectedRoute isAllowed={(user && user.role === 'admin') || (user && user.role === 'user')}>*/}
        {/*      <FormForArtists />*/}
        {/*    </ProtectedRoute>*/}
        {/*  }*/}
        {/*/>*/}
        {/*<Route path="/albums/:id" element={<Albums />} />*/}
        {/*<Route path="/add-album" element={<FormForAlbums />} />*/}
        {/*<Route path="/tracks/:id" element={<Tracks />} />*/}
        {/*<Route path="/add-track" element={<FormForTracks />} />*/}
        {/*<Route path="/tracks_history" element={<TracksHistory />} />*/}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<span>Такой страницы не существует</span>} />
      </Routes>
    </div>
  );
}

export default App;
