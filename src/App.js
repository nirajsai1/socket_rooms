import { useNavigate } from "react-router-dom";
import Create from "./Create";
import Join from "./Join";
function App()
{
  const navigate = useNavigate();
  const navv=useNavigate();
  const csf = () =>
  {
    let s=0;
    for(let i=0;i<=5;i++)
    {
      let x=Math.floor(Math.random()*10);
      s=s*10+x;
    }
    localStorage.setItem('code',s);
    navigate('/create');
  }
  const cjf = () =>
  {
    navv('/join');
  }
  return(
    <>
    <button onClick={csf}> Create </button>
    <button onClick={cjf}> Join</button>
    </>
  );
}
export default App;
