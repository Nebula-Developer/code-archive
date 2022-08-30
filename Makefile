.PHONY: build

build:
	dotnet publish -c Release -o Build -p:PublishReadyToRun=true -p:PublishSingleFile=true -p:PublishTrimmed=true --self-contained true -p:IncludeNativeLibrariesForSelfExtract=true -r osx-x64