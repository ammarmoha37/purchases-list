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

addBtn.disabled = true        // disabling add button

// add item to database when clicked
addBtn.addEventListener("click", addingItem)

// Listen to shopping list in database
onValue(shoppingListInDB, getItemsFromDB) 

// adding item to database
function addingItem() {
  let inputValue = inputEl.value.trim()

  if (inputValue !== "") {              //checking if the input field is not empty
    push(shoppingListInDB, inputValue)    // push item to database
    clearInput()                          // clearing input field
  }
}

// getting item form database using sanpshot
function getItemsFromDB(snapshot) {
  if (snapshot.exists()) {             // checking if there is items in database
    let shoppingListArr = Object.entries(snapshot.val())  // getting snapshot value and converting it to array
    
    clearShoppingList()     

    for (let i = 0; i < shoppingListArr.length; i++) {  // iterating trought the item of the snapshot array
      let currentItem = shoppingListArr[i]
      
      appendShoppingItems(currentItem)          // displaying items
    }
  } else {
    let text = document.createElement("p")    // creating paragraph
    text.textContent = "No shopping list"     
    clearShoppingList()             
    shoppingListEl.append(text)               // displaying text
  }
  addBtn.disabled = true                    // disabling add button
}

// clearing shopping list
function clearShoppingList() {
  shoppingListEl.innerHTML = ""
}

// clearing input field
function clearInput() {
  inputEl.value = ""
}

// appending item to shopping list
function appendShoppingItems(item) {
  let newItemEl = document.createElement("li")    //creating new item element

  let itemID = item[0]                      // setting items' ID from snapshot array 
  let itemValue = item[1]                   // setting items' value from snapshot array

  newItemEl.textContent = itemValue         // adding the value of item to the new item element

  // removing item form list
  newItemEl.addEventListener("click", function() {    
    let LocationOfItem = ref(database, `shoppingList/${itemID}`)    // getting the exact location of the item
    remove(LocationOfItem)      // removing item form database
  })

  shoppingListEl.append(newItemEl)      // displaying the new item to the list
}

// Call the checkInput function when input value changes
inputEl.addEventListener("input", checkInput)

// Listen for keydown event on the input field
inputEl.addEventListener("keydown", handleKeyPress)

// Listen for click event on the add button to check if the input field is empty or not
function checkInput() {
  let inputValue = inputEl.value.trim()

  if (inputValue !== "") {
    addBtn.disabled = false   // Enable the button   
  } else {
    addBtn.disabled = true    // Disable the button
  }
}

// Listen for keydown event on the input field 
function handleKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault()      // Prevent form submission
    addBtn.click()            // Trigger button click
  }
}