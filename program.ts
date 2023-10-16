import { exit } from "process";
import { SimulatorConfig } from "./models/config";
import { SimulatorTrain } from "./modules/train";
import { Rate, Phases, SetType } from "./models/enums";


/**
 * The program class to run Program application.
 */
export abstract class Program {
    /**
     * The configuration of the simulator.
     */
    private static config: SimulatorConfig;

    /**
     * Train in the simulator.
     */
    private static train: SimulatorTrain;

    /**
     * Total number of stations to be created.
     */
    private static stationCount: number = 4;

    /**
     * The station to start the train at.
     */
    private static startLocation: number = 1;

    /**
     * The time in this universe.
     */
    private static rate: Rate = Rate.normal;

    /**
     * Speed of the train.
     */
    private static speed: number = 0.5;

    /**
     * The phase the program is at.
     */
    private static currentPhase: Phases = Phases.Setup;

    /**
     * Performs the corresponding actions to the given command.
     * 
     * @param command The incoming command from user.
     */
    public static processCommand(command: string): void {
        const cmd = command.toLowerCase().split(' ');
        if (!command[0]
            || (!['stop', 'start'].includes(command[1]) && !command[1])
            || (command[1] === 'set' && !command[2])) {
            console.error('ERROR Missing arguments. Please read README');
            return;
        }
        switch (cmd[0]) {
            case 'stop': exit(0);
            case 'set': Program.setValue(cmd[1] as SetType, parseFloat(cmd[2])); break;
            case 'start': Program.currentPhase === Phases.Setup
                ? Program.startTrain() : console.error('ERROR Already started!'); break;
            case 'goto': Program.currentPhase === Phases.Setup
                ? console.error('ERROR I cannot move. You need start the train')
                : Program.train.go(parseInt(cmd[1])); break;
            default: console.error('ERROR I do not recognize that command. Are you sure you have read the README?');
        }
    }

    /**
     * Start the train simulator.
     */
    private static startTrain(): void {
        Program.config = new SimulatorConfig(Program.stationCount, Program.startLocation, Program.speed);
        Program.train = new SimulatorTrain(Program.config, Program.rate);
        Program.currentPhase = Phases.Running;
    }

    /**
     * Set value from the given SET command
     * 
     * @param setType This corresponds the first argument to the SET command.
     * @param val The value provided to be set.
     */
    private static setValue(setType: SetType, val: number): void {
        if (!Program.validateSet(setType, val)) {
            console.error('ERROR I am not sure about that value. Can you review it?');
        }

        switch (setType) {
            case SetType.Rate: Program.currentPhase === Phases.Setup
                ? Program.rate = val : Program.train.updateRate(val); break;
            case SetType.Speed: Program.currentPhase === Phases.Setup
                ? Program.speed = val
                : console.error('ERROR Train already started');
                break;
            case SetType.StartStation: Program.currentPhase === Phases.Setup
                && val > 0 && val < Program.stationCount
                ? Program.startLocation = Math.floor(val): console.error('ERROR I do not recognize that station. Is it within premises?');
                break;
            case SetType.Stations:
                if (Program.currentPhase === Phases.Setup) {
                    Program.stationCount = Math.floor(val); console.log('STATION ' + val);
                } else {
                    console.error('ERROR Train has already left the yard');
                }
                break;
            default: console.error('ERROR I did not understand that. Cho! Cho!');
        }
    }

    /**
     * Validates the value to be set.
     *
     * @param setType The setType of the set operation.
     * @param val Value to which the set operation is to be done.
     * @returns True if valid.
     */
    private static validateSet(setType: SetType, val: number): boolean {
        switch (setType) {
            case SetType.Speed: return val >= 0;
            case SetType.StartStation:
            case SetType.Stations:
                return val > 0;
            case SetType.Rate:
                console.log(val);
                return Object.values(Rate).includes(val);
        }
    }
}
