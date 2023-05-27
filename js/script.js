import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

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
  if (snapshot.exists()) {
    let shoppingListArr = Object.entries(snapshot.val())
    
    clearShoppingList()

    for (let i = 0; i < shoppingListArr.length; i++) {
      let currentItem = shoppingListArr[i]
      
      appendShoppingItems(currentItem)
    }
  } else {
    let text = document.createElement("p")
    text.textContent = "No shopping list"
    clearShoppingList()
    shoppingListEl.append(text)
  }
})

function clearShoppingList() {
  shoppingListEl.innerHTML = ""
}

function cleerInput() {
  inputEl.value = ""
}

function appendShoppingItems(item) {
  let newItemEl = document.createElement("li")

  let itemID = item[0]
  let itemValue = item[1]

  newItemEl.textContent = itemValue

  newItemEl.addEventListener("click", function() {
    let LocationOfItem = ref(database, `shoppingList/${itemID}`)
    remove(LocationOfItem)
  })

  shoppingListEl.append(newItemEl)
}