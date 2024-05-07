
//collego il file degli annunci 

fetch("./annunci.json").then((response)=>response.json()).then((data)=>{
    let containerCard=document.querySelector("#containerCard");
    let wishList=[];
    
    function showCards(array){
        containerCard.innerHTML= "";
        array.forEach(prodotto => {
            let div=document.createElement("div");
            div.classList.add("card", "col-10","col-md-3", "col-xl-2", "m-4","Wood-2-hex","cardProdotto","text-center");
            div.innerHTML= ` 
                <img src="${prodotto.img}" class="card-img-top mt-2 imgCard" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${prodotto.name}</h5>
                    <p class="card-text">${prodotto.description}</p>
                    <div class="row justify-content-between">
                        <span class="col-3 p-2 btn-card"><i class="fa-solid fa-cart-shopping"></i></span>
                        <span class="col-3 p-2 btn-card"> <i class="${ wishList.includes(prodotto.id.toString()) ? 'fa-solid' : 'fa-regular'} fa-heart" id="${prodotto.id}"></i></span>
                    </div>
                </div>`;
            containerCard.appendChild(div);
        });
        let cuoricini=document.querySelectorAll(".fa-heart");
        cuoricini.forEach((icon)=>{
        icon.addEventListener("click", ()=>{
            if(!wishList.includes(icon.id)){
                wishList.push(icon.id);
            } else {
                let index=wishList.indexOf(icon.id);
                wishList.splice(index, 1);
            }     
            GlobalFiltered();           
        });
    });
    }
    showCards(data);


    // // funzione per aggiungere prodotti nella modale 
    let modalbody= document.querySelector(".modal-body") 
    function ShowWhishList (array){ 
        array.forEach((prodotto)=>{
            let modalCard= document.createElement("div");
            modalCard.classList.add("modal-card", "my-2", "border-2", "border-black", "Wood-2-hex")
            modalCard.innerHTML= `<div class="row text-center justify-content-evenly align-items-center">
                                    <img src="${prodotto.img}" class="img-fluid col-2 my-1" alt="...">
                                    <p class="fs-6 col-2 Wood-4-rgba"> ${prodotto.name} </p>
                                    <p class="fs-6 col-2 Wood-5-rgba"> ${prodotto.description} </p>
                                    <p class="col-2"><i class="fa-solid fa-xmark Wood-4-rgba" id="${prodotto.id}"></i></p>
                                </div>
        `
        modalbody.appendChild(modalCard);
    })
        };

    // funzione per creare i radio buttons delle categorie
    let categoryWrapper= document.querySelector("#filtrocategoria");
    function categoryCreate (){
        let categories = data.map((prodotto)=>prodotto.category);
        let uniqueCategories= [];
        categories.forEach((categoria)=>{
            if(!uniqueCategories.includes(categoria)){
                uniqueCategories.push(categoria);
            }
        });
        uniqueCategories.forEach((categoria)=>{ 
        let checkies=document.createElement("div");
        checkies.classList.add("form-check");
        checkies.innerHTML= `   <input class="form-check-input" type="radio" name="flexRadioDefault" id="${categoria}">
                                <label class="form-check-label" for="${categoria}">
                                    ${categoria}
                                </label>`
        categoryWrapper.appendChild(checkies);
    });   
    };
    categoryCreate();

    // funzione che filtra le categorie premendo i tastini appena creati  
    let check_buttons= document.querySelectorAll(".form-check-input"); // querySelectorAll mi cattura tutti i check buttons e li restituisce sotto forma di un array 
    function filterByCategory(array){
        // per gli array like (node-list), come check_buttons in questo momento, è possibile eseguire solamente forEach, quindi bisogna riconvertirlo in un array attraverso from
        // let check_buttonsArray = Array.from(check_buttons); // converte check_buttons in un array
        // let check_buttons_active= check_buttonsArray.find((checkbutton)=>checkbutton.checked); // cerca il bottone che contiene checked come attributo (attributo dei radio buttons)
        // let categoria= check_buttons_active.id;
        // tutto questo si può scrivere in una riga sola
        let categoria=Array.from(check_buttons).find((check_button)=>check_button.checked).id;
        if (categoria != "all"){
            let filtered = array.filter((prodotto)=>prodotto.category==categoria);
            return filtered;
        } else {return array;}
    };

    // funzione che filtra per forme attraverso i tasti creati appositamente
    let tabs= document.querySelectorAll(".tabs");
    function filterByForm(array){
        let form=Array.from(tabs).find((tab)=> tab.classList[6]== "tabsActive").id;
        if (form != "Tutto"){
            let filteredForm = array.filter((prodotto) => prodotto.categoryForm == form);
            return filteredForm;
        } else {return array;} 
    };

    // funzione che filtra per parola
    let searchinput= document.querySelector("#searchtext");
    function filterByWord(array){
        let includesWord= array.filter((prodotto)=> prodotto.name.toLowerCase().includes(searchinput.value.toLowerCase())); // toLowerCase è un metodo che rende tutte le parole in minuscolo
        return includesWord;
    }
    
    //funzione globale
    function GlobalFiltered(){
        let filteredByCategory= filterByCategory(data);
        let filteredByFormAndCategory= filterByForm(filteredByCategory);
        let filteredByWordAndFormAndCategory= filterByWord(filteredByFormAndCategory);
        showCards(filteredByWordAndFormAndCategory);
        let filtropreferiti = data.filter((prodotto) => wishList.includes(prodotto.id.toString()));
        modalbody.innerHTML = "";
        ShowWhishList(filtropreferiti);
    }

    // evento che filtra per categoria al premere del bottone
    check_buttons.forEach((button)=>{
        button.addEventListener("click", ()=>{
        GlobalFiltered();
        })
    })

    // evento che filtra per forma al premere del bottone
    let variabileid="Tutto";
    tabs.forEach((button_form)=>{
        button_form.addEventListener("click", ()=>{
            if(variabileid){
                let id= document.getElementById(variabileid);
                id.classList.remove("tabsActive");
            }
            button_form.classList.add("tabsActive");
            GlobalFiltered();
            variabileid=button_form.id;
        })
    });

    // evento che filtra per parola all'inserimento di essa
    searchinput.addEventListener("input",()=>{
        GlobalFiltered();
    });

    

})

