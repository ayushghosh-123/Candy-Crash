import { useEffect, useState } from "react"

const width = 8
const Candycolor = ['blue','green', 'orange', 'purple', 'red', 'yellow']




const App = () => {
  const [colorArrangment, setcolorArrangment] = useState([])

  const checkForColumnOfThree = () => {
    for(let i=0; i<47; i++){
      const colomThree = [i, i+width, i+width*2]
      const decidedColor = colorArrangment[i]
    }
  }

    const createBord = () => {
      const randomColorArrangement = []
      for(let i = 0; i<width*width ; i++){
        const randomColor = Candycolor[Math.floor(Math.random() * Candycolor.length)]
        randomColorArrangement.push(randomColor)
      }
      setcolorArrangment(randomColorArrangement)
    }
    
    useEffect(() => {
      createBord()
    }, [])

    console.log(colorArrangment)

  return (
    <>
      <div className="app ">
        <div className="game">
          {colorArrangment.map((Candycolor, index) =>(
            <img
              key={index} 
              style={{backgroundColor: Candycolor}}
              alt={Candycolor}/>
          ))}
        </div>
        
      </div>
    </>
  )
}

export default App
