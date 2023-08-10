const popupStart = document.getElementById("js-popupstart");
const popupForm = document.getElementById("js-popupForm");
const rangeValue = document.getElementById("js-rangeValue");
const popup = document.getElementById("js-popup");
const popupend = document.getElementById("js-popupend");
const timerElement = document.querySelectorAll(".timer");
const cardContainer = document.querySelector(".js-card-container");
const closeButton = document.getElementsByClassName("js-closeButton");

let finalObject = [];
let flippedCards = [];
const time = [0, 0];
let matchCouner = 0;
let timeInSeconds = 60;
let range = 1000;
let difficulty = 0;
let rescueTime = 0;
let countdownInterval;

function openPopupStart() {
    popupStart.style.visibility = "visible";
}

function closePopupStart() {
    popupStart.style.visibility = "hidden";
}

popupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Játék nehézségi szintje, beállítása.
    const difficultyButtons = document.querySelectorAll("#js-popupForm button");
    difficultyButtons.forEach((button) => {
        if (button.classList.contains("selected")) {
            difficulty = Number(button.id);
        }
    });

    // Játékidó beállítása
    const timeRadios = document.getElementsByName("time");
    timeRadios.forEach((radio) => {
        if (radio.checked) {
            let timeLimit = radio.value;
            timeInSeconds = Number(timeLimit.split(":")[0]) * 60;
            /* timeInSeconds = 10; */
            rescueTime = timeInSeconds;
        }
    });

    // Kártya Forgatási sebeség beállítása.
    range = document.getElementById("range").value;

    let finalArray = createDuplicatedRandomArray();
    finalObject = createArrayOfObjectsFromArray(finalArray);
    closePopupStart();
    generateCards();
    startCountdown();
});
openPopupStart();

// Játék nehézségi szintje, beállítása.
const difficultyButtons = document.querySelectorAll("#js-popupForm button");
difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
        difficultyButtons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

// Kártya Forgatási sebeség kiirása.
const rangeInput = document.getElementById("range");
rangeInput.addEventListener("input", () => {
    rangeValue.textContent = rangeInput.value;
});

// Függvény a véletlenszerű számokkal teli tömb létrehozásához.
function createRandomArray() {
    const randomArray = [];
    for (let i = 0; i < difficulty / 2; i++) {
        const randomNumber = Math.floor(Math.random() * 1000) + 1;
        randomArray.push(randomNumber);
    }

    return randomArray;
}

// Függvény a tömb elemeinek megkeveréséhez.
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; //Destrukturálás.
    }
}

// Függvény a két példányban szereplő számok létrehozásához.
function createPairsArray(array) {
    const pairsArray = array.slice();
    array.forEach((number) => pairsArray.push(number));
    shuffleArray(pairsArray); // A két példány megkeverése.
    return pairsArray;
}

// Függvény a két példányban szereplő számokkal teli tömb létrehozásához.
function createDuplicatedRandomArray() {
    const randomArray = createRandomArray();
    const duplicatedRandomArray = createPairsArray(randomArray);
    return duplicatedRandomArray;
}

//asszociatív tömb létrehozása.
function createArrayOfObjectsFromArray(finalArray) {
    const arrayOfObjects = finalArray.map((element, index) => ({
        id: index,
        value: element
    }));
    return arrayOfObjects;
}

function createFlipCard(index) {
    cardContainer.classList.add(`card-container${difficulty}`);

    const card = document.createElement("div");
    card.classList.add("card");
    card.id = `card-${index}`;

    const front = document.createElement("div");
    front.classList.add("front");
    front.classList.add(`${finalObject[index].value}`);

    const cardImgFront = document.createElement("img");
    cardImgFront.setAttribute("src", "img/blank.png");

    const back = document.createElement("div");
    back.classList.add("back");

    const cardImgBack = document.createElement("img");
    cardImgBack.setAttribute(
        "src",
        "https://robohash.org/" + finalObject[index].value
    );

    card.appendChild(front);
    card.appendChild(back);
    front.appendChild(cardImgFront);
    back.appendChild(cardImgBack);

    card.addEventListener("click", () => {
        if (!card.classList.contains("flip") && flippedCards.length < 2) {
            card.classList.add("flip");
            flippedCards.push(card);
            checkMatch();
        }
    });

    return card;
}

function generateCards() {
    for (let i = 0; i < difficulty; i++) {
        cardContainer.appendChild(createFlipCard(i));
    }
}

function checkMatch() {
    if (flippedCards.length === 2) {
        const card1Value = flippedCards[0].querySelector(".front").classList;
        const card2Value = flippedCards[1].querySelector(".front").classList;

        if (
            Number.parseInt(card1Value[1], 10) === Number.parseInt(card2Value[1], 10)
        ) {
            setTimeout(() => {
                flippedCards.forEach((card) => (card.style.visibility = "hidden")); // Kártya eltüntetése
                flippedCards = [];
                matchCouner++;
            }, range);
        } else {
            setTimeout(() => {
                flippedCards.forEach((card) => card.classList.remove("flip"));
                flippedCards = [];
            }, range);
        }
    }
}

function startCountdown() {
    countdownInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    setTimeConvert();
    timeInSeconds--;

    //Ha a játék idö lejár.
    if (timeInSeconds < 0) {
        clearInterval(countdownInterval);
        showPopup();
        timerElement[1].textContent = "00:00";
        timeInSeconds = rescueTime;
        setTimeConvert();
    }

    //Ha az összes egyezés bekövetkezett.
    if (matchCouner === difficulty / 2) {
        clearInterval(countdownInterval);
        showPopupEnd();
        timerElement[2].textContent = `${setTimeConvert()[0]}:${setTimeConvert()[1]
            }`;
        time[(0, 1)] = setTimeConvert();
        timeInSeconds = rescueTime;
        setTimeConvert();
    }
}

function setTimeConvert() {
    let minutes = Math.floor(timeInSeconds / 60)
        .toString()
        .padStart(2, "0");
    let seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    timerElement[0].textContent = `${minutes}:${seconds}`;
    return [minutes, seconds];
}

function showPopup() {
    popup.style.visibility = "visible";
    closeButton[0].addEventListener("click", closePopup);
}

function closePopup() {
    popup.style.visibility = "hidden";
    popupend.style.visibility = "hidden";
    matchCouner = 0;
    cardContainer.innerHTML = "";
    openPopupStart();
}

function showPopupEnd() {
    popupend.style.visibility = "visible";
    closeButton[1].addEventListener("click", closePopup);
}