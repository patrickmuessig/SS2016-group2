/**
 * Created by sholzer on the 3.5.2016
 * Reviewed by skaldo on the 6.5.2016
 * Updated by skaldo & sholzer on the 13.05.2016
 * Updated by skaldo on the 14.05.2016 - adjusted to match the tslint rules.
 */

import {Injectable} from 'angular2/core';
import {RestApiProvider} from './RestApiProvider';
import {PersistentDataProvider} from './PersistentDataProvider';
import {Observable} from 'rxjs/Observable';
import {IBusRealTimeData, IUpdateData, IRestStops, IRestBusses, IRestLines, IRestRoutes} from '../model';

@Injectable()
/** 
 * Service class to provide data from the data storage to the app ui
 */
export class CitizenDataService {
    private serverTimeStamps: IUpdateData;

    constructor(private restApi: RestApiProvider, private storageApi: PersistentDataProvider) {
        this.storageApi.getTimeStamps();
        this.updateTimeStamps();
    }

    /**
    * @return A list of Stop object
    */
    public getStops(): Observable<IRestStops> {
        // Check if the data stored is old.
        if (this.serverTimeStamps.stops > this.storageApi.getTimeStamps().stops) {
            let observable = this.restApi.getStops();
            observable.subscribe(data => {
                // Save the data from the server.
                this.storageApi.putStops(data);
            });
            return observable;
        }
        return this.storageApi.getStops();
    }

    /**
    * @return A list of ILine objects
    */
    public getLines(): Observable<IRestLines> {
        // Check if the data stored is old.
        if (this.serverTimeStamps.stops > this.storageApi.getTimeStamps().stops) {
            let observable = this.restApi.getLines();
            observable.subscribe(data => {
                // Save the data from the server.
                this.storageApi.putLines(data);
            });
            return observable;
        }
        return this.storageApi.getLines();
    }

    /**
    * @return A list of Bus objects
    */
    public getBusses(): Observable<IRestBusses> {
        // Check if the data stored is old.
        if (this.serverTimeStamps.stops > this.storageApi.getTimeStamps().stops) {
            let observable = this.restApi.getBusses();
            observable.subscribe(data => {
                // Save the data from the server.
                this.storageApi.putBusses(data);
            });
            return observable;
        }
        return this.storageApi.getBusses();
    }

    /**
    * @return A list of Route objects
    */
    public getRoutes(): Observable<IRestRoutes> {
        // Check if the data stored is old.
        if (this.serverTimeStamps.stops > this.storageApi.getTimeStamps().stops) {
            let observable = this.restApi.getRoutes();
            observable.subscribe(data => {
                // Save the data from the server.
                this.storageApi.putRoutes(data);
            });
            return observable;
        }
        return this.storageApi.getRoutes();
    }

    /**
    * @param id the identifier of a bus
    * @return Object with properties (position:Point) and (delay:number)
    */
    public getIBusRealTimeData(id: number): Observable<IBusRealTimeData> {
        return this.restApi.getRealTimeBusData(id);
    }

    /**
    * Refreshes the last update times from the server.
    */
    public updateTimeStamps(): void {
        this.restApi.getUpdateData().subscribe(updateData => {
            this.serverTimeStamps = updateData;
        });
    }

    /**
     * Starts the automatically fetch of data
     * @param timeInterval the time interval the server is checked for new data
     */
    public startUpdateTimer(timeInterval: number): void {
        // To-be implemented.
    }

    /**
     * Specifies the server to be used
     * @param host_address : host url as string
     */
    public setHostUrl(host_address: string): void {
        this.restApi.baseUrl = host_address;
    }

    private log(message: string): void {
        console.log('CitizenDataService: ' + message);
    }
}
