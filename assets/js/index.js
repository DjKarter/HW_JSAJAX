import {getBeer} from "./API.js";

const debounce = (func, ms= 500) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, ms);
    };
}

const resultBox = document.querySelector('.result');
const status = document.querySelector('.status');
const suggestionsList = document.querySelector('.search_suggestions');
const searchBox = document.querySelector('.search_box');
const historyList = document.querySelector('.search_history');
let lastSearchedNames = [];
let index = 0;
let searchBoxInput = '';
const button = document.querySelector(".secret");
button.innerHTML = '<img src="/assets/secret/icon.png"  alt="random beer"/>';
button.onclick = function() {searchBox.placeholder = '(✯◡✯)  (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧  ╰(▔∀▔)╯ ٩(｡•́‿•̀｡)۶'};


const addItemToLS = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (error) {
        localStorage.clear();
    }
}

const getItemFromLS = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key));
    }
    catch (error) {
        console.log('Error in the Local Storage');
        return null;
    }
}

const initLS = (elems) => {
        elems.forEach((elem) => {addItemToLS(elem[0], elem[1])});
}

const showBeerInfo = (elem, beer) =>{
    resultBox.textContent = '';
    const {name, description, ibu, abv} = beer;
    resultBox.insertAdjacentHTML('beforeend',
        '<h2>Your beer:</h2>' +
        `<span><b>Name:</b> ${name}</span>\n` +
        `<span><b>Description:</b> ${description}</span>\n` +
        `<span><b>IBU:</b> ${ibu}</span>\n` +
        `<span><b>ABV:</b> ${abv}</span>\n`
    );

    /**
    const beerStorage = getItemFromLS('beerStorage');
    console.log(beerStorage);
    beerStorage[name] = beer;
    addItemToLS('beerStorage');
     **/

    if (lastSearchedNames.filter((elem) => elem[1] === name).length === 0) {
        if (index > 2) {
            lastSearchedNames[index % 3][0].remove();
        }
        const elemClone = elem.cloneNode(true);
        lastSearchedNames[index++ % 3] = [elemClone, name];
        historyList.insertBefore(elemClone, historyList.firstChild);
    }
}

const addSuggestion = (beer, searched=false) => {
    //console.log(beer);
    const temp_li = document.createElement('li');
    const temp_a = document.createElement('a');
    if (searched)
        temp_a.classList.add('searched');

    temp_a.textContent = beer.name;
    temp_a.href = '#';

    temp_li.appendChild(temp_a);
    temp_li.onclick = function () {showBeerInfo(temp_li, beer)};
    suggestionsList.appendChild(temp_li);
}

const onInput = async (event) => {
    status.textContent = 'Beerding';
    searchBoxInput = event.target.value;
    if (searchBoxInput.length > 0) {
        /**
        const beerStorage = getItemFromLS('beerStorage');

        let searchedBeer = null;

        if (beerStorage !== null && Object.keys(beerStorage).length > 0) {
            Object.keys(beerStorage).forEach((elem) => {
                if (elem.startsWith(searchBoxInput)) {
                    searchedBeer = elem;
                }
            })
        }**/

        let beersponse;
        try {
            beersponse = (await getBeer(searchBoxInput));
            status.textContent = '';
        }
        catch (error) {
            status.textContent = `BeError : ${error}`;
        }

        suggestionsList.innerHTML = '';
        /**
        if (searchedBeer !== null) {
            beersponse.slice(0,9).forEach((elem) => {
                addSuggestion(elem);
            });
            addSuggestion(searchedBeer);
        } else {
            **/
            beersponse.forEach((elem) => {
                addSuggestion(elem);
            });

    } else {
        suggestionsList.innerHTML = '';
        status.textContent = '';
    }
}



const start = () => {
    initLS([['beerStorage', {}]]);
    console.log( getItemFromLS('beerStorage'));
    searchBox.oninput = debounce(onInput);
    window.addEventListener('storage', () => console.log(localStorage));
}

start();

//showBeerInfo('beer');
