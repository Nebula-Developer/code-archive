.PHONY: build

build:
	@echo "Building..."
	gcc -o prysm_proc.dylib -shared -fPIC -I/usr/local/include -L/usr/local/lib src/prysm_proc.c