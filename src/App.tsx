import { useCallback, useMemo, useRef, useState } from "react";

const buttonsColors = [
  {
    style: "bg-green-500",
    name: "green",
  },
  {
    style: "bg-red-500",
    name: "red",
  },
  {
    style: "bg-blue-500",
    name: "blue",
  },
  {
    style: "bg-yellow-500",
    name: "yellow",
  },
];

function App() {
  const [colors, setColors] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lost, setLost] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const [victoryColors, setVictoryColors] = useState<string[]>([]);

  const take_random = (arr: string[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const selectVictoryColors = useCallback(() => {
    const gameColors = buttonsColors.map((color) => color.name);
    console.log(take_random(gameColors));
    console.log(gameColors);
    for (let i = 0; i < 5; i++) {
      setVictoryColors([...victoryColors, take_random(gameColors)]);
    }
  }, [victoryColors]);

  const startingGame = useCallback(() => {
    victoryColors.forEach((color, id) => {
      // const div = document.getElementById(color) as HTMLDivElement;
      const div = useRef<HTMLButtonElement>().current as HTMLButtonElement;
      setTimeout(() => {
        div.style.opacity = "0.5";
        setTimeout(() => {
          div.style.opacity = "1";
        }, 500);
      }, (id + 1) * 1000);
    });
  }, []);

  const startGame = useCallback(() => {
    setColors([]);
    setCurrentIndex(0);
    setLost(false);
    setStart(true);
    selectVictoryColors();
    console.log(victoryColors);
    startingGame();
  }, [selectVictoryColors, startingGame, victoryColors]);

  const currentColor = useMemo(
    () => victoryColors[currentIndex],
    [currentIndex, victoryColors]
  );

  const resetGame = useCallback(() => {
    setColors([]);
    setCurrentIndex(0);
    setLost(false);
  }, []);

  const handleOnClick = useCallback(
    (color: string) => {
      if (color === currentColor) {
        setCurrentIndex(currentIndex + 1);
        setColors([...colors, color]);
      } else {
        window.navigator?.vibrate?.(200);
        setLost(true);
      }
    },
    [colors, currentColor, currentIndex]
  );

  const victory = useMemo(() => {
    if (currentIndex === 4) {
      for (let i = 0; i < victoryColors.length; i++) {
        if (colors[i] !== victoryColors[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }, [colors, currentIndex, victoryColors]);

  return (
    <>
      <div className="w-full h-full absolute grid grid-cols-2 gap-0">
        {buttonsColors.map((buttonColor) => (
          <button
            key={buttonColor.name}
            ref={buttonColor.name}
            onClick={() => handleOnClick(buttonColor.name)}
            className={buttonColor.style}
          ></button>
        ))}
        {!start && (
          <div className="absolute w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
            <button
              className="bg-black text-white text-2xl p-10 rounded"
              onClick={startGame}
            >
              Start the game
            </button>
            <button className="bg-black text-white text-2xl p-10 rounded">
              Install the app
            </button>
          </div>
        )}
        {lost && (
          <div className="absolute w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <h1 className="text-2xl font-bold">You lost!</h1>
              <button
                onClick={resetGame}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Play again
              </button>
            </div>
          </div>
        )}
        {victory && (
          <div className="absolute w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <h1 className="text-2xl font-bold">You win!</h1>
              <button
                onClick={resetGame}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Play again
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
