import { useEffect, useState } from 'react'
import popcorn from "./assets/popcorn.svg"
import { CharacterTextSplitter } from "langchain/text_splitter"
import { openai, supabase } from "./config.jsx"

function App() {
  const [favMovie, setFavMovie] = useState("")
  const [mood, setMood] = useState("")
  const [type, setType] = useState("")
  const [page, setPage] = useState(false)
  const [response, setResponse] = useState("")
  const [movieTitle, setMovieTitle] = useState("")






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

  // useEffect(()=>{
  //   console.log(response)
  // }, [response])
  
  useEffect(()=>{
    console.log(movieTitle)
  }, [movieTitle])

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
    content: "You are an enthusiant in movies. I have developed a similarity vector and have retreived a movie accordingly based on the users inputs and preferences. The text you receive will actually container the users prefences and it will be followed after the phrase 'Preferences:'. I want you to explain why this film best suits their desires. Do not explicitly state their desires, and then explain how the movie meets it. Just be natural and make it flow well. Make it 3 sentences max, but make it brilliant"
      
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
      match_count: 1,
    })

    console.log(data)

    const holder = []

    for (const movie of data){
      if (!holder.includes(movie.content)){
        holder.push(movie.content)
      }
      setMovieTitle(movie.content.slice(0, movie.content.indexOf(":")))
    }

    const movies = holder.join("+")
    // console.log(movies)

    chatMessages.push({role: "user", content: `Movies:${movies} Preferences:${input} `})
    console.log("Here are the chat messages", chatMessages[1].content)

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: chatMessages,
    })

    setMood(()=> "")
    setType(()=> "")
    setFavMovie(()=> "")

    console.log("Here is the completion", completion)
    
    setResponse(()=> completion.choices[0].message.content)

    setPage(() => false)

  }

  










  return (
    <>
      {page &&
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
      }

      {!page &&
        <>
          <div id="main-page-response">
            <div id="header-container">
                <img src={popcorn}/>
                <h1 id="title">PopChoice</h1>
            </div>

            <div id="response">
              <h1 id="movie-title">{movieTitle}</h1>
              <p>{response}</p>
              <button onClick={(()=>setPage(true))}>Go Again</button>
            </div>
          </div>



        </>

      }


    </>
  )
}

export default App




//Mission impossible because its fun
//Wanna watch something new
//Wanna have fun