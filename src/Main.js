import { BrowserRouter,Routes,Route,Link } from "react-router-dom";
import App from "./App";
import Create from "./Create";
import Game from "./Game";
import Join from "./Join";
function Main()
{
    return(
        <BrowserRouter>
            <Routes>
            <Route path='/' element={<App/>}></Route>
            <Route path='/create' element={<Create/>}></Route>
            <Route path='/game' element={<Game/>}></Route>
            <Route path='/join' element={<Join/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}
export default Main;