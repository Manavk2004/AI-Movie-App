import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import popcorn from "./assets/popcorn.svg"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="main-page" >
        <div id="header-container">
          <img src={popcorn}/>
          <h1 id="title">PopChoice</h1>
        </div>

        <div id="questions">
          <h4 class="questions">What's your favorite movie and why?</h4>
          <textarea class="text-boxes" placeholder="The Shawshank Redepmotion because it taught me to never give up hope no matter how hard life gets" rows="3" cols="50"></textarea>
          <h4 class="questions">What's your favorite movie and why?</h4>
          <textarea class="text-boxes" placeholder="The Shawshank Redepmotion because it taught me to never give up hope no matter how hard life gets" rows="3" cols="50"></textarea>
          <h4 class="questions">What's your favorite movie and why?</h4>
          <textarea class="text-boxes" placeholder="The Shawshank Redepmotion because it taught me to never give up hope no matter how hard life gets" rows="3" cols="50"></textarea>
          <button id="front-page-button">Let's Go</button>
        </div>
      </div>
    </>
  )
}

export default App


