import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function Game() {
  const [result, setResult] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('result', (data) => {
      console.log('Result received:', data); 
      setResult(`${data.result} (You: ${data.yourChoice}, Opponent: ${data.opponentChoice})`);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const makeChoice = (choice) => {
    const roomCode = localStorage.getItem('code'); 
    socketRef.current.emit('player_choice', { roomcode: roomCode, choice });
  };

  return (
    <div>
      <h2>Rock, Paper, Scissors</h2>
      <p>Make your choice:</p>
      <button onClick={() => makeChoice('rock')}>Rock</button>
      <button onClick={() => makeChoice('paper')}>Paper</button>
      <button onClick={() => makeChoice('scissors')}>Scissors</button>
      <p>{result}</p>
    </div>
  );
}

export default Game;
