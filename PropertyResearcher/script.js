const locationLookup = document.getElementById("locationLookup");
const lookupBtn = document.getElementById("lookupBtn");
const countyResult = document.getElementById("countyResult");

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

function findParcelNumber(geoResult) {
  const possible = [
    geoResult?.extratags?.parcel_number,
    geoResult?.extratags?.parcel,
    geoResult?.extratags?.ref,
    geoResult?.extratags?.["ref:parcel"],
    geoResult?.extratags?.["parcel:id"],
  ].filter(Boolean);

  return possible.length > 0 ? possible[0] : null;
}

function renderCountyLinks({ countyName, stateName, latitude, longitude, fullQuery, parcelNumber }) {
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
    <p><strong>Parcel number:</strong> ${
      parcelNumber ?? "Not available from geocoder. Please check the county assessor/appraiser site."
    }</p>
  `;
}

async function lookupCounty() {
  const query = locationLookup.value.trim();
  if (!query) {
    countyResult.textContent = "Please enter a city or address.";
    return;
  }

  countyResult.textContent = "Looking up county...";

  const endpoint = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&extratags=1&limit=1&countrycodes=us&q=${encodeURIComponent(
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
      parcelNumber: findParcelNumber(topResult),
    });
  } catch (error) {
    countyResult.textContent = `Lookup failed: ${error.message}`;
  }
}

lookupBtn.addEventListener("click", lookupCounty);

locationLookup.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    lookupCounty();
  }
});