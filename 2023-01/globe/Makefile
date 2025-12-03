.PHONY: run build
CPP_FILES := $(wildcard src/*.cpp)

run:
	@make build
	@./main

build:
	@echo Compiling: $(CPP_FILES)
	@g++ -std=c++11 -o main $(CPP_FILES) -lboost_system -lboost_filesystem
	@echo Compilation complete