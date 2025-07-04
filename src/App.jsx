import { useEffect, useState } from 'react'
import popcorn from "./assets/popcorn.svg"
import { CharacterTextSplitter } from "langchain/text_splitter"
import { openai, supabase } from "./config.jsx"

function App() {
  const [favMovie, setFavMovie] = useState("")
  const [mood, setMood] = useState("")
  const [type, setType] = useState("")


//Vector embedding initailization utilizing openAI
  async function main(){
    const movies = await movieSelections()
    console.log(movies)
    console.log("first await done")
    await vectorEmbeddings(movies)
    console.log("done")
  }

  main()

  async function movieSelections(){
    const data = await fetch("./movies.txt")
      .then(res => res.text())
      .then(data => data)


    const textSplitter = new CharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })

    const movies = await textSplitter.createDocuments([data])
    console.log("Here are the movies", movies)

    return movies
  }

  async function vectorEmbeddings(movies){
      movies.map( async(movie) =>{
        console.log(movie)
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: movie.pageContent
        })


        const data = {
          content: movie.pageContent,
          embedding: embeddingResponse.data[0].embedding
        }

        await supabase.from('movieapp').insert(data)
    })
    
  }




  // //use effects for testing

  // useEffect(()=>{
  //   console.log(`Here is the favMovie: ${favMovie}`)
  // }, [favMovie])

  // useEffect(()=>{
  //   console.log(`Here is the mood: ${mood}`)
  // },[mood])

  // useEffect(()=>{
  //   console.log(`Here is the type: ${type}`)
  // },[type])

  



  return (
    <>
      <div id="main-page" >
        <div id="header-container">
          <img src={popcorn}/>
          <h1 id="title">PopChoice</h1>
        </div>

        <div id="questions">
          <h4 className="questions">What's your favorite movie and why?</h4>
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


