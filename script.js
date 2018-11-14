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

  wizard.spells.forEach(spell => {
    let spellInstance = new Spell(spell.name, spell.effect)
    newCard.querySelector('ul').appendChild(spellInstance.render())
  })
  newCard.appendChild(deleteWizardButton())
  newCard.appendChild(editWizardButton())
  newCard.appendChild(editForm())
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

//delete
function deleteWizardButton() {

    let deleteButton = document.createElement('button')
    deleteButton.innerText = "Delete"
    deleteButton.addEventListener('click', removeWizard)
    return deleteButton
}

function removeWizard(event) {
  let wizardCardId = event.currentTarget.parentNode.id
  fetch(wizardUrl() + `/${wizardCardId}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(resp => resp.json())
  .then(data => console.log(data))
}

//edit
function editWizardButton() {
  let editButton = document.createElement('button')
  editButton.className = "edit-button"
  editButton.innerText = "Edit"
  // editButton.addEventListener('click', edit)
  return editButton
}


//PATCH call for edit
function editFetchCall(event) {

  let name = document.querySelector('input#edit-name').value
  let image = document.querySelector('input.#edit-URL').value
  let pet = document.querySelector('input.#edit-pet').value
  let patronus = document.querySelector('input.#edit-patronus').value
  let house = document.querySelector('input.#edit-house').value
  let wand = document.querySelector('input.#edit-wand').value

  // let wizardCardId = event.currentTarget.parentNode.id
  // fetch(wizardUrl() + `/${wizardCardId}`, {
  //   method: "PATCH",
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  //   // body: JSON.stringify()
  // })
  // .then(resp => resp.json())
  // .then(data => console.log(data))
}

function editForm() {

  let createEditForm = document.createElement('form')
    createEditForm.id = "edit"
    createEditForm.className = "form-inline"

  let editDiv = document.createElement('div')
    editDiv.className = "form-group"
    editDiv.id = "edit-group"

  createEditForm.appendChild(editDiv)
    editDiv.appendChild(editNameInput())
    editDiv.appendChild(editURLInput())
    editDiv.appendChild(editPetInput())
    editDiv.appendChild(editPatronusInput())
    editDiv.appendChild(editHouseInput())
    editDiv.appendChild(editWandInput())
    editDiv.appendChild(editDoneBtn())

  return createEditForm
}


//edit Submit Button
function editDoneBtn() {
  let editDoneBtn = document.createElement('button')
    editDoneBtn.innerText = "Done"
    editDoneBtn.addEventListener('submit', editFetchCall)
    return editDoneBtn
  }


//edit Wand
function editWandInput() {
  let editWandInput = document.createElement('input')
    editWandInput.className = "form-control"
    editWandInput.placeholder = "Edit Wand..."
    editWandInput.id = "edit-wand"
    return editWandInput
}


//edit House
function editHouseInput() {
let editHouseInput = document.createElement('input')
  editHouseInput.className = "form-control"
  editHouseInput.placeholder = "Edit House..."
  editHouseInput.id = "edit-house"
  return editHouseInput
}


//edit Patronus
function editPatronusInput() {
  let editPatronusInput = document.createElement('input')
    editPatronusInput.className = "form-control"
    editPatronusInput.placeholder = "Edit Patronus..."
    editPatronusInput.id = "edit-patronus"
    return editPatronusInput
}

//edit Pet
function editPetInput() {
  let editPetInput = document.createElement('input')
    editPetInput.className = "form-control"
    editPetInput.placeholder = "Edit Pet..."
    editPetInput.id = "edit-pet"
    return editPetInput
}

//edit Image URL
function editURLInput() {
  let editURLInput = document.createElement('input')
    editURLInput.className = "form-control"
    editURLInput.placeholder = "Edit Image..."
    editURLInput.id = "edit-URL"
    return editURLInput
}

//edit Name
function editNameInput() {
  let editNameInput = document.createElement('input')
    editNameInput.className = "form-control"
    editNameInput.placeholder = "Edit Name..."
    editNameInput.id = "edit-name"
    return editNameInput
}

// hide & seek EDIT
let editBtn = document.querySelector('.edit-button')
let showEditForm = document.querySelector('#edit')
let editWizard = false

editBtn.addEventListener('click', () => {
  editWizard = !editWizard
  if (editWizard) {
    showEditForm.style.display = 'block'
  }
  else {
    showEditForm.style.display = 'none'
  }
})
// function edit() {
//   if(showEditForm.style.display === "none") {
//     showEditForm.style.display ='block'
//   }else {
//     showEditForm.style.display = 'none'
//   }
// }


//
// fetch(`http://localhost:3000/wizards/14`, {
// 	method: "DELETE",
//
// })
// .then(resp => resp.json())
// .then(data => console.log(data))




















//
