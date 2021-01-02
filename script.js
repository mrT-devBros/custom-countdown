const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-btn');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfor = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-btn');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;    // miliseconds
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with Today's Date
const today = new Date().toISOString().split('T')[0];
//console.log(today);
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
updateDOM = () => {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();   // since Jan 1st, 1970 in miliseconds
        const distance = countdownValue - now;
        //console.log('distance:', distance);

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
        //console.log(days, hours, minutes, seconds);

        // Hide Input
        inputContainer.hidden = true;

        // If the countdown has ended, show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfor.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // Else, show the countdown in progress
            // Populate Countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;

            completeEl.hidden = true;
            // Show Countdown
            countdownEl.hidden = false;
        }
    }, second);
}

// Take Values from Form Input
updateCountdown = e => {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    //console.log(countdownTitle, countdownDate);
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate
    };
    //console.log(savedCountdown);
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // Check for valid date
    if (countdownDate === '') {
        alert('Please select a date for the countdown.');
    } else {
        // Get number version of current Date, updateDOM
        countdownValue = new Date(countdownDate).getTime();
        //console.log('countdown value:', countdownValue);
        updateDOM();
    }
}

// Reset All Values
reset = () => {
    // Hide Coundowns, hide Complete, and show Input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop the countdown
    clearInterval(countdownActive);
    // Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

restorePreviousCountdown = () => {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, check localStorage
restorePreviousCountdown();