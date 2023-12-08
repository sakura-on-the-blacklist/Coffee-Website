import {BrowserRouter, Route, Routes} from "react-router-dom"
import { Nav } from "../components/nav/Nav"
import Home from "../pages/Home/Home"
import About from "../pages/About/About"
import SignUp from "../pages/SignUp/SignUp"
import Login from "../pages/Login/Login"
import Menu from "../pages/Menu/Menu"
import Cart from "../pages/Cart/Cart"
import Review from "../pages/Review/Review"

const Navigation = ()=>{
    return(
    
        <BrowserRouter>
        <Nav/>
        <Routes>
            <Route path="/" element = {<Home/>}/>
            <Route path="/About" element = {<About/>}/>
            <Route path="/SignUp" element = {<SignUp/>}/>
            <Route path="/Login" element = {<Login/>}/>
            <Route path="/Cart" element = {<Cart/>}/>
            <Route path="/Menu" element = {<Menu/>}/>
            <Route path="/Review" element = {<Review/>}/>
        
        </Routes>
        </BrowserRouter>
    )
}

export default Navigation;