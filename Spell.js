class Spell {
  constructor(name, effect) {
    this.name = name
    this.effect = effect
  }
  render() {
    let pTag = document.createElement('li')
    pTag.innerHTML = this.name
    return pTag
  }

}
