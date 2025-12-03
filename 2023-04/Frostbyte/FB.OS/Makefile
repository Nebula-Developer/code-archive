.PHONY: build
MAKEFLAGS += --silent

ifeq ($(OS),Windows_NT)
	MKDIR = if not exist ..\build mkdir ..\build
else
	MKDIR = mkdir -p ../build
endif

build:
	$(MKDIR)
	@dotnet build -c Release -o ../build -nologo -clp:NoSummary -v:q
