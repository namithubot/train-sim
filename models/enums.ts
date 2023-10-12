/**
 * The rate at which the time moves in our "train universe".
 */
enum Rate {
    normal = 1.0,
    slow = 0.5,
    fast = 2.0
}

/**
 * The phase at which the current program is.
 */
enum Phases {
    Setup,
    Running
}

/**
 * These are the possible subcommands you can use with SET command.
 */
enum SetType {
    Rate = 'rate',
    Stations = 'stations',
    StartStation = 'start_station',
    Speed = 'subway_speed',
}