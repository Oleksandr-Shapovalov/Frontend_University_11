import { ToastContainer, toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { WordService } from "../core/api/wordService";
import { useFetch } from "../core/hooks/useFetch";
import { useInput } from "../core/hooks/useInput";
import { shuffle } from "../util/common";
import { englishWords } from "../util/words";
import Modal from "./Modal";

const MAX_ATTEMPTS = 3;

const getEnglishLVL = (correctPercents) => {
  if (correctPercents < 0.2) return "Elementary level (A1)";
  else if (correctPercents < 0.4) return "Beginner level (A2)";
  else if (correctPercents < 0.6) return "Intermediate level (B1)";
  else if (correctPercents < 0.8) return "Upper-Intermediate level (B2)";
  else if (correctPercents < 0.9) return "Advanced level (C1)";
  else if (correctPercents <= 1) return "Proficient level (C2)";
};

const CardScreen = () => {
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const [resultModalActive, setResultModalActive] = useState(false);

  const results = useRef({
    totalCorrect: 0,
    totalIncorrect: 0,
    details: {},
  });

  const translate = useInput();

  const wordQuery = useFetch(() => WordService.getTranslate(words[selectedWordIndex]), false);

  useEffect(() => {
    const shuffledWords = shuffle(englishWords);
    setWords(shuffledWords);
  }, []);

  // check if translation correct
  useEffect(() => {
    wordQuery.refetch();
  }, [selectedWordIndex]);

  const openResultModal = () => {
    setResultModalActive(true);
  };
  const closeResultModal = () => {
    setResultModalActive(false);
  };

  function correctTranslate() {
    if (selectedWordIndex !== words.length - 1) {
      setSelectedWordIndex((prev) => prev + 1);
      translate.setValue("");
    } else {
      setIsFinished(true);
      openResultModal(true);
    }
    results.current.details[selectedWordIndex] = {
      text: `  ${words[selectedWordIndex]} - ${wordQuery.data.responseData.translatedText} correct ✅`,
      isCorrect: true,
    };
    results.current.totalCorrect++;
  }

  function incorrectTranslate() {
    if (attemptNumber !== MAX_ATTEMPTS) {
      setAttemptNumber((prev) => prev + 1);
    } else {
      results.current.details[selectedWordIndex] = {
        text: `  ${words[selectedWordIndex]} - ${wordQuery.data.responseData.translatedText} incorrect ❌`,
        isCorrect: false,
      };
      results.current.totalIncorrect++;

      if (selectedWordIndex !== words.length - 1) {
        toast(` ${words[selectedWordIndex]} - ${wordQuery.data.responseData.translatedText.toLowerCase()}  `, { type: "error" });

        setAttemptNumber(1);
        setSelectedWordIndex((prev) => prev + 1);
        translate.setValue("");
      } else {
        setIsFinished(true);
        openResultModal(true);
      }
    }
  }

  const checkWord = (e) => {
    e.preventDefault();

    if (wordQuery?.data?.responseData && translate.bind.value) {
      if (wordQuery.data.responseData.translatedText.toLowerCase() === translate.bind.value.toLowerCase()) {
        // correct translate
        correctTranslate();
      } else {
        // incorrect translate
        incorrectTranslate();
      }
    }
  };

  if (wordQuery.error) return <h1 className="text-center  py-14 text-red-400 text-6xl capitalize">Something went wrong, sorry 😰</h1>;

  if (isFinished) {
    return (
      <>
        <Modal visible={resultModalActive} onClose={closeResultModal} text={getEnglishLVL(results.current.totalCorrect / words.length)} />
        <ul className="text-gray-100 flex flex-col  text-center items-center gap-4 pt-10">
          {Object.values(results.current.details).map((el, i) => (
            <li key={el.text + i}>{i + 1 + " " + el.text}</li>
          ))}
        </ul>
        <Results totalCorrect={results.current.totalCorrect} totalIncorrect={results.current.totalIncorrect} />
      </>
    );
  }

  return (
    <>
      <div className="text-center  py-14 text-gray-100 text-6xl capitalize">{words[selectedWordIndex]}</div>

      <div className="mx-auto text-gray-200 text-3xl text-center">
        {selectedWordIndex + 1} from {words.length}
      </div>

      <form className="mt-20 flex-col items-center  flex gap-4" onSubmit={checkWord}>
        <label className="text-gray-100 text-xl" htmlFor="translation">{`Attempt ${attemptNumber} from ${MAX_ATTEMPTS}`}</label>
        <input
          autoComplete="off"
          {...translate.bind}
          type="text"
          name="translation"
          id="translation"
          className="px-6 py-2 text-gray-100 outline-none bg-transparent border border-gray-100 w-80 text-center placeholder:text-gray-100 placeholder:text-center text-xl"
          placeholder="Ukrainian translate"
        />

        <button
          className="px-5 py-1 text-xl text-center text-indigo-300 bg-gray-50
           hover:bg-gray-200 transition-all ease-in-out duration-300 cursor-pointer"
          name="check"
          type="submit"
          disabled={wordQuery.isLoading}>
          {wordQuery.isLoading ? "Loading..." : "Check"}
        </button>
      </form>

      <Results totalCorrect={results.current.totalCorrect} totalIncorrect={results.current.totalIncorrect} />

      <ToastContainer />
    </>
  );
};

export default CardScreen;

function Results({ totalCorrect, totalIncorrect }) {
  return (
    <div className="text-gray-100 text-xl mt-14 mx-auto max-w-xs ">
      <div>Total Correct : {totalCorrect}</div>
      <div>Total Incorrect : {totalIncorrect}</div>
    </div>
  );
}
