import React from 'react'
import Hero from '../../Components/Hero/Hero'
import Navbar from '../../Components/Navbar/Navbar'
import Team from '../../Components/Team/Team'

function About() {
  return (
    <div>
        <Navbar/>
        <Hero title="About " imageUrl={"https://res.cloudinary.com/demo/image/upload/flower.jpg"}/>
        <Team/>
    </div>
  )
}

export default About