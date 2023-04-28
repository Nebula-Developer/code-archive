.PHONY: run build

NAME = shell

run:
	@make build -j4
	@./bin/$(NAME)

build:
	@mkdir -p bin
	@g++ -flto -pipe -o bin/$(NAME) src/main.cpp src/input.cpp src/exec.cpp src/term.cpp src/util.cpp src/integrated.cpp --std=c++11 -lreadline
