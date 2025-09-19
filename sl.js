// https://transport.integration.sl.se/v1/sites/9191/departures

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


