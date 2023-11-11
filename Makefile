.PHONY: run build

run:
	@dotnet run --project VN.Test

build:
	@mkdir -p bin
	@dotnet build -c Release -o bin VN
