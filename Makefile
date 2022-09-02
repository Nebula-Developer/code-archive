.PHONY: run build quick-build clean cp

run:
	@echo "Caution - SIGSTP and SIGQUIT will not be handled while running from makefile."
	@echo "For proper functionality, run the program directly."
	@echo ""
	@dotnet run

build:
	@dotnet publish -c Release -o Build -p:PublishReadyToRun=true -p:PublishSingleFile=true -p:PublishTrimmed=true --self-contained true -p:IncludeNativeLibrariesForSelfExtract=true -r osx-x64

quick-build:
	make clean
	@dotnet publish -o Build

clean:
	@rm -rf Build
	@rm -rf bin
	@rm -rf obj
	mkdir Build

cp:
	@sudo cp Build/nsh /usr/local/bin/nsh