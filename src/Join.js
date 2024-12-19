import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

function Join() {
  const socket = io('http://localhost:3001'); 
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setCode(event.target.value);
  };

  const verify = () => {
    socket.emit('join_room', code);
  };

  useEffect(() => {
    socket.on('room_status', (data) => {
      if (data === true) {
        navigate('/game'); 
      } else {
        alert("Room doesn't exist.");
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [navigate, socket]);

  return (
    <>
      <input
        type="text"
        value={code}
        onChange={handleInputChange}
        placeholder="Enter Room Code"
      />
      <button onClick={verify}>Enter Code!</button>
    </>
  );
}

export default Join;

