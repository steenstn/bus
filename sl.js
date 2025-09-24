// https://transport.integration.sl.se/v1/sites/9191/departures

// Use a testCookie for local development
var startTestCookie = btoa(`[{"id":4604, "site":"Ekstubben","destination":"Gullmarsplan","buses":"801"}]`)
var testCookie = `savedSites=${startTestCookie};path=/`;
var isTest = window.location.href.includes("file://");
let getCookie = isTest ? () => {console.log(testCookie); return testCookie} : () => document.cookie;
let setCookie = isTest ? (value) =>{testCookie = `savedSites=${value};path=/`;} : (value) => { document.cookie = `savedSites=${value};path=/`}

function searchSite() {
    searchInternal("siteSearchInput", "siteSearchResult")
}

function searchDestination() {
    searchInternal("destinationSearchInput", "destinationSearchResult")
}

function searchInternal(inputElement, resultElement) {
    let input = document.getElementById(inputElement);
    let searchString = input.value;
    if (searchString.length >=2) {
    let start = performance.now()
        let result = search(searchString, siteNames);
        let output = document.getElementById(resultElement);
        output.textContent = "";
        result.forEach(r => {
            let li = document.createElement("li");
            li.textContent = r.name;
            output.appendChild(li);
        });
        
    console.log(performance.now()-start);
    }
}


function store() {
    let site = document.getElementById("siteSearchInput").value;
    let destination = document.getElementById("destinationSearchInput").value;
    let buses = document.getElementById("busSearchInput").value;

    let id = sites.find(s => s.name === site).id;
    console.log("Storing", id, site, destination, buses);
    let currentStoredSites = getStoredSites();
    currentStoredSites.push({id:id, site: site, destination:destination,buses:buses});
    let resultJson = btoa(JSON.stringify(currentStoredSites));
    console.log(resultJson);
    setCookie(resultJson)
    console.log(getStoredSites());
}

function getStoredSites() {
    let result = parseCookie(getCookie());
    console.log(result);
    return result;
}

function parseCookie(cookie) {
    let savedSitesRegex=/savedSites=(.*);/;
    let match = cookie.match(savedSitesRegex);
    if (match?.length == 2) {
        console.log("matches", match)
        return JSON.parse(atob(match[1]));
    }
    return [];
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


