const myImage = document.querySelector('img')

myImage.onclick = function () {
  const mySrc = myImage.getAttribute('src')
  if (mySrc === 'images/cat.jpg') {
    myImage.setAttribute('src', 'images/cat2.jpg')
  } else {
    myImage.setAttribute('src', 'images/cat.jpg')
  }
}

const myButton = document.querySelector('button')
const myHeading = document.querySelector('h1')

function setUserName () {
  const myName = prompt('Please enter your name.')
  localStorage.setItem('name', myName)
  myHeading.textContent = 'Welcome to Echo Server, ' + myName
}

if (!localStorage.getItem('name')) {
  setUserName()
} else {
  const storedName = localStorage.getItem('name')
  myHeading.textContent = 'Welcome to Echo Server, ' + storedName
}
myButton.onclick = function () {
  setUserName()
}
