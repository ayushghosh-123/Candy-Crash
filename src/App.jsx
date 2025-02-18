import { useEffect, useState, useCallback } from "react";

const width = 8;
const CandyColors = ["blue", "green", "orange", "purple", "red", "yellow"];

const App = () => {
  const [CurrentColorArrangement, setCurrentColorArrangement] = useState([]);

  const checkForColumnOfFour = useCallback(() => {
    const updatedArrangement = [...CurrentColorArrangement];
    let changed = false;

    for (let i = 0; i < 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = updatedArrangement[i];

      if (
        decidedColor &&
        columnOfFour.every((square) => updatedArrangement[square] === decidedColor)
      ) {
        columnOfFour.forEach((square) => (updatedArrangement[square] = " "));
        changed = true;
      }
    }

    if (changed) setCurrentColorArrangement(updatedArrangement);
  }, [CurrentColorArrangement]);

  const checkForColumnOfThree = useCallback(() => {
    const updatedArrangement = [...CurrentColorArrangement];
    let changed = false;

    for (let i = 0; i < 47; i++) {
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

    if (changed) setCurrentColorArrangement(updatedArrangement);
  }, [CurrentColorArrangement]);

  const checkForRowOfThree = useCallback(() => {
    const updatedArrangement = [...CurrentColorArrangement];
    let changed = false;

    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = updatedArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

      if (notValid.includes(i)) continue;

      if (
        decidedColor &&
        rowOfThree.every((square) => updatedArrangement[square] === decidedColor)
      ) {
        rowOfThree.forEach((square) => (updatedArrangement[square] = " "));
        changed = true;
      }
    }

    if (changed) setCurrentColorArrangement(updatedArrangement);
  }, [CurrentColorArrangement]);

  const checkForRowOfFour = useCallback(() => {
    const updatedArrangement = [...CurrentColorArrangement];
    let changed = false;

    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = updatedArrangement[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63];

      if (notValid.includes(i)) continue;

      if (
        decidedColor &&
        rowOfFour.every((square) => updatedArrangement[square] === decidedColor)
      ) {
        rowOfFour.forEach((square) => (updatedArrangement[square] = " "));
        changed = true;
      }
    }

    if (changed) setCurrentColorArrangement(updatedArrangement);
  }, [CurrentColorArrangement]);

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        CandyColors[Math.floor(Math.random() * CandyColors.length)];
      randomColorArrangement.push(randomColor);
    }
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
    }, 100);

    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    CurrentColorArrangement,
  ]);

  return (
    <div className="app">
      <div
        className="game"
        style={{ display: "grid", gridTemplateColumns: `repeat(${width}, 50px)` }}
      >
        {CurrentColorArrangement.map((color, index) => (
          <div
            key={index}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: color,
              border: "1px solid #ccc",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;

