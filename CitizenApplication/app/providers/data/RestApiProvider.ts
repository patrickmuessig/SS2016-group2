/**
* Created by skaldo on 07.05.2016.
*/
import {RestApiProviderInterface} from "./RestApiProviderInterface";
import {UpdateData} from '../model/UpdateData';
import {Bus} from '../model/Bus';
import {Line} from '../model/Line';
import {Route} from '../model/Route';
import {Stop} from '../model/Stop';
import {Point} from '../model/geojson/Point';
import {Injectable, Inject, Component} from 'angular2/core';
import {Http, Response, URLSearchParams, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map'

@Injectable()
export class RestApiProvider implements RestApiProviderInterface {
    private BASE_URL = "http://localhost:3000" // Change to productive adress
    data: any = null;
    constructor(@Inject(Http) private http : Http) { };
    getUpdateDataFromServer():UpdateData {
        let data = new UpdateData();
        let result = this.getJSONString('update', 'busses, lines, routes, stops');
        
        result.catch(resultData => {
           data.busses = resultData.busses;
           data.lines = resultData.lines;
           data.routes = resultData.routes;
           data.stops = resultData.stops; 
        });
        
        return data;
    }
    getBussesFromServer(){
        let busses = new Array<Bus>();
        
        
        let result = this.getJSONString('busses', 'busses');
        
        result.catch(resultData => {
            resultData.busses.forEach(busData => {
            let bus = new Bus();
            bus.color = busData.color;
            bus.id = busData.id;
            bus.numberPlate = busData.numberPlate;
            bus.pictureLink = busData.picture;
            busses.push(bus);    
            }) 
        });
        
        return busses;
    }
    getLinesFromServer(){
        let lines = new Array<Line>();
        
        let result = this.getJSONString('lines', 'lines');
        
        result.catch(resultData => {
            resultData.lines.forEach(lineData => {
                let line = new Line();
                line.id = lineData.id;
                line.busses = lineData.busses;
                line.name = lineData.name;    
                line.routeRef = lineData.routeRef;            
                lines.push(line);
            });
        });            
        
        return lines;
    }
    getStopsFromServer(){
        let stops = new Array<Stop>();
        let result = this.getJSONString('stops', 'stops, timestamp');
        result.catch(resultData => {
            resultData.stops.forEach(stopData => {
                let stop = new Stop();
                stop.id = stopData.id;
                stop.location = new Point(stopData.location.latitude, stopData.location.longitude);
                stop.name = stopData.name;
                stop.schedule = stopData.schedule;
                
                stops.push(stop);
            });
        });            
        
        return stops;
        
    }
    getRoutesFromServer(){
        let routes = new Array<Route>();
        
        let result = this.getJSONString('routes', 'routes');
        
        result.catch(resultData => {
            resultData.routes.forEach(routeData => {
                let route = new Route();
                route.id = routeData.id;
                let gpsPoints = new Array<Point>();
                routeData.gpsData.forEach(gpsDatas => {
                    let point = new Point(gpsDatas.latitude, gpsDatas.longitude)
                    gpsPoints.push(point);
                })
                route.gpsData = gpsPoints;
                routes.push(route);
            });
        });            
        
        return routes;
    }
    getRealTimeBusData(id: number){
        let result = this.getJSONString("busses/" + id, "position, delay")
        let point;
        let delay = 0;
        
        result.catch(resultData => {
           point = new Point(resultData.position.latitude, resultData.position.longitude);
           delay = resultData.delay;
        });
        
        return { position: new Point(0,0), delay: 0 };
    }
    
    private getJSONString(searchString: string, fields: string){
        let params: URLSearchParams = new URLSearchParams();
        params.set('results', '0:50');
        params.set('fields', fields);
        
        let url = this.BASE_URL + searchString;
        
        return new Promise(resolve => {
            this.http.get(url, params)
            .map(res => res.json())
            .subscribe(data => {
                this.data = data;
                resolve(this.data);
            })
        })
     }
}