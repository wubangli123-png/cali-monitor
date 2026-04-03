/**
 * Converts MapsCali/mc_barrios.shp (EPSG:6249 Magna-Sirgas Cali) to
 * public/barrios.geojson (WGS84 / EPSG:4326).
 *
 * Run once: node scripts/convert-barrios.mjs
 */

import shapefile from "shapefile";
import proj4 from "proj4";
import { writeFileSync } from "fs";

// EPSG:6249 — Magna-Sirgas / Cali Transverse Mercator
const EPSG6249 =
  "+proj=tmerc +lat_0=3.441883333333334 +lon_0=-76.5205625 +k=1.0" +
  " +x_0=1061900.18 +y_0=872364.63 +ellps=GRS80 +units=m +no_defs";
const WGS84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

function reproject([x, y]) {
  return proj4(EPSG6249, WGS84, [x, y]);
}

function reprojectCoords(coords) {
  if (typeof coords[0] === "number") return reproject(coords);
  return coords.map(reprojectCoords);
}

function centroid(ring) {
  let sumX = 0, sumY = 0;
  for (const [x, y] of ring) { sumX += x; sumY += y; }
  return [sumX / ring.length, sumY / ring.length];
}

async function main() {
  const source = await shapefile.open(
    "MapsCali/mc_barrios.shp",
    "MapsCali/mc_barrios.dbf",
    { encoding: "latin1" }
  );

  const features = [];

  while (true) {
    const { done, value: feature } = await source.read();
    if (done) break;
    if (!feature?.geometry) continue;

    const { geometry, properties } = feature;
    const reprojectedCoords = reprojectCoords(geometry.coordinates);

    let outerRing;
    if (geometry.type === "Polygon") {
      outerRing = reprojectedCoords[0];
    } else if (geometry.type === "MultiPolygon") {
      outerRing = reprojectedCoords[0][0];
    }

    const [cLng, cLat] = outerRing ? centroid(outerRing) : [null, null];

    features.push({
      type: "Feature",
      geometry: { type: geometry.type, coordinates: reprojectedCoords },
      properties: {
        id_barrio: String(properties.id_barrio ?? "").trim(),
        barrio: String(properties.barrio ?? "").trim(),
        comuna: String(properties.comuna ?? "").trim(),
        centroid_lat: cLat,
        centroid_lng: cLng,
      },
    });
  }

  const geojson = { type: "FeatureCollection", features };
  writeFileSync("public/barrios.geojson", JSON.stringify(geojson));
  console.log(`✓ Exported ${features.length} barrios to public/barrios.geojson`);
}

main().catch((err) => { console.error(err); process.exit(1); });
