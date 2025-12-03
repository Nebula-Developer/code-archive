@echo off
echo Installing FAN onto your PATH... (Backup saved, incase something goes wrong...)
echo Please run this program as administrator.
echo It is reccomended running FAN inside of a Linux / macOS machine.

echo %TIME%:%PATH%>>win-path-backup.txt
setx /M PATH "%PATH%;%CD%\alias"

echo Done.