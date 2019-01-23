class Wizard {
  constructor(id, name, image, pet, house, patronus, wand) {
    this.id = id,
    this.name = name
    this.image = image,
    this.pet = pet,
    this.house = house,
    this.patronus = patronus,
    this.wand = wand
  }

  render() {
    return `
    <div class="grid-container">
    <div class="flip-card">
    <div class="flip-card-inner">

      <div class="flip-card-front">
      <img id=image-${this.id} src=${this.image} style="width:100%;height:100%;"/>
      </div>

      <div class="flip-card-back">
        <h3 id=name-${this.id}>Name: ${this.name}</h3>
        <p id=house-${this.id}>House: ${this.house}</p>
        <p id=pet-${this.id}>Pet: ${this.pet}</p>
        <p id=patronus-${this.id}>Patronus: ${this.patronus}</p>
        <p id=wand-${this.id}>Wand: ${this.wand}</p>
        <p id=spells-${this.id}>Favorite Spell: <ul>
        <button class="delete" id=delete-${this.id}>Delete</button>
        <button class="edit" id=edit-${this.id}>Edit</button>
      </div>
      </div>
  </div>
  </div>
    `
  }
}






// <img src = ${this.image}>
// <h4>Name: ${this.name}</h4>
// <p>Pet: ${this.pet}</p>
// <p>House: ${this.house}</p>
// <p>Patronus: ${this.patronus}</p>
// <p>Wand: ${this.wand}</p>
// <ul>Favorite Spell: </ul>
