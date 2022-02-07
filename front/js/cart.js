let panier = JSON.parse(localStorage.getItem('panier'))


function delProduit(elem) { // Suppression d'un element du panier par un utilisateur
    let itemsPanier = document.getElementById("cart__items")
    itemsPanier.removeChild(elem.target.closest('article'))

    let idcanap = elem.target.closest('article').dataset.id
    let colorcanap = elem.target.closest('article').dataset.color
    let panier = JSON.parse(localStorage.getItem('panier'))
    let kanap = panier[idcanap].find(elem => elem.color === colorcanap )

    panier[idcanap].splice(panier[idcanap].indexOf(kanap),1)
    localStorage.setItem('panier',JSON.stringify(panier))
    majPanier()
}

function modifQttPanier(elem) {  // Modification de la quantité d'un élément du panier par un utilisateur
    let idcanap = elem.target.closest('article').dataset.id
    let colorcanap = elem.target.closest('article').dataset.color
    let panier = JSON.parse(localStorage.getItem('panier'))
    let kanap = panier[idcanap].find(elem => elem.color === colorcanap )

    kanap.quantity = +elem.target.value

    localStorage.setItem('panier',JSON.stringify(panier))
    majPanier()
}

async function majPanier() { // Mise à jour du nombre d'article et du prix du panier quand un utilisateur fait une modification directe du panier
    let panier = JSON.parse(localStorage.getItem('panier'))

    let panierPrice = 0
    let panierQuantity = 0
    for (let id in panier) {
        let dataproduit = await informationProduit(id)
        for (let elem of panier[id]){
            panierPrice += dataproduit.price * elem.quantity
            panierQuantity += elem.quantity
        }
    }
    let totalArticles = document.getElementById("totalQuantity")
    totalArticles.innerHTML = panierQuantity

    let totalPrice = document.getElementById("totalPrice")
    totalPrice.innerHTML = panierPrice
}

async function informationProduit(id) { // Récupère les informations de chaque produits dont l'id est dans le Local Storage
    const res = await fetch(`http://localhost:3000/api/products/` + id)
        .then(res => {
            if(res.ok){
                return res.json()
            }
            else {
                throw new Error("Erreur de l'API")
            }
        })
        return res
}

async function afficherPanier(obj) {  // Affiche tous les produits du Local Storage dans le panier
    let itemsPanier = document.getElementById("cart__items")
    let panierPrice = 0
    let panierQuantity = 0
    for (let id in obj) {
        let dataproduit = await informationProduit(id)
        for (let elem of obj[id]){
            let itemArticle = document.createElement("article")
            itemArticle.className = `cart__item`
            itemArticle.dataset.id = id
            itemArticle.dataset.color = elem.color
            itemsPanier.appendChild(itemArticle)

            let imgDiv = document.createElement("div")
            imgDiv.className = `cart__item__img`
            itemArticle.appendChild(imgDiv)

            let productImg = document.createElement("img")
            productImg.src = dataproduit.imageUrl
            productImg.alt = "Photographie d'un canapé"
            imgDiv.appendChild(productImg)

            let itemContentDiv = document.createElement("div")
            itemContentDiv.className = `cart__item__content`
            itemArticle.appendChild(itemContentDiv)

            let itemDescription = document.createElement("div")
            itemDescription.className = `cart__item__content__description`
            itemContentDiv.appendChild(itemDescription)

            let productName = document.createElement("h2")
            productName.innerHTML = elem.name
            itemDescription.appendChild(productName)

            let productColor = document.createElement("p")
            productColor.innerHTML = elem.color
            itemDescription.appendChild(productColor)

            let productPrice = document.createElement("p")
            productPrice.innerHTML = dataproduit.price + "€"
            itemDescription.appendChild(productPrice)
            
            let itemSettings = document.createElement("div")
            itemSettings.className = `cart__item__content__settings`
            itemContentDiv.appendChild(itemSettings)

            let itemQuantity = document.createElement("div")
            itemQuantity.className = `cart__item__content__settings__quantity`
            itemSettings.appendChild(itemQuantity)

            let productQuantity = document.createElement("p")
            productQuantity.innerHTML = "Qté : "
            itemQuantity.appendChild(productQuantity)

            let inputQuantity = document.createElement("input")
            inputQuantity.type = `number`
            inputQuantity.className = `itemQuantity`
            inputQuantity.name = `itemQuantity`
            inputQuantity.min = 1
            inputQuantity.max = 100
            inputQuantity.value = elem.quantity
            itemQuantity.appendChild(inputQuantity)
            inputQuantity.addEventListener('change', modifQttPanier)

            let settingDelete = document.createElement("div")
            settingDelete.className = `cart__item__content__settings__delete`
            itemSettings.appendChild(settingDelete)

            let itemDelete = document.createElement("p")
            itemDelete.className = `deleteItem`
            itemDelete.innerHTML = "Supprimer"
            settingDelete.appendChild(itemDelete)
            itemDelete.addEventListener('click', delProduit)

            let productPriceTotal = dataproduit.price * elem.quantity

            panierPrice += productPriceTotal
            panierQuantity += +elem.quantity

        }
    }
    let totalArticles = document.getElementById("totalQuantity")
    totalArticles.innerHTML = panierQuantity

    let totalPrice = document.getElementById("totalPrice")
    totalPrice.innerHTML = panierPrice
}

if (location.href.includes("cart")) {  // Si on est sur la page "cart", ajout d'un evenement sur le bouton de confirmation
    afficherPanier(panier)

    let confirmationButton = document.getElementById("order")
    confirmationButton.addEventListener('click', confirmationPanier)
}
else {   // Sinon prendre l'id de la page qui est utilisé comme Numero de commande et l'afficher
    const urlid = window.location.search
    const urlParams = new URLSearchParams(urlid)
    const orderId = urlParams.get('id')

    let order = document.getElementById("orderId")
    order.innerHTML = orderId
}

function confirmationPanier(elem) {  // Confirmation du panier apres vérification de toute les informations de l'utilisateurs
    elem.preventDefault()
    const nameRegex = /^[A-zÀ-ú' -]*$/
    const addressRegex = /([0-9]{1,}) ?([A-zÀ-ú,' -\. ]*)/
    const mailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

// Vérification de chaque champ de saisie
    let inputOk = true

    let inputFirstName = document.getElementById("firstName").value
    let firstnameError = document.getElementById("firstNameErrorMsg")
    if (!inputFirstName.match(nameRegex) || !inputFirstName.length) {
        firstnameError.innerHTML = "Prénom incorrect"
        inputOk = false
    }
    else {
        firstnameError.innerHTML = ""
    }
    
    let inputLastName = document.getElementById("lastName").value
    let lastnameError = document.getElementById("lastNameErrorMsg")
    if (!inputLastName.match(nameRegex)  || !inputLastName.length) {
        lastnameError.innerHTML = "Nom incorrect"
        inputOk = false
    }
    else {
        lastnameError.innerHTML = ""
    }

    let inputAddress = document.getElementById("address").value
    let adressError = document.getElementById("addressErrorMsg")
    if (!inputAddress.match(addressRegex) || !inputAddress.length) {
        adressError.innerHTML = "Adresse incorrecte"
        inputOk = false
    }
    else {
        adressError.innerHTML = ""
    }

    let inputVille = document.getElementById("city").value
    let villeError = document.getElementById("cityErrorMsg")
    if (!inputVille.match(nameRegex) || !inputVille.length) {
        villeError.innerHTML = "Nom de Ville incorrecte"
        inputOk = false
    }
    else {
        villeError.innerHTML = ""
    }

    let inputEmail = document.getElementById("email").value
    let emailError = document.getElementById("emailErrorMsg")
    if (!inputEmail.match(mailRegex) || !inputEmail.length) {
        emailError.innerHTML = "Adresse mail incorrecte"
        inputOk = false
    }
    else {
        emailError.innerHTML = ""
    }

    if (inputOk) { // Si tous les input sont validés
        const contact = {
            firstName : inputFirstName,
            lastName : inputLastName,
            address : inputAddress,
            city : inputVille,
            email : inputEmail
        }

        const products = []
        let panier = JSON.parse(localStorage.getItem('panier'))
        for (let elem in panier){
            products.push(elem)
        }

        let body = JSON.stringify({contact, products})

        const requestSettings = {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body
        }

        fetch('http://localhost:3000/api/products/order' ,requestSettings) // récupération du numéro de commande 
            .then(res => {
                if(res.ok){
                    return res.json()
                }
                else {
                    throw new Error("Erreur de l'API")
                }
            })
            .then(data => {
                if(data){
                    localStorage.clear()
                    location.href = `./confirmation.html?id=${data.orderId}`
                }
            })
    }
}