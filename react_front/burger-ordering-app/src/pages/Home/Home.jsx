import React from 'react';
 // Import local CSS file

import { Banner } from "../../components/nav/Banner"
import { AboutDetails } from "../../components/nav/AboutDetails"
import { Menu } from "../../components/nav/Menu"
import { Reviews } from "../../components/nav/Reviews"
import { Contacts } from "../../components/nav/Contacts"
const Home =()=>{
    return(
        <>
        <Banner/>
        <AboutDetails/>
        <Menu/>
        <Reviews/>
        <Contacts/>
        </>
    )
}

export default Home