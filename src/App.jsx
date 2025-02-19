import { useEffect, useState, useCallback } from 'react';
import blueCandy from './Image/blue-candy2.png'; 
import greenCandy from './Image/green-candy2.png'; 
import orangeCandy from './Image/orange-candy.png'; 
import purpleCandy from './Image/purple-candy.png'; 
import redCandy from './Image/red-candy.png'; 
import yellowCandy from './Image/yellow-candy.png'; 
import blank from './Image/blank.png';

const width = 8;
const CandyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, redCandy, yellowCandy];

const App = () => {
  const [CurrentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [score, setScore] = useState(0);

  const updateScore = useCallback((matchLength) => {
    setScore(prev => prev + matchLength * 10);
  }, []);

  const checkForColumnOfFour = useCallback(() => {
    setCurrentColorArrangement(prev => {
      const updated = [...prev];
      for (let i = 0; i <= 39; i++) {
        const column = [i, i + width, i + width * 2, i + width * 3];
        if (updated[i] && column.every(idx => updated[idx] === updated[i])) {
          column.forEach(idx => (updated[idx] = blank));
          updateScore(column.length);
        }
      }
      return updated;
    });
  }, [updateScore]);

  const checkForRowOfFour = useCallback(() => {
    setCurrentColorArrangement(prev => {
      const updated = [...prev];
      for (let i = 0; i < 64; i++) {
        if (i % width > width - 4) continue;
        const row = [i, i + 1, i + 2, i + 3];
        if (updated[i] && row.every(idx => updated[idx] === updated[i])) {
          row.forEach(idx => (updated[idx] = blank));
          updateScore(row.length);
        }
      }
      return updated;
    });
  }, [updateScore]);

  const checkForColumnOfThree = useCallback(() => {
    setCurrentColorArrangement(prev => {
      const updated = [...prev];
      for (let i = 0; i <= 47; i++) {
        const column = [i, i + width, i + width * 2];
        if (updated[i] && column.every(idx => updated[idx] === updated[i])) {
          column.forEach(idx => (updated[idx] = blank));
          updateScore(column.length);
        }
      }
      return updated;
    });
  }, [updateScore]);

  const checkForRowOfThree = useCallback(() => {
    setCurrentColorArrangement(prev => {
      const updated = [...prev];
      for (let i = 0; i < 64; i++) {
        if (i % width > width - 3) continue;
        const row = [i, i + 1, i + 2];
        if (updated[i] && row.every(idx => updated[idx] === updated[i])) {
          row.forEach(idx => (updated[idx] = blank));
          updateScore(row.length);
        }
      }
      return updated;
    });
  }, [updateScore]);

  const moveIntoSquareBelow = useCallback(() => {
    setCurrentColorArrangement(prev => {
      const updated = [...prev];
      for (let i = 55; i >= 0; i--) {
        if (updated[i + width] === blank) {
          updated[i + width] = updated[i];
          updated[i] = blank;
        }
      }
      for (let i = 0; i < width; i++) {
        if (updated[i] === blank) {
          updated[i] = CandyColors[Math.floor(Math.random() * CandyColors.length)];
        }
      }
      return updated;
    });
  }, []);

  const dragStart = (e) => setSquareBeingDragged(e.target);
  const dragDrop = (e) => setSquareBeingReplaced(e.target);

  const dragEnd = () => {
    if (!squareBeingDragged || !squareBeingReplaced) return;
    const dragId = parseInt(squareBeingDragged.dataset.id);
    const replaceId = parseInt(squareBeingReplaced.dataset.id);
    
    let updatedArrangement = [...CurrentColorArrangement];
    [updatedArrangement[dragId], updatedArrangement[replaceId]] = [
      updatedArrangement[replaceId],
      updatedArrangement[dragId]
    ];

    setCurrentColorArrangement(updatedArrangement);
    setSquareBeingDragged(null);
    setSquareBeingReplaced(null);
  };

  const createBoard = () => {
    const randomColors = Array.from({ length: width * width }, () =>
      CandyColors[Math.floor(Math.random() * CandyColors.length)]
    );
    setCurrentColorArrangement(randomColors);
  };

  useEffect(() => createBoard(), []);

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
      <div className="score">Score: {score}</div>
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
            style={{ width: "50px", height: "50px", backgroundImage: `url(${color})`, backgroundSize: "cover" }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;
