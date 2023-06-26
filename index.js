import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-ac482-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const itemFieldEl = document.getElementById("item-input-field")
const numberFieldEl = document.getElementById("number-input-field")
const priceFieldEl = document.getElementById("price-input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const sumPriceEl = document.getElementById("sum-price")
const deleteAllEl = document.getElementById("delete-all")

addButtonEl.addEventListener("click", function () {
    let inputValue = { item: itemFieldEl.value, number: numberFieldEl.value, price: priceFieldEl.value }
    push(shoppingListInDB, inputValue)

    clearInputFieldEl()
})

onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        let sumPrice = 0
        clearShoppingListEl()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentNumber = currentItem[1].number ? Number(currentItem[1].number) : 1
            let currentPrice = currentItem[1].price.replace(",", ".")
            currentPrice = Number(currentPrice)
            currentPrice = currentNumber * currentPrice
            sumPrice = sumPrice + currentPrice

            appendItemToShoppingListEl(currentItem, currentPrice)
        }
        sumPrice = sumPrice.toFixed(2)
        sumPriceEl.innerHTML = `<p><strong>SUM: $${sumPrice}</strong></p>`
        deleteAllEl.innerHTML = ` <button id="delete-all-button">
                                        <i class="fas fa-trash"></i> 
                                        DELETE ALL ITEMS 
                                   </button>`

        deleteAllEl.addEventListener("click", function () {
         for(const item of itemsArray){
            let exactLocationOfItemInDB = ref(database, `shoppingList/${item[0]}`)
                remove(exactLocationOfItemInDB)
            }
        sumPriceEl.innerHTML = ""
        deleteAllEl.innerHTML = ""
        })
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
    
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    itemFieldEl.value = ""
    numberFieldEl.value = ""
    priceFieldEl.value = ""
}

function appendItemToShoppingListEl(item, itemTotal) {
    let itemID = item[0]
    let itemValue = item[1]
    let itemName = itemValue.item
    let itemNumber = itemValue.number ? itemValue.number : 1
    let itemPrice = itemValue.price ? itemValue.price.replace(",", ".") : 0
    itemTotal = itemTotal.toFixed(2)

    let newEl = document.createElement("li")
    let newSpan = document.createElement("span")
    let newDelBtn = document.createElement("button")

    newDelBtn.setAttribute("id", "delete-btn")
    newDelBtn.innerHTML = `<i class="fas fa-trash"></i>`
    newSpan.textContent = `${itemName} - ${itemNumber} x $${itemPrice} = $${itemTotal}`

    newEl.appendChild(newSpan)
    newEl.appendChild(newDelBtn)

    newDelBtn.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}