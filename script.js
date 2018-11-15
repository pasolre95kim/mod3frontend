document.addEventListener("DOMContentLoaded", function() {
  signin()
  getWizards()
  wizardForm()
  document.querySelector("#wizard-container").innerHTML=" "
})


//hide&seek with form
const createBtn = document.querySelector('#createWizard')
const form = document.querySelector('.form-inline')
function signin() {
  if (form.style.display === "none") {
    form.style.display = 'block'
  } else {
    form.style.display = 'none'
    }
  }

function wizardUrl() {
  return "http://localhost:3000/wizards"
}

function getWizards() {
  fetch(wizardUrl())
  .then(resp => resp.json())
  .then(data => {
  	data.forEach(wizard => {
      createWizard(wizard)
    })
  })
}

function createWizard(wizard) {
  let newWizard = new Wizard(wizard.id, wizard.name, wizard.image, wizard.pet, wizard.house, wizard.patronus, wizard.wand)
  let wizardsDiv = document.querySelector('#wizard-container')
  let newCard = document.createElement('div')
    newCard.className = "wizards"
    newCard.id = `${wizard.id}`

  wizardsDiv.appendChild(newCard)
  newCard.innerHTML = newWizard.render()

  let flipCard = document.querySelector(".flip-card")


  wizard.spells.forEach(spell => {
    let spellInstance = new Spell(spell.name, spell.effect)
    newCard.querySelector(`#spells-${wizard.id}`).appendChild(spellInstance.render())
  })

  // let flipCardBack = document.querySelector('.flip-card-back')
  // flipCardBack.appendChild()
  //
  let deleteButton = document.getElementById(`delete-${wizard.id}`)
  deleteButton.addEventListener('click',removeWizard)

  let editButton = document.getElementById(`edit-${wizard.id}`)
  editButton.addEventListener('click',hideAndSeekForm )

  newCard.appendChild(editForm(wizard.id))
}

//shows form
function wizardForm() {
  let inputForm = document.querySelector('.form-inline')
  inputForm.addEventListener("submit", addWizards)
}

//form to add a new wizard
function addWizards(event) {
  event.preventDefault()

  let name = document.querySelectorAll('input.form-control')[0].value
  let image = document.querySelectorAll('input.form-control')[1].value
  let pet = document.querySelectorAll('input.form-control')[2].value
  let patronus = document.querySelectorAll('input.form-control')[3].value
  let house = document.querySelectorAll('input.form-control')[4].value
  let wand = document.querySelectorAll('input.form-control')[5].value

  let data = {
    "name": name,
    "image": image,
    "pet": pet,
    "patronus": patronus,
    "house": house,
    "wand": wand
  }
  fetch(wizardUrl(), {
    method: "POST",
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(data => {
    let wizardId = data.id
    let selectedSpellHTMLElements = document.querySelectorAll('select.form-control option:checked')
    let selectedSpellIds = Array.from(selectedSpellHTMLElements).map(el => parseInt(el.id.split("_")[1]))

    selectedSpellHTMLElements.forEach(spell => {
      spellCounter = 0
      let spellId = parseInt(spell.id.split("_")[1])
      addWizardSpell(wizardId, selectedSpellIds, spellCounter)
    })
    // getWizards()
  })
}


function addWizardSpell(wizardId, selectedSpellIds, spellCounter) {
  fetch('http://localhost:3000/wizardspells', {
  	method: "POST",
      headers: {
          'Content-Type':'application/json'
        },
      body: JSON.stringify({
    		"wizard_id":wizardId,
    		"spell_id": selectedSpellIds[spellCounter]
      })
    })
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      spellCounter +=1
      if (spellCounter < selectedSpellIds.length) {
        addWizardSpell(wizardId, selectedSpellIds, spellCounter)
      }
      else{
        getWizards()
      }
    })
  }


function removeWizard(event) {
  let wizardCardId = parseInt(event.currentTarget.id.split("-")[1])
  fetch(wizardUrl() + `/${wizardCardId}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(resp => resp.json())
  .then(data => console.log(data))
}


//hide&seek Edit Form
function hideAndSeekForm(event) {
  let wizardCardId = parseInt(event.currentTarget.id.split("-")[1])
  let formDiv = document.getElementById(`editform-${wizardCardId}`)

  if (formDiv.style.display === "none") {
    formDiv.style.display = 'block'
  } else {
    formDiv.style.display = 'none'
  }
}

//PATCH call for edit
function editFetchCall(event) {
  let wizardId = parseInt(event.target.parentElement.id)
debugger
  let name = document.querySelector(`input#edit-name-${wizardId}`).value
  let image = document.querySelector(`input#edit-URL-${wizardId}`).value
  let pet = document.querySelector(`input#edit-pet-${wizardId}`).value
  let patronus = document.querySelector(`input#edit-patronus-${wizardId}`).value
  let house = document.querySelector(`input#edit-house-${wizardId}`).value
  let wand = document.querySelector(`input#edit-wand-${wizardId}`).value

  let data = {
    "name": name,
    "image": image,
    "pet": pet,
    "patronus": patronus,
    "house": house,
    "wand": wand
  }
  fetch(wizardUrl() + `/${wizardId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(data => {
    name
  })
}

function loadThatWizard(data) {
  render(data)
}

//Edit form set up
function editForm(wizardId) {
  let createEditForm = document.createElement('form')
    createEditForm.id = "edit"
    createEditForm.className = "form-inline"

  let editDiv = document.createElement('div')
    editDiv.className = "form-group"
    editDiv.id = `editform-${wizardId}`
    editDiv.style.display = "none"

  createEditForm.addEventListener('submit', editFetchCall)

  createEditForm.appendChild(editDiv)
    editDiv.appendChild(editNameInput(wizardId))
    editDiv.appendChild(editURLInput(wizardId))
    editDiv.appendChild(editPetInput(wizardId))
    editDiv.appendChild(editPatronusInput(wizardId))
    editDiv.appendChild(editHouseInput(wizardId))
    editDiv.appendChild(editWandInput(wizardId))
    editDiv.appendChild(editDoneBtn(wizardId))

  return createEditForm
}


//edit Submit Button
function editDoneBtn() {
  let editDoneBtn = document.createElement('button')
    editDoneBtn.innerText = "Submit"
    return editDoneBtn
  }


//edit Wand
function editWandInput(wizardId) {
  let editWandInput = document.createElement('input')
    editWandInput.className = "form-control"
    editWandInput.placeholder = "Edit Wand..."
    editWandInput.value = document.getElementById(`wand-${wizardId}`).innerText.split(":")[1]
    editWandInput.id = `edit-wand-${wizardId}`
    return editWandInput
}


//edit House
function editHouseInput(wizardId) {
let editHouseInput = document.createElement('input')
  editHouseInput.className = "form-control"
  editHouseInput.placeholder = "Edit House..."
  editHouseInput.value = document.getElementById(`house-${wizardId}`).innerText.split(" ")[1]
  editHouseInput.id = `edit-house-${wizardId}`
  return editHouseInput
}


//edit Patronus
function editPatronusInput(wizardId) {
  let editPatronusInput = document.createElement('input')
    editPatronusInput.className = "form-control"
    editPatronusInput.placeholder = "Edit Patronus..."
    editPatronusInput.value = document.getElementById(`patronus-${wizardId}`).innerText.split(" ")[1]
    editPatronusInput.id = `edit-patronus-${wizardId}`
    return editPatronusInput
}

//edit Pet
function editPetInput(wizardId) {
  let editPetInput = document.createElement('input')
    editPetInput.className = "form-control"
    editPetInput.placeholder = "Edit Pet..."
    editPetInput.value = document.getElementById(`pet-${wizardId}`).innerText.split(" ")[1]
    editPetInput.id = `edit-pet-${wizardId}`
    return editPetInput
}

//edit Image URL
function editURLInput(wizardId) {
  let editURLInput = document.createElement('input')
    editURLInput.className = "form-control"
    editURLInput.placeholder = "Edit Image..."
    editURLInput.value = document.getElementById(`image-${wizardId}`).getAttribute("src")
    editURLInput.id = `edit-URL-${wizardId}`
    return editURLInput
}

//edit Name
function editNameInput(wizardId) {
  let editNameInput = document.createElement('input')
    editNameInput.className = "form-control"
    editNameInput.placeholder = "Edit Name..."
    editNameInput.value = document.getElementById(`name-${wizardId}`).innerText.split(" ")[1]
    editNameInput.id = `edit-name-${wizardId}`
    return editNameInput
}






















//
