Project = "Train Simulator"

clean_start: clean build run

run : ;npm run start

build: ;npm install

clean : ;
	rm -rf node_modules


.PHONY: clean build run