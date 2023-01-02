/*
manage.cpp - Handle templates (add/remove)
NebulaDev 2023
*/

#include "manage.h"
#include "template.h"
#include "defs.h"
#include "returns.h"
#include <stdio.h>

Return addTemplate(Template t) {
    if (t.exists()) {
        return new Return(false, "Template already exists in ", GLOBE_PATH);
    }

    // Create directory
    fs::path dir(GLOBE_PATH);
    dir /= t.name;
    fs::create_directory(dir);

    // Copy all files in current directory to new directory
    fs::path currentDir = fs::current_path();
    for (const auto &entry : fs::directory_iterator(currentDir)) {
        fs::copy(entry.path(), dir);
    }

    return new Return(true, "Template added successfully");
}