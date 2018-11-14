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
  editButton.addEventListener('click', editForm)
  return editButton
}


function editWizard(event) {
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

  let editDiv = document.createElement('div')
  editDiv.className = "col"

  let editInput = document.createElement('input')
  editInput.className = "form-control"
  editInput.placeholder = "Wizard Name"
}

//hide & seek EDIT
const editBtn = document.querySelector('.edit-button')
const showEditForm = document.querySelector('#edit')

function edit() {
  if(showEditForm.style.display ==="none") {
    showEditForm.style.display ='block'
  }else {
    showEditForm.style.display = 'none'
  }
}



// <form>
//   <div class="row">
//     <div class="col">
//       <input type="text" class="form-control" placeholder="First name">
//     </div>
//     <div class="col">
//       <input type="text" class="form-control" placeholder="Last name">
//     </div>
//   </div>
// </form>


//
// fetch(`http://localhost:3000/wizards/14`, {
// 	method: "DELETE",
//
// })
// .then(resp => resp.json())
// .then(data => console.log(data))




















//
