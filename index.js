function getData() {
    text = document.getElementById("search").value
    text = text.trim()
    if (text != "") {
        document.getElementById("result").textContent = "loading..."
        console.log("sending request...")
        fetch(`https://api.duckduckgo.com/?q=${text}&format=json&origin=*`).
            then(response => {
                if (!response.ok) {
                    throw "Couldn't Find a Description"
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
                if (data["Abstract"] != "") {
                    console.log(data)
                    document.getElementById("result").innerHTML = `${data["Image"]!=""?`<img class="descImg" src="https://duckduckgo.com${data["Image"]}">`:""}${data["Abstract"]}<br><br>Source: <a href="${data["AbstractURL"]}">${data["AbstractSource"]}</a><br>Website: <a href="https://${data["OfficialDomain"]}">${data["OfficialDomain"]}</a>`
                } else {
                    let worked = GetWiki(text)
                    if (!worked) {
                        //document.getElementById("result").textContent = "Couldn't find a description"
                    }
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
        console.log(data)
        ItemData = data["query"]["pages"][id.toString()];
        answer = ItemData["extract"];
            if (answer.length - (name.length * 2) == 44) {
                worked = false
                return
            }
        let image = ""
        if (ItemData["original"]) {
            image = ItemData["original"]["source"]
        }
            document.getElementById("result").innerHTML = `<img class="descImg" src="${image}">` + answer;
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
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srlimit=500&srsearch=${text}`
    ).
    then(response => {
        if (!response.ok) {
            throw "Couldn't find a description"    
        }
        return response.json()
    }).then(data => {
        search = data["query"]["search"][0];
        let name = search["title"]
        didWork = fetchWikiPageData(name,  search["pageid"])
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

document.getElementById("search").addEventListener("keydown", function (event) {
    console.log(event.key)
    if (event.key == "Enter") {
        getData();
    }
})