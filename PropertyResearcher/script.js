const locationLookup = document.getElementById("locationLookup");
const lookupBtn = document.getElementById("lookupBtn");
const countyResult = document.getElementById("countyResult");
const developmentResults = document.getElementById("developmentResults");

function countyNameFromAddress(address = {}) {
  return address.county || address.city_district || address.state_district || null;
}

function cleanCountyName(rawCountyName) {
  if (!rawCountyName) {
    return null;
  }
  return rawCountyName.replace(/\s+county$/i, "").trim();
}

function searchLink(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceMiles(lat1, lon1, lat2, lon2) {
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

function developmentType(tags = {}) {
  return tags.construction || tags.building || tags.landuse || tags.proposed || "Unknown";
}

function developmentSize(tags = {}) {
  return tags["building:levels"] || tags.height || tags.area || "Not listed";
}

function completionDate(tags = {}) {
  return tags.opening_date || tags.opening_hours || tags.completion_date || tags.end_date || "Not listed";
}

function developmentAddress(tags = {}) {
  const number = tags["addr:housenumber"] || "";
  const street = tags["addr:street"] || "";
  const city = tags["addr:city"] || "";
  const state = tags["addr:state"] || "";
  const postalCode = tags["addr:postcode"] || "";

  const line1 = `${number} ${street}`.trim();
  const line2 = [city, state, postalCode].filter(Boolean).join(" ");
  const full = [line1, line2].filter(Boolean).join(", ");

  return full || "Not listed";
}

function renderDevelopments(items, stateName, lat, lon) {
  if (!Array.isArray(items) || items.length === 0) {
    developmentResults.innerHTML =
      "<strong>Nearby Development Activity</strong><p>No nearby development records were returned from the public map dataset.</p>";
    return;
  }

  const topItems = items
    .map((item) => {
      const itemLat = item.lat ?? item.center?.lat;
      const itemLon = item.lon ?? item.center?.lon;
      return {
        ...item,
        milesAway:
          typeof itemLat === "number" && typeof itemLon === "number"
            ? distanceMiles(lat, lon, itemLat, itemLon)
            : null,
      };
    })
    .sort((a, b) => (a.milesAway ?? 999) - (b.milesAway ?? 999))
    .slice(0, 8);

  const list = topItems
    .map((item) => {
      const tags = item.tags || {};
      const name = tags.name || "Unnamed development";
      const type = developmentType(tags);
      const size = developmentSize(tags);
      const completion = completionDate(tags);
      const address = developmentAddress(tags);
      const miles = item.milesAway ? `${item.milesAway.toFixed(2)} mi away` : "distance unavailable";
      const newsQuery = `${name} ${stateName} development news`;

      return `<li>
        <strong>${name}</strong><br />
        Address: ${address}<br />
        Type: ${type} • Size: ${size} • Estimated completion: ${completion} • ${miles}<br />
        <a href="${searchLink(newsQuery)}" target="_blank" rel="noopener noreferrer">Related news search</a>
      </li>`;
    })
    .join("");

  developmentResults.innerHTML = `
    <strong>Nearby Development Activity (within ~5 miles)</strong>
    <ul class="development-list">${list}</ul>
  `;
}

async function fetchNearbyDevelopments(lat, lon, stateName) {
  developmentResults.innerHTML = "<em>Searching nearby development activity...</em>";

  const radiusMeters = 8047; // ~5 miles
  const overpassQuery = `
    [out:json][timeout:25];
    (
      nwr(around:${radiusMeters},${lat},${lon})["landuse"="construction"];
      nwr(around:${radiusMeters},${lat},${lon})["building"="construction"];
      nwr(around:${radiusMeters},${lat},${lon})["construction"];
      nwr(around:${radiusMeters},${lat},${lon})["proposed"];
    );
    out center tags;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API ${response.status}`);
    }

    const payload = await response.json();
    renderDevelopments(payload.elements || [], stateName, lat, lon);
  } catch (error) {
    developmentResults.innerHTML = `<strong>Nearby Development Activity</strong><p>Unable to load development data right now (${error.message}).</p>`;
  }
}

function renderCountyLinks({ countyName, stateName, latitude, longitude, fullQuery }) {
  const countyWebsite = searchLink(`${countyName} County ${stateName} official county website`);
  const propertyAppraiser = searchLink(`${countyName} County ${stateName} property appraiser official`);
  const countyClerk = searchLink(`${countyName} County ${stateName} clerk of court official`);
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${latitude},${longitude}`
  )}`;
  const streetViewHintLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;

  countyResult.innerHTML = `
    <strong>${countyName} County, ${stateName}</strong>
    <ul>
      <li><a href="${countyWebsite}" target="_blank" rel="noopener noreferrer">County Website</a></li>
      <li><a href="${propertyAppraiser}" target="_blank" rel="noopener noreferrer">Property Appraiser / Assessor</a></li>
      <li><a href="${countyClerk}" target="_blank" rel="noopener noreferrer">County Clerk Website</a></li>
      <li><a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">View Property on Google Maps</a></li>
      <li><a href="${streetViewHintLink}" target="_blank" rel="noopener noreferrer">Open Address in Google Maps (Street View if available)</a></li>
    </ul>
    <p><strong>Geo-code coordinates:</strong> ${latitude}, ${longitude}</p>
  `;
}

async function lookupCounty() {
  const query = locationLookup.value.trim();
  if (!query) {
    countyResult.textContent = "Please enter a city or address.";
    return;
  }

  countyResult.textContent = "Looking up county...";

  const endpoint = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&countrycodes=us&q=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoder request failed (${response.status})`);
    }

    const results = await response.json();
    if (!Array.isArray(results) || results.length === 0) {
      countyResult.textContent = "No location found. Try a more complete city or address.";
      return;
    }

    const topResult = results[0];
    const county = cleanCountyName(countyNameFromAddress(topResult.address));
    const state = topResult.address?.state;

    if (!county || !state) {
      countyResult.textContent = "Could not determine county/state from that location. Please try a fuller address.";
      return;
    }

    renderCountyLinks({
      countyName: county,
      stateName: state,
      latitude: topResult.lat,
      longitude: topResult.lon,
      fullQuery: query,
    });
    fetchNearbyDevelopments(Number(topResult.lat), Number(topResult.lon), state);
  } catch (error) {
    countyResult.textContent = `Lookup failed: ${error.message}`;
    developmentResults.innerHTML = "<strong>Nearby Development Activity</strong><p>Unable to run lookup due to geocoding error.</p>";
  }
}

lookupBtn.addEventListener("click", lookupCounty);

locationLookup.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    lookupCounty();
  }
});