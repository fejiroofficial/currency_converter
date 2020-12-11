const fetchRate = async () => {
  const sourceCurrency = document.getElementById("source").value;
  const targetCurrency = document.getElementById("target").value;
  const amount = document.getElementById("amount").value;

  // API KEY left here for testing purposes
  const API_KEY = "a49bc19e2ebf0fb33a875dcab422c5dc";
  try {
    const {
      data: { result },
    } = await axios.get(
      `https://data.fixer.io/api/convert?access_key=${API_KEY}&from=${sourceCurrency}&to=${targetCurrency}&amount=${amount}`
    );
    return { sourceCurrency, targetCurrency, amount, result };
  } catch (error) {
    alert("error found try again");
  }
};

const saveInputAndResult = async (inputResult) => {
  const data = await inputResult;
  const { sourceCurrency, targetCurrency, amount } = data;
  const result = data.result || 0;
  if (result) {
    addConversionToStore(sourceCurrency, targetCurrency, amount, result);
  }
  return result;
};

const displayResult = async (convertedResult) => {
  const resultDisplay = document.getElementById("result-bold-inner");
  const resultDisplayTwo = document.getElementById("result-small");
  const result = await convertedResult;
  if (result !== NaN) {
    resultDisplay.innerHTML = `<div>${result}</div>`;
    resultDisplayTwo.value = result;
  }
};

const runFunctionExpression = (input, fn) => {
  return fn(input);
};

const runConversionModule = () => {
  [fetchRate, saveInputAndResult, displayResult].reduce(
    runFunctionExpression,
    ""
  );
};

const conversionHandler = () => {
  runConversionModule();
};

const conversionCard = document.getElementById("conversion-card");
const historyCard = document.getElementById("history-card");
const historyBtn = document.getElementById("history-icon");
const convertBtn = document.getElementById("cancel-icon");

const goHistory = () => {
  conversionCard.style.display = "none";
  historyCard.style.display = "block";
  historyBtn.style.display = "none";
  convertBtn.style.display = "block";
  fetchHistory();
};

const goConvert = () => {
  conversionCard.style.display = "grid";
  historyCard.style.display = "none";
  historyBtn.style.display = "block";
  convertBtn.style.display = "none";
};
