import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import popcorn from "./assets/popcorn.svg"

function App() {
  const [favMovie, setFavMovie] = useState("")
  const [mood, setMood] = useState("")
  const [type, setType] = useState("")


  function favoriteMove(){

  }




  //use effects for testing

  useEffect(()=>{
    console.log(`Here is the favMovie: ${favMovie}`)
  }, [favMovie])

  useEffect(()=>{
    console.log(`Here is the mood: ${mood}`)
  },[mood])

  useEffect(()=>{
    console.log(`Here is the type: ${type}`)
  },[type])

  



  return (
    <>
      <div id="main-page" >
        <div id="header-container">
          <img src={popcorn}/>
          <h1 id="title">PopChoice</h1>
        </div>

        <div id="questions">
          <h4 class="questions">What's your favorite movie and why?</h4>
          <textarea onChange={(e)=>setFavMovie(e.target.value)} className="text-boxes" placeholder="The Shawshank Redepmotion because it taught me to never give up hope no matter how hard life gets" rows="3" cols="50"></textarea>
          <h4 className="questions">Are you in the mood for something new or classic?</h4>
          <textarea onChange={(e)=>setMood(e.target.value)} className="text-boxes" placeholder="The Shawshank Redepmotion because it taught me to never give up hope no matter how hard life gets" rows="3" cols="50"></textarea>
          <h4 className="questions">Do you wanna have fun or do you want something serious?</h4>
          <textarea onChange={(e)=>setType(e.target.value)} className="text-boxes" placeholder="The Shawshank Redepmotion because it taught me to never give up hope no matter how hard life gets" rows="3" cols="50"></textarea>
          <button id="front-page-button">Let's Go</button>
        </div>
      </div>
    </>
  )
}

export default App


