let showPheno = document.getElementById('showPheno')
let popSizeLabel = document.getElementById('popSizeLabel')
let popSize = document.getElementById('popSize')
let generationLabel = document.getElementById('generationLabel')

showPheno.oninput = () => env.showPheno = showPheno.checked

popSize.oninput = () => {
  env.popSize = popSize.value
  popSizeLabel.innerHTML = 'Population: ' + env.popSize
  setup()
}

window.onload = () => {
  showPheno.checked = env.showPheno
  generationLabel.innerHTML = 'Generation: ' + env.generation
  popSizeLabel.innerHTML = 'Population: ' + env.popSize

}
