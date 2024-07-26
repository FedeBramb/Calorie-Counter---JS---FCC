const calorieCounter = document.getElementById('calorie-counter'); //Form
const budgetNumberInput = document.getElementById('budget'); //Input inserimento calorie
const entryDropdown = document.getElementById('entry-dropdown'); 
const addEntryButton = document.getElementById('add-entry');//Pulsante Add Entry
const clearButton = document.getElementById('clear');//
const output = document.getElementById('output');//Container output calorie rimanenti
let isError = false;


//Funzione per ripulire 
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

//Funzione di controllo testo per ogni pasto/
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}



// targetInputContainer = seleziona l'elemento del DOM che rappresenta il contenitore degli input per 
//                        il tipo di voce selezionato. entryDropdown
// entryNumber = seleziona tutti gli input[type="text"] presenti nel targetInputContainer, aggiungendo
//               1 alla lunghezza
// const HTMLString = nuova riga di codice HTML 
// ...insertAdjacentHTML() = utilizziamo il metodo del DOM per inserire la stringa prima della fine

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

//e.preventDefault(); = impedisce il comportamento predefinito dell'evento di submit di un form, che di 
//                      solito comporterebbe il ricaricamento della pagina. 
//isError = false; = sarà utilizzata per tenere traccia se si è verificato un errore durante il calcolo delle calorie.
//Selezioniamo tutti gli input numerici delle rispettive categorie.
//Calcola le calorie da ogni input numerico e le attribuisce alla rispettiva variabile.
//Se isError è impostato su true durante il calcolo delle calorie, la funzione termina immediatamente senza continuare 
// con la visualizzazione delle informazioni.
//Viene calcolato il totale delle calorie consumate (consumedCalories) sommando le calorie dei pasti e sottraendo le 
// calorie bruciate durante l'esercizio.
//Viene calcolato il totale delle calorie rimanenti rispetto al budget (remainingCalories).
//Viene determinato se c'è un surplus o un deficit calorico (surplusOrDeficit).
//Gli elementi HTML vengono popolati con le informazioni calcolate e la classe 'hide' viene rimossa dalla sezione di output,
// rendendola visibile sulla pagina.
//



function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories >= 0 ? 'Surplus' : 'Deficit';
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove('hide');
}

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (let i = 0; i < list.length; i++) {
    const currVal = cleanInputString(list[i].value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

//Seleziona tutti gli elementi presenti nel container in Nodelist e trasforma in array
//così da poter utilizzare i metodi dell'Array
//Loop attraverso gli elementi presenti nel container sostituendoli con una stringa vuota
//Aggiungiamo la classe Hide per nascondere l'output.


function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  for (let i = 0; i < inputContainers.length; i++) {
    inputContainers[i].innerHTML = '';
  }

  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);