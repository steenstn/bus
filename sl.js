async function getDeparturesByDestinations(stop, ...destinations) {
    const url = `https://transport.integration.sl.se/v1/sites/${stop}/departures`;
    const response = await fetch(url);
    if (!response.ok) {
        console.log(`Response status: ${response.status}`);
        return ["Kunde inte hämta data"];
    }
    const result = await response.json();
    console.log(result);
    const filtered = result.departures
    .filter(d => destinations.includes(d.destination))
    .map(d => d.line.designation + " mot " + d.destination + " - " + d.display + "\n");
      
    return filtered.length === 0 ? ["Inga resultat"] : filtered;
}


