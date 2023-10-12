Project = "Train Simulator"

clean_start: clean install start

start : ;@echo "Starting ${PROJECT}....."; \
	npm run start

install: ;@echo "Installing Dependencies"; \
	npm install

clean : ;
	rm -rf node_modules


.PHONY: clean install start