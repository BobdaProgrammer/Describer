let CountryFacts = ""
let snippet = ""


function getData() {
    text = document.getElementById("search").value
    text = text.trim()
    if (text != "") {
        document.getElementById("result").textContent = "loading..."
        console.log("sending request...")
        //check the duckduckgo api
        fetch(`https://api.duckduckgo.com/?q=${text}&format=json&origin=*`).
            then(response => {
                if (!response.ok) {
                    throw "Couldn't Find a Description"
                }
                return response.json()
            })
            .then(data => {
                getCountryStats(text)
                if (data["Abstract"] != "") {
                    //get the duckduckgo response
                    document.getElementById("result").innerHTML = `${data["Image"]!=""?`<img class="descImg" src="https://duckduckgo.com${data["Image"]}"><br>`:""}${CountryFacts}${data["Abstract"]}<br><br>Source: <a href="${data["AbstractURL"]}">${data["AbstractSource"]}</a><br>Website: <a href="https://${data["OfficialDomain"]}">${data["OfficialDomain"]}</a>`
                } else {
                    //if duckduckgo isn't helpful, use wikipedia api
                    GetWiki(text)
                }
            }).
            catch(err => {
                console.log(err)
                document.getElementById("result").textContent = "Couldn't find a description"
            })
    }
}

function fetchWikiPageData(name,id) {
    let worked = false
    //search wikipedia for the name
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=${name}&prop=extracts&prop=extracts|pageimages&piprop=original&exintro=1`
    )
      .then((response) => {
        if (!response.ok) {
          throw "Couldn't find a description";
        }
        return response.json();
      })
        .then((data) => {
            //find the right page and get the wikipedua text
            ItemData = data["query"]["pages"][id.toString()];
            answer = ItemData["extract"];
            //check if it is valid
            if (answer.length - (name.length * 2) == 44) {
                worked = false
                return
            }
            let image = ""
            if (ItemData["original"]) {
            image = ItemData["original"]["source"]
            }
            //write the data to the screen
            document.getElementById("result").innerHTML = `<img class="descImg" src="${image}"><br><br><details><summary>Quick summary</summary><p>${snippet}</p></details><br>`+CountryFacts + answer;
            image=""
            worked = true;
      })
      .catch((error) => {
        console.log(name,error);
        worked = false;
      });
    return worked;
}

function GetWiki(text) {
    let worked = false
    //search wikipedia for users query
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srlimit=500&srsearch=${text}`
    ).
    then(response => {
        if (!response.ok) {
            throw "Couldn't find a description"    
        }
        return response.json()
    }).then(data => {
        //get first result
        search = data["query"]["search"][0];
        let name = search["title"]
        //fetch a long extract giving information
        didWork = fetchWikiPageData(name, search["pageid"])
        snippet = search["snippet"]
        //if it doesn't work then just use a small snippet
        if (!didWork) {
            document.getElementById("result").innerHTML=search["snippet"]
        }
        worked=true
    }).catch(error => {
        console.log(error)
        document.getElementById("result").textContent =
            "Couldn't find a description";

    })
    return worked
}

function getCountryStats(name) {
    fetch(
        `https://restcountries.com/v3.1/name/${name}
    `)
    .then(response => {
        if (!response.ok) {
            throw "Couldn't find Country"
        }    
        return response.json()
    }).then(data => {
        data=data["0"]
        languages = []
        for (key in data["languages"]){
            languages.push(data["languages"][key])
        }
        console.log(languages)
        let population = data["population"]
        let drivingSide = data["car"]["side"]
        let gini = ""
        for (key in data["gini"]) {
            gini = key+": "+data["gini"][key]
        }
        let capital = data["capital"][0]
        let currencies = []
        for (key in data["currencies"]){
            currencies.push(data["currencies"][key]["name"])
        }
        CountryFacts = `
        <span><strong>${name}'s statistics</strong></span><br>
        `
        CountryFacts += `Languages spoken: ${languages.toString().replace(/,/g, ", ")}<br>`;
        CountryFacts += `Population: ${population}<br>`
        CountryFacts += `Driving side: ${drivingSide}<br>`;
        CountryFacts += `Gini: ${gini}<br>`;
        CountryFacts += `Capital: ${capital}<br>`;
        CountryFacts += `Currencies: ${currencies.toString().replace(/,/g, ", ")}<br>`;
    }).catch(err => {
        console.log(err)
    })
}

document.getElementById("search").addEventListener("keydown", function (event) {
    console.log(event.key)
    if (event.key == "Enter") {
        getData();
    }
})