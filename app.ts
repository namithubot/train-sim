import * as readLine from 'node:readline';
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
        public rate: Rate = Rate.normal;
    ) { }

    public updateRate(newRate: Rate): void {
        this.rate = newRate;
    }
}

class SimulatorTrain {
    private currentStation: number;
    private speed: number;
    private intervalId: number = -1;
    private destination: number;

    constructor(private config: SimulatorConfig) {
        this.currentStation = config.startLocation;
    }

    public updateSpeed(newSpeed: number) {
        this.speed = newSpeed;
    }

    public go(location: number) {
        if (this.intervalId != -1) {
            clearTimeout(this.intervalId);
            this.intervalId = -1;
        }

        if (this.currentStation === location) {
            console.log('Already at ' + location);
        }
        this.destination = location;

        setInterval(() => {
            if (this.currentStation !== this.destination) {
                this.currentStation = this.destination > this.currentStation
                    ? Math.min(this.currentStation + this.speed, this.config.stationCount, this.destination)
                    : Math.max(this.currentStation - this.speed, 1, this.destination);
            }

            if (this.currentStation === this.destination) {
                console.log('AT ' + this.destination);
                clearInterval(this.intervalId);
            }
        }, 1/this.config.rate * 1000)
    }
}

class Program {
    private config: SimulatorConfig;
    private train: SimulatorTrain;
    private stationCount: number = 4;
    private startLocation: number = 1;
    private rate: Rate = Rate.normal;
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
                : this.train.go(parseInt(cmd[2])); break;
            default: console.error('ERROR I do not recognize that command. Are you sure you have read the README?');
        }
    }

    private startTrain(): void {
        this.config = new SimulatorConfig(this.stationCount, this.startLocation, this.rate);
        this.train = new SimulatorTrain(this.config);
    }

    private setValue(setType: SetType, val: number): void {
        switch (setType) {
            case SetType.Rate: this.phase === Phases.Setup
                ? this.rate = val : this.config.updateRate(val); break;
            case SetType.Speed: this.phase === Phases.Setup
                ? console.error('ERROR Too early? Start the train')
                : this.train.updateSpeed(val);
            case SetType.StartStation: this.phase === Phases.Setup
                && val > 0 && val < this.stationCount
                ? this.startLocation = val : console.error('ERROR I do not recognize that station. Is it within premises?');
            case SetType.Stations:
                if (this.phase === Phases.Setup) {
                    this.stationCount = val; console.log('STATION ' + val);
                } else {
                    console.error('ERROR Train has already left the yard');
                }
            default: console.error('ERROR I did not understand that. Cho! Cho!');
        }
    }
}

(function main() {
    let program = new Program();
    const line = readLine.createInterface(stdin, stdout);
    console.info('Hello there!\nWelcome to the subway simulator\n');
    while (true) {
        line.question('Enter You Commnad Here > ', program.processCommand);
    }
}) ();