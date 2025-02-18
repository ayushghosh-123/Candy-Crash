import {useEffect, useState} from 'react'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'


const width = 8;
const CandyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];

const App = () => {
  const [CurrentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  const checkForColumnOfFour = useCallback(() => {
    setCurrentColorArrangement((prevArrangement) => {
      const updatedArrangement = [...prevArrangement];
      let changed = false;

      for (let i = 0; i <= 39; i++) {
        const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
        const decidedColor = updatedArrangement[i];

        if (
          decidedColor &&
          columnOfFour.every((square) => updatedArrangement[square] === decidedColor)
        ) {
          columnOfFour.forEach((square) => (updatedArrangement[square] = blank));
          changed = true;
        }
      }
      return changed ? updatedArrangement : prevArrangement;
    });
  }, []);

  const checkForRowOfFour = useCallback(() => {
    setCurrentColorArrangement((prevArrangement) => {
      const updatedArrangement = [...prevArrangement];
      let changed = false;

      for (let i = 0; i < 64; i++) {
        if (i % width > width - 4) continue; // Prevent wrapping across rows

        const rowOfFour = [i, i + 1, i + 2, i + 3];
        const decidedColor = updatedArrangement[i];

        if (
          decidedColor &&
          rowOfFour.every((square) => updatedArrangement[square] === decidedColor)
        ) {
          rowOfFour.forEach((square) => (updatedArrangement[square] = " "));
          changed = true;
        }
      }
      return changed ? updatedArrangement : prevArrangement;
    });
  }, []);

  const checkForColumnOfThree = useCallback(() => {
    setCurrentColorArrangement((prevArrangement) => {
      const updatedArrangement = [...prevArrangement];
      let changed = false;

      for (let i = 0; i <= 47; i++) {
        const columnOfThree = [i, i + width, i + width * 2];
        const decidedColor = updatedArrangement[i];

        if (
          decidedColor &&
          columnOfThree.every((square) => updatedArrangement[square] === decidedColor)
        ) {
          columnOfThree.forEach((square) => (updatedArrangement[square] = " "));
          changed = true;
        }
      }
      return changed ? updatedArrangement : prevArrangement;
    });
  }, []);

  const checkForRowOfThree = useCallback(() => {
    setCurrentColorArrangement((prevArrangement) => {
      const updatedArrangement = [...prevArrangement];
      let changed = false;

      for (let i = 0; i < 64; i++) {
        if (i % width > width - 3) continue; // Prevent wrapping across rows

        const rowOfThree = [i, i + 1, i + 2];
        const decidedColor = updatedArrangement[i];

        if (
          decidedColor &&
          rowOfThree.every((square) => updatedArrangement[square] === decidedColor)
        ) {
          rowOfThree.forEach((square) => (updatedArrangement[square] = " "));
          changed = true;
        }
      }
      return changed ? updatedArrangement : prevArrangement;
    });
  }, []);

  const moveIntoSquareBelow = useCallback(() => {
    setCurrentColorArrangement((prevArrangement) => {
      const updatedArrangement = [...prevArrangement];

      for (let i = 55; i >= 0; i--) {
        if (updatedArrangement[i + width] === " ") {
          updatedArrangement[i + width] = updatedArrangement[i];
          updatedArrangement[i] = " ";
        }
      }

      for (let i = 0; i < width; i++) {
        if (updatedArrangement[i] === " ") {
          let randomNumber = Math.floor(Math.random() * CandyColors.length);
          updatedArrangement[i] = CandyColors[randomNumber];
        }
      }

      return updatedArrangement;
    });
  }, []);

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };

  const dragEnd = () => {
    if (!squareBeingDragged || !squareBeingReplaced) return;

    const dragId = parseInt(squareBeingDragged.getAttribute("data-id"));
    const replaceId = parseInt(squareBeingReplaced.getAttribute("data-id"));

    let updatedArrangement = [...CurrentColorArrangement];

    // Swap colors
    [updatedArrangement[dragId], updatedArrangement[replaceId]] = [
      updatedArrangement[replaceId],
      updatedArrangement[dragId],
    ];

    const validMoves = [dragId - 1, dragId - width, dragId + 1, dragId + width];

    const validMove = validMoves.includes(replaceId);

    if (validMove) {
      setCurrentColorArrangement(updatedArrangement);
      
      // Check for matches after swap
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
    } else {
      // Revert the swap if move is invalid
      [updatedArrangement[dragId], updatedArrangement[replaceId]] = [
        updatedArrangement[replaceId],
        updatedArrangement[dragId],
      ];
      setCurrentColorArrangement(updatedArrangement);
    }

    setSquareBeingDragged(null);
    setSquareBeingReplaced(null);
  };

  const createBoard = () => {
    const randomColorArrangement = Array.from({ length: width * width }, () =>
      CandyColors[Math.floor(Math.random() * CandyColors.length)]
    );
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
    }, 100);
    return () => clearInterval(timer);
  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow]);

  return (
    <div className="app">
      <div className="game" style={{ display: "grid", gridTemplateColumns: `repeat(${width}, 50px)` }}>
        {CurrentColorArrangement.map((color, index) => (
          <div
            key={index}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            onDragOver={(e) => e.preventDefault()}
            style={{ width: "50px", height: "50px", backgroundColor: color, border: "1px solid #ccc" }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;
