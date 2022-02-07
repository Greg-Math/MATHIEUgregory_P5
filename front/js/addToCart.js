let buttonCart = document.getElementById("addToCart")
buttonCart.addEventListener('click', ajoutPanier)

function isInTheCart(array, product) { // Verifie si la couleur du produit selectionné est deja presente dans un tableau 
    if (!array) {
        return undefined
    }
    for (let elem of array) {
      if (elem.color === product.color) {
        return elem
      }
    }
    return undefined
}

function ajoutPanier() { // Ajoute les infos "ID, Couleur et Quantité du produit" au Local Storage 
    let productId = urlParams.get('id')
    let productColor = document.getElementById("colors").value
    let productQuantity = +document.getElementById("quantity").value /* opérateur "+" collé a une variable la transforme en Type Nombre */
    let productName = document.getElementById("title").innerHTML

    if (!productColor || !productQuantity) {
        return alert("Un des champs est invalide.")
    }

    let product = {color: productColor, quantity: productQuantity, name: productName}
    let panier = JSON.parse(localStorage.getItem('panier')) || {}
    let alreadyInCart = isInTheCart(panier[productId], product)

    if (alreadyInCart !== undefined){
        alreadyInCart.quantity += productQuantity 
    }
    else {
        if (panier[productId]) {
            panier[productId].push(product)
        }
        else 
            panier[productId] = [product]
    }
    localStorage.setItem('panier',JSON.stringify(panier))
    alert("Le produit à bien été ajouté au panier.")
}