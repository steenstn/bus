function parseCookie(cookie) {
    let savedSitesRegex=/savedSites=(.*);/;
    let match = cookie.match(savedSitesRegex);
    if (match?.length == 2) {
        return JSON.parse(atob(match[1]));
    }
    return [];
}

function search(searchString, siteNames) {
    return siteNames.filter(s => s.name.toLowerCase().includes(searchString.toLowerCase()));
}
