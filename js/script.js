import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://purchaseslist-ef8a1-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputEl = document.getElementById("input-field")
const addBtn = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")


addBtn.addEventListener("click", function() {
  let inputValue = inputEl.value

  push(shoppingListInDB, inputValue)

  cleerInput()
})

onValue(shoppingListInDB, function(snapshot) {
  let shoppingListArr = Object.values(snapshot.val())
  let currentItem
  clearShoppingList()

  for (let i = 0; i < shoppingListArr.length; i++) {
    currentItem = shoppingListArr[i]
    appendShoppingItems(currentItem)
  }

})

function clearShoppingList() {
  shoppingListEl.innerHTML = ""
}

function cleerInput() {
  inputEl.value = ""
}

function appendShoppingItems(value) {
  shoppingListEl.innerHTML += `<li>${value}</li>`
}