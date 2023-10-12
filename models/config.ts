/**
 * The configuration of the simulator.
 * This carries the basic values required to setup our universe.
 */
export class SimulatorConfig {

    /**
     * Constructor that takes the value and generates the configuration.
     *
     * @param stationCount The number of stations in our universe. This can be set only one.
     * @param startLocation The train station the train would be at the beginning.
     * Consider it similar to the big stations where the train yard is located. This can only be set once at the beginning of the program.
     * @param speed Speed of the train. Once the speed is assigned, we are keeping the train at the same speed for the entire simulation.
     */
    constructor(public readonly stationCount: number = 4,
        public readonly startLocation: number = 1,
        public readonly speed: number = 0.5
    ) { }
}
