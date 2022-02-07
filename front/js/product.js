const urlid = window.location.search

const urlParams = new URLSearchParams(urlid)

const id = urlParams.get('id') 


fetch (`http://localhost:3000/api/products/` + id) // Récupération des données du produit dont nous sommes sur la page uniquement
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
            return afficherProduit(data)
        }
    })
    .catch(error => console.error(error.message))


function afficherProduit(kanap) { /* Afficher les éléments du produits selectionné */
    let nomProduits = document.getElementById("title")
    nomProduits.innerHTML = kanap.name

    let prixProduits = document.getElementById("price")
    prixProduits.innerHTML = kanap.price

    let descriptionProduits = document.getElementById("description")
    descriptionProduits.innerHTML = kanap.description

    let itemImg = document.getElementsByClassName("item__img")
    let imgKanap = document.createElement("img")

    imgKanap.src = kanap.imageUrl
    imgKanap.alt = "Photographie de" + kanap.name

    itemImg[0].appendChild(imgKanap)
    
    for (let i = 0; i < kanap.colors.length; i++) {
        let optioncouleurs = document.getElementById("colors")
        let couleurs = document.createElement("option")
        
        couleurs.value = kanap.colors[i]
        couleurs.innerHTML = kanap.colors[i]

        optioncouleurs.appendChild(couleurs)
    }
    
}