.PHONY: run build

run:
	@make build
	@./bin/spring

build:
	@mkdir -p bin
	@g++ -o bin/spring src/main.cpp src/term.cpp src/input.cpp src/exec.cpp -ltermcap --std=c++11
