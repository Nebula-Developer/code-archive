.PHONY: run

# Get all c++ files in src/ and put them in a variable
CPP_FILES := $(wildcard src/*.cpp)

run:
	echo $(CPP_FILES)
	g++ -std=c++11 -o main $(CPP_FILES)
	./main
