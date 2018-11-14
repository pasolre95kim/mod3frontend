class Spell {
  constructor(name, effect) {
    this.name = name
    this.effect = effect
  }
  render() {
    let li = document.createElement('li')
    li.innerHTML = this.name
    return li
  }

}
