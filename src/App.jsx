import { useState } from 'react'
import Navbar from './Components/Navbar'
import Header from './Components/Header'
import Skills from './Components/Skills'
import Projects from './Components/Projects'
import Footer from './Components/Footer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Navbar></Navbar>
      <section id="home">
        <Header></Header>
      </section>

      <section id="skills">
        <Skills></Skills>
      </section>

      <section id="projects">
        <Projects></Projects>
      </section>

      <Footer></Footer>
    </div>
    )
}

export default App
