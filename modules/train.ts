import { SimulatorConfig } from "../models/config";

/**
 * Class representing the train in our universe.
 */
export class SimulatorTrain {
    /**
     * The station at which the train is at any point of time.
     */
    private currentStation: number;

    /**
     * This is to track the time when the train is moving.
     */
    private intervalId: NodeJS.Timeout;

    /**
     * This is the next stop, i.e. the station to which the train is moving.
     * When stationary, it's same as the currentStation.
     */
    private destination: number;

    /**
     * Constructor to create an instance of train.
     * 
     * @param config The configuration of the universe.
     * @param rate The rate at which the time moves in the universe.
     */
    constructor(private config: SimulatorConfig,
        public rate: Rate = Rate.normal) {
        this.currentStation = config.startLocation;
        this.destination = this.currentStation;
    }

    /**
     * We are allowing the rate to change, i.e. the speed at which the time moves.
     *
     * @param newRate Updated rate.
     */
    public updateRate(newRate: Rate): void {
        this.rate = newRate;
    }

    /**
     * Move towards a station.
     * 
     * @param location Destination station
     */
    public go(location: number): void {
        if (!this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        if (this.currentStation === location) {
            console.log('Already at ' + location);
            return;
        }
        this.destination = location;

        // Note: I am trying to round off the time interval as a simplification.
        // It's already in ms, assumption is that we don't require that level of detail
        const timeInterval = Math.floor(1 / this.rate * 1000);
        console.log(timeInterval);
        this.intervalId = setInterval(() => {
            if (this.currentStation !== this.destination) {
                this.currentStation = this.destination > this.currentStation
                    ? Math.min(this.currentStation + this.config.speed, this.config.stationCount, this.destination)
                    : Math.max(this.currentStation - this.config.speed, 1, this.destination);
            }

            if (this.currentStation === this.destination) {
                console.log('AT ' + this.destination);
                clearInterval(this.intervalId);
            }
        }, timeInterval);
    }
}