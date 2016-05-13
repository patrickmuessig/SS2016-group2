/**
 * Created by sholzer on 03.05.2016 after GeoJSon specification.
 * Updated & reviewed by skaldo on 05.05.2016 & 13.05.2016.
 */

import IGeoJsonObject from './geojsonObject.ts';
import Coordinate from './Coordinate.ts';

export default Point;

export class Point implements IGeoJsonObject {
    type: "Point";
    coordinates: Array<Coordinate>;
    constructor(x: number, y: number) {
        this.coordinates = [new Coordinate(x, y)];
    }
}