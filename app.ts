import * as readLine from 'node:readline/promises';
import { exit, stdin, stdout } from 'node:process';

enum Rate {
    normal = 1.0,
    slow = 0.5,
    fast = 2.0
}

enum Phases {
    Setup,
    Running
}

enum SetType {
    Rate = 'rate',
    Stations = 'stations',
    StartStation = 'start_station',
    Speed = 'subway_speed',
}

class SimulatorConfig {
    constructor(public readonly stationCount: number = 4,
        public readonly startLocation: number = 1,
        public speed: number = 0.5
    ) { }
}

class SimulatorTrain {
    private currentStation: number;
    private intervalId: NodeJS.Timeout;
    private destination: number;

    constructor(private config: SimulatorConfig,
        public rate: Rate = Rate.normal) {
        this.currentStation = config.startLocation;
        this.destination = this.currentStation;
    }

    public updateRate(newRate: Rate): void {
        this.rate = newRate;
    }

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
        // 0.5, 0.5 = 4, 0.5, 1 = 2, 1, 0.5 = 2, 1/x*1/y
        const timeInterval = Math.floor((1/(this.config.speed * this.rate)) * 1000);
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

class Program {
    private config: SimulatorConfig;
    private train: SimulatorTrain;
    private stationCount: number = 4;
    private startLocation: number = 1;
    private rate: Rate = Rate.normal;
    private speed: number = 0.5;
    private phase: Phases = Phases.Setup;


    public processCommand(command: string): void {
        const cmd = command.toLowerCase().split(' ');
        if (!command[0]
            || (!['stop', 'start'].includes(command[1]) && !command[1])
            || (command[1] === 'set' && !command[2])) {
                console.error('ERROR Missing arguments. Please read README');
                return;
            }
        switch (cmd[0]) {
            case 'stop': exit(0);
            case 'set': this.setValue(cmd[1] as SetType, parseInt(cmd[2])); break;
            case 'start': this.phase === Phases.Setup
                ? this.startTrain() : console.error('ERROR Already started!'); break;
            case 'goto': this.phase === Phases.Setup
                ? console.error('ERROR I cannot move. You need start the train')
                : this.train.go(parseInt(cmd[1])); break;
            default: console.error('ERROR I do not recognize that command. Are you sure you have read the README?');
        }
    }

    private startTrain(): void {
        this.config = new SimulatorConfig(this.stationCount, this.startLocation, this.speed);
        this.train = new SimulatorTrain(this.config, this.rate);
        this.phase = Phases.Running;
    }

    private setValue(setType: SetType, val: number): void {
        switch (setType) {
            case SetType.Rate: this.phase === Phases.Setup
                ? this.rate = val : this.train.updateRate(val); break;
            case SetType.Speed: this.phase === Phases.Setup
                ? this.speed = val
                : console.error('ERROR Train already started');
                break;
            case SetType.StartStation: this.phase === Phases.Setup
                && val > 0 && val < this.stationCount
                ? this.startLocation = val : console.error('ERROR I do not recognize that station. Is it within premises?');
                break;
            case SetType.Stations:
                if (this.phase === Phases.Setup) {
                    this.stationCount = val; console.log('STATION ' + val);
                } else {
                    console.error('ERROR Train has already left the yard');
                }
                break;
            default: console.error('ERROR I did not understand that. Cho! Cho!');
        }
    }
}

(async function main() {
    let program = new Program();
    const line = readLine.createInterface(stdin, stdout);
    console.info('Hello there!\nWelcome to the subway simulator\n');
    while (true) {
        const command = await line.question('Enter You Commnad Here > ');
        program.processCommand(command)
    }
}) ();