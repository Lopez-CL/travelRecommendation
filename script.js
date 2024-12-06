// Set up Global Scope
const searchBox = document.getElementById('search-query');
const queryInput = document.getElementById('destination-search');
const inputCancelButton = document.getElementById('cancel-search');
const searchResultsBox = document.getElementById("search-results");
let inputValue = ""
queryInput.addEventListener('input', e =>{
    inputValue = e.currentTarget.value
})
inputCancelButton.addEventListener('click', () =>{
    queryInput.value = "";
    inputValue = "";
})
searchBox.addEventListener('submit', async e =>{
    e.preventDefault();
    searchResultsBox.innerHTML = "";
    let inputIsEmpty = checkForEmpty(inputValue);
    if(!inputIsEmpty){
        let destinations = await getDestinationData();
        let results = topLevelCheck(inputValue, destinations);
        if(results.length !== 0 && results){
            results.forEach(result =>{
                console.log(result);
                let destCard = document.createElement('div');
                destCard.className = "destination-card";
                let destImg = document.createElement('img');
                destImg.src = result.imageUrl;
                destCard.appendChild(destImg);
                let destCardBody = document.createElement('div');
                destCardBody.className = "destination-card__body"
                destCard.appendChild(destCardBody);
                let destHeading = document.createElement('h3');
                destHeading.innerHTML = result.name;
                destCardBody.appendChild(destHeading);
                let destText = document.createElement('p');
                destText.innerHTML = result.description;
                destCardBody.appendChild(destText);
                let actionLink = document.createElement('a');
                actionLink.className = "bttn"
                actionLink.href = "";
                actionLink.innerText = "Visit";
                destCardBody.appendChild(actionLink)
                searchResultsBox.appendChild(destCard);
        })
        }else{
            console.log("hitting this?")
            let destCard = document.createElement('div');
            destCard.innerHTML = `<h3> NO DESTINATIONS FOUND :( </h3>`;
            searchResultsBox.appendChild(destCard);
        }
    }
    // else{
        
    // }
    queryInput.value = "";
})

// Query Handler
function checkForEmpty (query){
    // check if query is empty
    if(query === "" || query.length === 0){ 
        console.log("oops you didn't input anything!")
        return true;
    }
    return false;
}
// conditional #1 (Top level query, will only do this for now)
function topLevelCheck(query, destinations){
    let results = [];
    // console.log(destinations);
    query= query.toLowerCase();
    // Check Country name
    destinations.countries.forEach(country =>{
        if(country.name.toLowerCase().includes(query)){
            console.log("Should hit for Aus")
            country.cities.forEach(city =>{
            results.push(city);
        });
        };
    });
    for(const topCategory in destinations){
            // break; if I wanted keyword match on category only, then I would keep, but if want a any contains match, then removing the break will be necessary
        if(topCategory.includes(query)){
            destinations[topCategory].forEach(loc =>{
                results.push(loc);
            });
            // break;
        }else{
            console.log("not found")
        }
    }
    return results;
}

// Destination Fetch
async function getDestinationData(){
    // grab destination data
    try{
        const res = await fetch('./travel_recommendation_api.json')
            if(!res.ok){
                    throw new Error('Request Failed!')
            , networkError =>{console.log(networkError.message)}
            }else{
                const data = await res.json()
                return data
            }
            
    }catch(err){
    console.log("issue with the test");
    }
}