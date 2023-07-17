// Függvény a véletlenszerű számokkal teli tömb létrehozásához
function createRandomArray() {
    const randomArray = [];
    for (let i = 0; i < 8; i++) {
        const randomNumber = Math.floor(Math.random() * 1000) + 1;
        randomArray.push(randomNumber);
    }
    return randomArray;
}

// Függvény a tömb elemeinek megkeveréséhez
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Függvény a két példányban szereplő számok létrehozásához
function createPairsArray(array) {
    const pairsArray = array.slice();
    array.forEach((number) => pairsArray.push(number));
    shuffleArray(pairsArray); // A két példány megkeverése
    return pairsArray;
}

// Függvény a két példányban szereplő számokkal teli tömb létrehozásához
function createDuplicatedRandomArray() {
    const randomArray = createRandomArray();
    const duplicatedRandomArray = createPairsArray(randomArray);
    return duplicatedRandomArray;
}

// 16 elemű tömb létrehozása véletlenszerű, de minden szám pontosan kétszer szerepel
const finalArray = createDuplicatedRandomArray();

// Eredmény kiíratása a konzolon
console.log("Véletlenszerű tömb két példányban:", finalArray);

//új rész
const grid = document.querySelector(".js-grid");
let cardsChosen = [];
let cardsChosenId = [];

function createBoard() {
    for (let i = 0; i < finalArray.length; i++) {
        const card = document.createElement("img");
        card.setAttribute("src", "img/blank.png");
        card.setAttribute("data-id", finalArray[i]);
        card.addEventListener("click", flipCard);
        grid.appendChild(card);
    }
}

function flipCard() {
    let cardId = this.getAttribute("data-id");
    cardsChosen.push(finalArray[cardId]);
    cardsChosenId.push(cardId);
    this.setAttribute("src", "https://robohash.org/" + cardId);
    if (cardsChosen.length === 2) {
        /* setTimeout(checkMatch, 500); */
    }
}

createBoard();
