import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

function Create() {
  const navigate = useNavigate();
  const [code, setCode] = useState(0);
  const socket = io('http://localhost:3001');
  let x = 0;

  useEffect(() => {
    x = localStorage.getItem('code');
    setCode(x);
    socket.emit('create_room', x);
    socket.on('room_status', (data) => {
      if (data === true) {
        navigate('/game');
      }
    });
  }, [navigate, socket]);

  return (
    <>
      <p>ROOM CODE: {code}</p>
    </>
  );
}

export default Create;
