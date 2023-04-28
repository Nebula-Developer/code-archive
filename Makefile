.PHONY: run build

NAME = shell

run:
	@make build -j4
	@./bin/$(NAME)

build:
	@mkdir -p bin
	@g++ -flto -pipe -o bin/$(NAME) src/main.cpp src/input.cpp src/exec.cpp
