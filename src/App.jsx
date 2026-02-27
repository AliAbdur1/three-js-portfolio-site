import { useState } from 'react'
import  Main_scroll from './components/Main_scroll'
import './App.css'

function App() {
  

  return (
    <>
      <Main_scroll />

      <section className="section">
        <h1>My Portfolio</h1>
      </section>

      <section className="section">
        <h2>My Projects</h2>
      </section>

      <section className="section">
        <h2>Contact Me</h2>
      </section>
    </>
  )
}

export default App
