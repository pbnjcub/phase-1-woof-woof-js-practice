//global variables
let dogArray = []
let dog

//node getters
const dogBarDiv = () => document.getElementById('dog-bar')
const dogInfoDiv = () => document.getElementById('dog-info')
const goodBadDogButton = () => document.querySelector('div#dog-info button')
const goodDogFilterBtn = () => document.getElementById('good-dog-filter')

//secondary event helpers
const createGoodDogBtnLabel = (isGoodDog) => {
    let goodDogBtnLabel
    if (isGoodDog === true) {
        goodDogBtnLabel = 'Good Dog!'
    } else {
        goodDogBtnLabel = 'Bad Dog!'
    }
    return goodDogBtnLabel
}

const resetDogInfoDiv = () => {
    dogInfoDiv().innerHTML = ' '
}

const findDogById = (dogId) => {
    return dogArray.find(dog => dog.id === dogId)
}

const toggleGoodBadDogBtnLabel = (isGoodDog) => {
    if (isGoodDog === false) {
        goodBadDogButton().innerText = 'Bad Dog!'
    } else {
        goodBadDogButton().innerText = 'Good Dog!'
    }
}

//secondary event handlers
const toggleGoodBadDog = (e) => {
    e.preventDefault()
    let goodBadDogState = e.target.innerText
    if(goodBadDogState === 'Good Dog!') {
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: 'PATCH',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                isGoodDog: false
            })
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            toggleGoodBadDogBtnLabel(data.isGoodDog)
            dogArray[dog.id - 1].isGoodDog = false
        })
    } else {
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: 'PATCH',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                isGoodDog: true
            })
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data.isGoodDog)
            toggleGoodBadDogBtnLabel(data.isGoodDog)
            dogArray[dog.id - 1].isGoodDog = true
        })
    }
}

const showPupInfo = (e) => {
    resetDogInfoDiv()
    const dogId = parseInt(e.target.id,10)
    dog = findDogById(dogId)

    const showPupImg = document.createElement('img')
    showPupImg.src = dog.image
    dogInfoDiv().appendChild(showPupImg)

    const showPupNameH2 = document.createElement('H2')
    showPupNameH2.innerText = dog.name
    dogInfoDiv().appendChild(showPupNameH2)

    const showPupIsGoodDogButton = document.createElement('button')
    showPupIsGoodDogButton.innerText = createGoodDogBtnLabel(dog.isGoodDog)
    showPupIsGoodDogButton.id = dogId
    showPupIsGoodDogButton.addEventListener('click', toggleGoodBadDog)
    dogInfoDiv().appendChild(showPupIsGoodDogButton)
}

//event helpers
const resetDogBarDiv = () => {
    dogBarDiv().innerHTML = ' '
}

const filterGoodDogs = () => {
    return dogArray.filter(dog => dog.isGoodDog === true)
}

//event handlers
const addDogName = (dog) => {
    const dogNameSpan = document.createElement('span')
    dogNameSpan.innerText = dog.name
    dogNameSpan.id = dog.id
    dogNameSpan.addEventListener('click', showPupInfo)

    dogBarDiv().appendChild(dogNameSpan)
}
 
const addDogNames = (array) => {
    for(let dog of array) {
        addDogName(dog)
    }
}

//DOMContendLoaded event handlers
const addDogs = (e) => {
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(data => {
        dogArray = data
        addDogNames(dogArray)   
    })
}

const handleFilterGoodDogs = (e) => {
    e.preventDefault()
    if(e.target.innerText === 'Filter good dogs: OFF') {
        e.target.innerText = 'Filter good dogs: ON'
        resetDogBarDiv()
        addDogNames(filterGoodDogs())
    } else {
        e.target.innerText = 'Filter good dogs: OFF'
        resetDogBarDiv()
        addDogNames(dogArray)
    }

  


}

//DOMContentLoaded event listeners
const clickGoodDogFilterEvent = () => {
    goodDogFilterBtn().addEventListener('click', handleFilterGoodDogs)
}

document.addEventListener('DOMContentLoaded', function() {
    addDogs()
    clickGoodDogFilterEvent()
})


