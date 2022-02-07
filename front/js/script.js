fetch(`http://localhost:3000/api/products`) // Récupération des données de tous les objets
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
            return articleCanapes(data)
        }
    })
    .catch(error => {
        let items = document.getElementById("items");
        let errorMsg = document.createElement("p")
        errorMsg.innerHTML = "Erreur de communication avec le serveur."
        items.appendChild(errorMsg)
        console.error(error.message)})

function articleCanapes(liste) { /* Afficher chaque canapé présent dans la liste de produits du Back */
    let items = document.getElementById("items");
    for (let elem of liste) {
        let lienArticles = document.createElement("a")
        let articles = document.createElement("article")
        let imgArticles = document.createElement("img")
        let nomProduits = document.createElement("h3")
        let descriptionProduits = document.createElement("p")

        descriptionProduits.innerHTML = elem.description
        descriptionProduits.class = `productDescription`
        nomProduits.innerHTML = elem.name
        nomProduits.className = `productName`
        imgArticles.src = elem.imageUrl
        imgArticles.alt = elem.altTxt
        lienArticles.href = `./product.html?id=${elem._id}`

        items.appendChild(lienArticles)
        lienArticles.appendChild(articles)
        articles.appendChild(imgArticles)
        articles.appendChild(nomProduits)
        articles.appendChild(descriptionProduits)
    }
}
