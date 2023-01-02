/*
Globe CLI handler
NebulaDev 2023
*/

#include <iostream>
#include <filesystem>
#include <vector>
#include "defs.h"
#include "template.h"
#include "manage.h"
#include "returns.h"
#include "ui.h"

static const char* subdirs[] = {
    "templates"
};

int main(int argc, char *argv[]) {
    std::cout << "Globe CLI handler (temporary)" << std::endl;
    std::string GLOBE_MADE_PATH = makePathString(GLOBE_PATH);

    // Main creation check
    if (!fs::exists(GLOBE_MADE_PATH)) {
        fs::create_directory(GLOBE_MADE_PATH);
        for (int i = 0; i < sizeof(subdirs) / sizeof(subdirs[0]); i++) {
            fs::path p (GLOBE_MADE_PATH);
            p /= subdirs[i];
            fs::create_directory(p);
        }
    }

    Template t;
    t.name = "test";

    scrollbackMode();
    ttyRaw();

    std::vector<std::string> choices = {"Choice 1 Over Twenty characters Testing Test", "Choice 2", "Choice 3", "Choice 4", "Choice 5"};
    hideCursor();
    std::string choice = choiceList("Which template?", choices, 0, 1);
    showCursor();
    normalMode();
    ttyNormal();
    std::cout << "You chose: " << choice << std::endl;
    return 0;
}