/*
defs.h - Global definitions
*/

#ifndef GLOBE_DEFS_H
#define GLOBE_DEFS_H

#include <filesystem>
#include <regex>
#include <stdlib.h>
#include <stdio.h>

// Can be overridden by env:
#ifndef GLOBE_PATH
    #ifdef _WIN32
        #define GLOBE_PATH "%APPDATA%/.globe/"
    #else
        #define GLOBE_PATH "~/.globe/"
    #endif
#endif

static std::string makePathString(std::string path) {
    char *home = getenv("HOME");
    char *appdata = getenv("APPDATA");
    path = std::regex_replace(path, std::regex("~"), home);
    path = std::regex_replace(path, std::regex("%APPDATA%"), appdata);
    return path;
}

static std::__fs::filesystem::path makePath(std::string path) {
    return std::__fs::filesystem::path(makePathString(path));
}

#endif
