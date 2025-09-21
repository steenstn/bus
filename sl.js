// https://transport.integration.sl.se/v1/sites/9191/departures


function searchSite() {
    searchInternal("siteSearchInput", "siteSearchResult")
}

function searchDestination() {
    searchInternal("destinationSearchInput", "destinationSearchResult")
}

function searchInternal(inputElement, resultElement) {
    let start = performance.now()
    let input = document.getElementById(inputElement);
    let searchString = input.value;
    if (searchString.length >=2) {
        let result = search(searchString, siteNames);
        //console.log(result);
        let output = document.getElementById(resultElement);
        output.innerHTML = result.map(r => "<li value=\""+ r.name + "\">" + r.name + "</li>").slice(0,10).join("");
    }
    console.log(performance.now()-start);
}


function store() {
    let site = document.getElementById("siteSearchInput");
    let destination = document.getElementById("destinationSearchInput");
    let buses = document.getElementById("busSearchInput");

    console.log(site.value, destination.value, buses.value);
    let result = {site: site.value, destination:destination.value,buses:buses.value};
    let resultJson = JSON.stringify(result);
    document.cookie = `savedSites=${resultJson};path=/`;
    console.log(document.cookie)
}

function search(searchString, siteNames) {
    return siteNames.filter(s => s.name.toLowerCase().includes(searchString.toLowerCase()));
}

async function getDepartures(stop, buses, destinations) {
    const url = `https://transport.integration.sl.se/v1/sites/${stop}/departures`;
    const response = await fetch(url);
    if (!response.ok) {
        console.log(`Response status: ${response.status}`);
        return [];
    }
    const result = await response.json();
    //console.log(result);

    const filtered = result.departures
    .filter(d => buses.includes(d.line.designation) && destinations.includes(d.destination))
    .map(d => ({designation: d.line.designation, destination: d.destination, display: d.display}));
      
    return filtered;
}


