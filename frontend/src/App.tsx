import React, { useEffect, useRef, useState } from 'react';
import { CanvasPixels, IncomingMessage, PixelsApi } from '../types';

function App() {
  const [pixels, setPixels] = useState<CanvasPixels[]>([
    {
      x: '',
      y: '',
    },
  ]);
  const [state, setState] = useState<PixelsApi>({
    x: '',
    y: '',
  });

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/canvas');
    ws.current.onclose = () => console.log('ws closed');
    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (decodedMessage.type === 'NEW_PIXELS') {
        setPixels((prev) => [...prev, decodedMessage.payload]);
      }
    };
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ws.current) return;

    ws.current.send(
      JSON.stringify({
        type: 'SET_PIXELS',
        payload: state,
      }),
    );

    setState({ x: '', y: '' });
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        const lastCoordinates = pixels.at(-1);
        if (lastCoordinates) {
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(Number(lastCoordinates.x), Number(lastCoordinates.y));
          context.closePath();
          context.stroke();
        }
        // for (const pixel of pixels) {

        // }
      }
    }
  }, [pixels]);

  return (
    <div className="App">
      <canvas ref={canvasRef} id="myCanvas" width="200" height="100" style={{ border: '1px solid #000000' }}></canvas>
      <div>
        <form onSubmit={submitFormHandler}>
          <input
            type="number"
            name="x"
            value={state.x}
            onChange={inputChangeHandler}
            placeholder="Введите пикслели по горизонтали"
          />
          <input
            type="number"
            name="y"
            value={state.y}
            onChange={inputChangeHandler}
            placeholder="Введите пикслели по вертикали"
          />

          <button type="submit" value="Enter Chat">
            Add new pixels
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
