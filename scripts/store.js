let db;

async function init() {
  db = await idb.openDb("converterDb", 1, (db) => {
    db.createObjectStore("conversions", { autoIncrement: true });
  });
  fetchHistory();
}

async function fetchHistory() {
  let tx = db.transaction("conversions");
  let store = tx.objectStore("conversions");

  let conversions = await store.getAll();
  const listElem = document.getElementById("list-elem");

  if (conversions.length) {
    listElem.innerHTML = conversions
      .map(
        (conversion) => `
        <div class="history-tabs">
        <div class="history-tab history-tab-from">${conversion.sourceCurrency}</div>
        <div class="history-tab history-tab-to">${conversion.targetCurrency}</div>
        <div class="history-tab history-tab-amount"> ${conversion.amount}</div>
        <div class="history-tab history-tab-result">${conversion.result}</div>
      </div>
        `
      )
      .join("");
  }
}

async function addConversionToStore(
  sourceCurrency,
  targetCurrency,
  amount,
  result
) {
  let tx = db.transaction("conversions", "readwrite");

  try {
    await tx
      .objectStore("conversions")
      .add({ sourceCurrency, targetCurrency, amount, result });
    await fetchHistory();
  } catch (err) {
    if (err.name == "ConstraintError") {
      alert("conversion exists already");
      await addConversionToStore(
        sourceCurrency,
        targetCurrency,
        amount,
        result
      );
    } else {
      throw err;
    }
  }
}

// initialize database storage
init();

window.addEventListener("unhandledrejection", (event) => {
  alert("Error: " + event.reason.message);
});
