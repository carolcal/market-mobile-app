import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-ac482-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const itemFieldEl = document.getElementById("item-input-field")
const priceFieldEl = document.getElementById("price-input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const sumPriceEl = document.getElementById("sum-price")

addButtonEl.addEventListener("click", function() {
    let inputValue = {item: itemFieldEl.value, price: priceFieldEl.value}
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        let sumPrice = 0
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            /* let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1] */
            let currentPrice = currentItem[1].price.replace(",", ".")
            currentPrice = Number(currentPrice)
            sumPrice = sumPrice + currentPrice
            
            appendItemToShoppingListEl(currentItem)
        }
        sumPrice = sumPrice.toFixed(2)  
        sumPriceEl.innerHTML = `<p><strong>SUM: $${sumPrice}</strong></p>`
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    itemFieldEl.value = ""
    priceFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let itemName = itemValue.item
    let itemPrice = itemValue.price
    
    let newEl = document.createElement("li")
    let newSpan = document.createElement("span")
    let newDelBtn = document.createElement("button")
    
    newDelBtn.setAttribute("id", "delete-btn")
    newDelBtn.innerHTML = `<i class="fas fa-trash"></i>`
    newSpan.textContent = `${itemName} - $${itemPrice}`
    
    newEl.appendChild(newSpan)
    newEl.appendChild(newDelBtn) 
    
    newDelBtn.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}