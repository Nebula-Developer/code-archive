/*
manage.cpp - Handle templates (add/remove)
NebulaDev 2023
*/

#include "manage.h"
#include "template.h"
#include "defs.h"
#include "returns.h"
#include <stdio.h>
#include <boost/filesystem.hpp>
#include <filesystem>

std::string joinPaths(std::string path, ...) {
    va_list args;
    va_start(args, path);
    // Use boost::filesystem::path instead
    boost::filesystem::path p = path;
    while (true) {
        char *arg = va_arg(args, char*);
        if (arg == NULL) {
            break;
        }
        p /= arg;
    }
    va_end(args);
    return p.string();
}

Return addTemplate(Template t) {
    if (t.exists()) {
        return Return(false, "Template already exists in " + std::string(makePath(GLOBE_PATH)));
    }

    // Create directory
    std::string rootPath = joinPaths(makePath(GLOBE_PATH), "templates", t.name.c_str(), NULL);
    boost::filesystem::create_directories(rootPath);

    for (const auto &entry : boost::filesystem::directory_iterator(".")) {
        std::string path = entry.path().string();
        std::string newPath = joinPaths(rootPath, path.c_str(), NULL);
        if (boost::filesystem::exists(newPath)) continue;

        if (boost::filesystem::is_directory(path))
            // Use standard for recursive copy
            std::__fs::filesystem::copy(path, newPath, std::__fs::filesystem::copy_options::recursive);
        else boost::filesystem::copy_file(path, newPath);
    }

    return Return(true, "Template added successfully");
}

Return removeTemplate(std::string name) {
    std::string p = joinPaths(makePath(GLOBE_PATH), "templates", name.c_str(), NULL);
    if (!fs::exists(p)) {
        return Return(false, "Template does not exist in " + std::string(makePath(GLOBE_PATH)));
    }
    else {
        fs::remove_all(p);
        return Return(true, "Template removed successfully");
    }
}
