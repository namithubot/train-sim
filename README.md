# Train Simulator

Welcome to this project. This project is to simulate subway with certain stations.

## Requirements

This project is written in Typescript with the node implementation of typescript.
Recommended to be used with `node v14 or later`
Make sure that you have that installed.

## Install dependencies (Required for the first time)

To install
Use makefile: `make install`
Use npm: `npm install`


```
cd existing_repo
git remote add origin https://gitlab.scss.tcd.ie/vartgallery/trainsimulator.git
git branch -M main
git push -uf origin main
```

## Launch the simulator

Make: `make start`
npm: `npm run start`


To clean run `make clean_start`

## Configuring the environment

Supported set commands to configure the environment
To set number of stations
`> set stations {{POSITIVE_INTEGER}}`
To set the first station
`> set start_station {{POSITIVE_INTEGER}}`
To set subway speed
`> set subway_speed {{NON_NEGATIVE_INTEGER}}`
To set rate
`> set rate {{0.5, 1.0, 2.0}}`
Where: 0.5 means slow, 1.0 means normal, 2.0 mean fast. This rate is the rate by which the time moves in the simulator.

Note: These commands are supported at configuration


## Configuring the environment

Supported set commands to configure the environment
To go to a particular station
`> goto {{POSITIVE_INTEGER}}`
To set rate
`> set rate {{0.5, 1.0, 2.0}}`
Where: 0.5 means slow, 1.0 means normal, 2.0 mean fast. This rate is the rate by which the time moves in the simulator.

Note: These commands are supported at runtime

## Start and Stop
To start the simulator
`> start`

To stop the program
`> stop`

***

Note: All the commands are case insensitive.
