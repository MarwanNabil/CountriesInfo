let countriesNames = new Array();
let flags = new Map();
let region = new Map();
let population = new Map();
let capital = new Map();

function getCountries(){

    return new Promise( (resolve , reject) => {
        let myRequest = new XMLHttpRequest();
        myRequest.open("GET" , "https://restcountries.com/v3.1/all");
        myRequest.send();

        myRequest.onload = function() {
            if(this.status === 200 && this.readyState === 4){
                resolve(JSON.parse(this.responseText));
            } else {
                reject(new Error("No Data Found!"))
            }
        }

    });

}

function isPrefix(big , small){
    if(big.length < small.length)
        return false;
    for(let i = 0; i < small.length; i++){
        if(small[i] !== big[i])
            return false;
    }
    return true;
}

function item(flag , name , region , population , capital){
    let item = document.createElement("div");
    item.classList.add("item");

    let img = document.createElement("img");
    img.src = flag;


    let item_title = document.createElement("h6");
    item_title.innerText = name;

    let item_detail = document.createElement("div");
    item_detail.classList.add("details");

    let item_pop = document.createElement("p");
    item_pop.innerText = "Population : " + population;

    let item_capital = document.createElement("p");
    item_capital.innerText = "Capital : " + capital;

    let item_region = document.createElement("p");
    item_region.innerText = "Region : " + region;

    item.append(img);
    item_detail.appendChild(item_title);
    item_detail.appendChild(item_pop);
    item_detail.appendChild(item_region);
    item_detail.appendChild(item_capital);
    item.append(item_detail);

    return item;
}

function load(prefix){
    let slave = document.getElementById("pr");
    slave.innerText = "";
    for(let i = 0; i < countriesNames.length; i++){
        if(isPrefix(countriesNames[i] , prefix)){
            let cand = new String(countriesNames[i]).toLocaleLowerCase();
            slave.appendChild(item(flags.get( cand ) , cand , region.get(cand) , population.get(cand) , capital.get(cand)));
        }
    }
}

async function main(){
    let countriesData = await getCountries();

    for(let i = 0; i < countriesData.length; i++){
        let candidate = new String(countriesData[i]["name"]["official"]).toLocaleLowerCase();
        countriesNames.push(candidate);
        flags.set( candidate , countriesData[i]["flags"]["png"]);
        region.set( candidate , countriesData[i]["region"]);
        population.set(candidate , countriesData[i]["population"]);
        capital.set(candidate , countriesData[i]["capital"]);
    }

    load("");


}

main();

let myPrf = new Array();
document.getElementById("searchText").oninput = (event) => {
    if(event.data == null){
        myPrf.pop();
    } else {
        myPrf.push(new String(event.data).toLocaleLowerCase());
    }
    load(myPrf.join(""));
};
