// --Form--
const form = document.querySelector('.calculator-container form');
const amountInputError = document.querySelector('.amount-input-error');
const amountInput = document.querySelector('.amount-input');
const numberOfPeopleImputError = document.querySelector(
  '.number-of-people-input-error'
);
const numberOfPeople = document.querySelector('.number-of-people-input');
const totalPerPersonElement = document.querySelector('.total-per-person');
const tipPerPersonElement = document.querySelector('.tip-per-person');

// -- History --
const historyNotAvailabel = document.querySelector('.history-not-available');
const historyTable = document.querySelector('.history-table');
const historyTableBody = historyTable.querySelector('tbody');

// -- Statistics --
const averageBillElement = document.querySelector('.average-bill');
const averageTipElement = document.querySelector('.average-tip');
const highestPriceElement = document.querySelector('.highest-price');

let selectedTip;
let history = [];

const getFormattedDate = () => {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(currentDate);

  return formattedDate;
};

const createHistoryRow = (amount, people, index) => {
  const newHistoryElement = document.createElement('tr');
  newHistoryElement.innerHTML = `
  <td>${amount}</td>
  <td>${selectedTip}</td>
  <td>${people}</td>
  <td>${getFormattedDate()}</td>
  <td>
    <button class="delete-button">
      <img src="./Assets/icon-delete.svg" />
    </button>
  </td>
  `;
  historyTableBody.appendChild(newHistoryElement);

  // --Delete Button --

  const deleteButton = newHistoryElement.querySelector('.delete-button');

  const handleDeleteHistoryRow = () => {
    const userConfirmed = confirm('Are you sure? This action is irreversible.');

    if (userConfirmed === true) {
      history.splice(index, 1);
      historyTableBody.removeChild(newHistoryElement);
      updateAverageBill();
      updateAverageTip();
      highestPrice();
    }
  };

  deleteButton.addEventListener('click', handleDeleteHistoryRow);
};

const updateAverageBill = () => {
  let sum = 0;
  for (let i = 0; i < history.length; i++) {
    sum += history[i].bill;
  }

  const average = sum / history.length;

  averageBillElement.innerText = '$' + average.toFixed(2);
};

const updateAverageTip = () => {
  let totalTip = 0;
  for (let i = 0; i < history.length; i++) {
    const bill = history[i].bill;
    const tipPercent = history[i].tip;
    const tipValue = bill * (tipPercent / 100);
    totalTip += tipValue;
  }

  const averageTip = totalTip / history.length;

  averageTipElement.innerText = '$' + averageTip.toFixed(2);
};

const highestPrice = () => {
  let price = 0;
  for (let i = 0; i < history.length; i++) {
    if (history[i].bill > price) {
      price = history[i].bill;
    }
  }

  highestPriceElement.innerText = '$' + price;
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  let = numberOfErrors = 0;

  // -- Amount --

  const amount = Number(data.get('amount'));
  if (amount <= 0) {
    amountInputError.style.display = 'block';
    amountInput.style.borderColor = '#e17457';
    numberOfErrors++;
  } else {
    amountInputError.style.display = 'none';
    amountInput.style.borderColor = '';
  }

  // -- No. of People --

  const people = Number(data.get('number-of-people'));
  if (people <= 0) {
    numberOfPeopleImputError.style.display = 'block';
    numberOfPeople.style.borderColor = '#e17457';
    numberOfErrors++;
  } else {
    numberOfPeopleImputError.style.display = 'none';
    numberOfPeople.style.borderColor = '';
  }

  if (numberOfErrors > 0) {
    return;
  }

  const totalPerPerson = (amount + (selectedTip / 100) * amount) / people;
  totalPerPersonElement.innerText = '$' + totalPerPerson.toFixed(2);

  const tipPerPerson = ((selectedTip / 100) * amount) / people;
  tipPerPersonElement.innerText = '$' + tipPerPerson.toFixed(2);

  resetButton.removeAttribute('disabled');

  // -- History --

  historyNotAvailabel.classList.add('hide');
  historyTable.classList.remove('hide');

  // createHistoryRow(amount, people);

  history.push({
    bill: amount,
    tip: selectedTip,
    numberOfPeople: people,
  });
  const index = history.length - 1;

  createHistoryRow(amount, people, index);

  updateAverageBill();

  updateAverageTip();

  highestPrice();
};

form.addEventListener('submit', handleFormSubmit);

// --Tip Buttons--

const tipButtons = document.querySelectorAll('.tip-button');

const handleSelectTip = (e) => {
  tipButtons.forEach((tipButton) => {
    tipButton.classList.remove('selected-tip');
  });
  e.target.classList.add('selected-tip');
  customTipInput.value = '';
  selectedTip = Number(e.target.getAttribute('value'));
};

tipButtons.forEach((tipButton) => {
  tipButton.addEventListener('click', handleSelectTip);
});

// -- Costum Tip --
const customTipInput = document.querySelector('.custom-tip-input');

const handleCustomTip = () => {
  tipButtons.forEach((tipButton) => {
    tipButton.classList.remove('selected-tip');
  });
  selectedTip = customTipInput.value;
};

customTipInput.addEventListener('input', handleCustomTip);

// -- Reset Button --

const resetButton = document.querySelector('.reset-button');

const handleResetButton = () => {
  amountInput.value = '';
  customTipInput.value = '';
  numberOfPeople.value = '';
  totalPerPersonElement.innerText = '$0.00';
  tipPerPersonElement.innerText = '$0.00';
  resetButton.setAttribute('disabled', 'true');
  tipButtons.forEach((tipButton) => {
    tipButton.classList.remove('selected-tip');
  });
  selectedTip = null;
};

resetButton.addEventListener('click', handleResetButton);
