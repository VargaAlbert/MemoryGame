const cardContainer = document.querySelector(".card-container");
let flippedCards = [];

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
function createArrayOfObjectsFromArray(finalArray) {
    const arrayOfObjects = finalArray.map((element, index) => ({
        id: index,
        value: element
    }));

    return arrayOfObjects;
}

const finalObject = createArrayOfObjectsFromArray(finalArray);

function createFlipCard(index) {
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
    for (let i = 0; i < finalObject.length; i++) {
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
            }, 1000);
        } else {
            setTimeout(() => {
                flippedCards.forEach((card) => card.classList.remove("flip"));
                flippedCards = [];
            }, 1000);
        }
    }
}

generateCards();