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
    <img src = ${this.image}>
    <h4>Name: ${this.name}</h4>
    <p>Pet: ${this.pet}</p>
    <p>House: ${this.house}</p>
    <p>Patronus: ${this.patronus}</p>
    <p>Wand: ${this.wand}</p>
    <ul>Favorite Spell: </ul>
    `
  }
}
