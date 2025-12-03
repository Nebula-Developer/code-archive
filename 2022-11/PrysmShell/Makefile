.PHONY: all run

all: ./printing.lib ./exec.lib run

./printing.lib: ./src/lib/printing.c
	gcc -o ./printing.lib ./src/lib/printing.c -shared -fPIC

./exec.lib: ./src/lib/exec.c
	gcc -o ./exec.lib ./src/lib/exec.c -shared -fPIC

run:
	dotnet run --project src