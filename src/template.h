/*
template.h - Main template class for construction
*/

#ifndef GLOBE_TEMPLATE_H
#define GLOBE_TEMPLATE_H

#include <stdio.h>
#include <iostream>
#include <filesystem>
#include "defs.h"
namespace fs = std::__fs::filesystem;

class Template {
public:
    std::string name;
    bool exists() {
        // Check if directory exist
        fs::path dir(makePath(GLOBE_PATH));
        dir /= name;
        return fs::exists(dir) && fs::is_directory(dir);
    }
};

#endif
