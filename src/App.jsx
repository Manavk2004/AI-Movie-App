import { useEffect, useState } from 'react'
import popcorn from "./assets/popcorn.svg"
import { CharacterTextSplitter } from "langchain/text_splitter"
import { openai, supabase } from "./config.jsx"

function App() {
  const [favMovie, setFavMovie] = useState("")
  const [mood, setMood] = useState("")
  const [type, setType] = useState("")







  //use effects for testing

  // useEffect(()=>{
  //   console.log(`Here is the favMovie: ${favMovie}`)
  // }, [favMovie])

  // useEffect(()=>{
  //   console.log(`Here is the mood: ${mood}`)
  // },[mood])

  // useEffect(()=>{
  //   console.log(`Here is the type: ${type}`)
  // },[type])

  

/*--------------------------------------------SEPARATION BETWEEN VECTOR EMBEDDINGS AND REST OF CODE------------------------------------------------------------------------------------------------------------*/


//Vector embedding initailization utilizing openAI
  async function main(){
    const movies = await movieSelections()
    console.log(movies)
    console.log("first await done")
    await vectorEmbeddings(movies)
    console.log("done")
  }

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

/*--------------------------------------------SEPARATION BETWEEN VECTOR EMBEDDINGS AND REST OF CODE------------------------------------------------------------------------------------------------------------*/


  //Open ai chat completions

  let chatMessages = ([{
    role: "system",
    content: 
      "You are an ethusiast of movies and your goal is to recommend the most similar movie based on the input given. You will be given several movies and their descriptions, and then the user inputs about what they favorite movie is, what they are in the modd for, and whether they want to watch something fun or serious. The movies will be proceeded by 'Movies:' and the user preferences will be proceeded by 'Preferences:'. Also, within the Movies each movie will be separated by a '+' symbol and this will help you navigate the separate movies a bit easier. Based on the preferences, pick what movie fits best, and then provide a reasoning as to why they would like it."
  }])



  //Function for retrieving vector embeddings and resettig state

  async function inputEmbeddings(states){
    const input = states.join(",")
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002", 
      input,
    })

    const actualEmbedding = embedding.data[0].embedding

    const { data } = await supabase.rpc('match_movieapp', {
      query_embedding: actualEmbedding, 
      match_threshold: 0.5,
      match_count: 5,
    })

    const holder = []

    for (const movie of data){
      holder.push(movie.content)
    }
    // console.log(holder)
    setMood(()=> "")
    setType(()=> "")
    setFavMovie(()=> "")

    const movies = holder.join("+")
    // console.log(movies)

    chatMessages.push({role: "user", content: `Movies:${movies} Preferences:${input} `})

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: chatMessages,
    })
    
    console.log(completion.choices[0].message.content)


  }










  return (
    <>
      <div id="main-page" >
        <div id="header-container">
          <img src={popcorn}/>
          <h1 id="title">PopChoice</h1>
        </div>

        <div id="questions">
          <h4 className="questions">What's your favorite movie and why?</h4>
          <textarea value={favMovie} onChange={(e)=>setFavMovie(e.target.value)} className="text-boxes" placeholder="The Shawshank Redepmotion because it taught me to never give up hope no matter how hard life gets" rows="3" cols="50"></textarea>
          <h4 className="questions">Are you in the mood for something new or classic?</h4>
          <textarea value={mood} onChange={(e)=>setMood(e.target.value)} className="text-boxes" placeholder="Classic sounds good" rows="3" cols="50"></textarea>
          <h4 className="questions">Do you wanna have fun or do you want something serious?</h4>
          <textarea value={type} onChange={(e)=>setType(e.target.value)} className="text-boxes" placeholder="I wanna watch something serious" rows="3" cols="50"></textarea>
          <button onClick={()=>inputEmbeddings([favMovie, mood, type])} id="front-page-button">Let's Go</button>
        </div>
      </div>
    </>
  )
}

export default App




//Mission impossible because its fun
//Wanna watch something new
//Wanna have fun