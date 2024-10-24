import React from 'react'
import Hero from '../../Components/Hero/Hero'
import Navbar from '../../Components/Navbar/Navbar'
import Team from '../../Components/Team/Team'
import Footer from '../../Components/Footer/Footer';

function About() {
  return (
    <div>
       <Navbar/>
        <Hero title="About " imageUrl={"https://res.cloudinary.com/demo/image/upload/flower.jpg"}/>
        <Team/>
        <br/>
        <br/>
        <br/>
        <Footer/>
    </div>
  )
}

export default About