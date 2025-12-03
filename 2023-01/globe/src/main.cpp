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

    std::vector<std::string> choices = {"Choice 1 Over Twenty characters Testing Test", "Choice 2", "Choice 3", "Choice 4", "Choice 5", "Choice 6", "Choice 7", "Choice 8", "Choice 9", "Choice 10", "Choice 11", "Choice 12", "Choice 13", "Choice 14", "Choice 15", "Choice 16", "Choice 17", "Choice 18", "Choice 19", "Choice 20", "Choice 21", "Choice 22", "Choice 23", "Choice 24", "Choice 25", "Choice 26", "Choice 27", "Choice 28", "Choice 29", "Choice 30", "Choice 31", "Choice 32", "Choice 33", "Choice 34", "Choice 35", "Choice 36", "Choice 37", "Choice 38", "Choice 39", "Choice 40", "Choice 41", "Choice 42", "Choice 43", "Choice 44", "Choice 45", "Choice 46", "Choice 47", "Choice 48", "Choice 49", "Choice 50", "Choice 51", "Choice 52", "Choice 53", "Choice 54", "Choice 55", "Choice 56", "Choice 57", "Choice 58", "Choice 59", "Choice 60", "Choice 61", "Choice 62", "Choice 63", "Choice 64", "Choice 65", "Choice 66", "Choice 67", "Choice 68", "Choice 69", "Choice 70", "Choice 71", "Choice 72", "Choice 73", "Choice 74", "Choice 75", "Choice 76", "Choice 77", "Choice 78", "Choice 79", "Choice 80", "Choice 81", "Choice 82", "Choice 83", "Choice 84", "Choice 85", "Choice 86", "Choice 87", "Choice 88", "Choice 89", "Choice 90", "Choice 91", "Choice 92", "Choice 93", "Choice 94", "Choice 95", "Choice 96", "Choice 97", "Choice 98", "Choice 99", "Choice 100", "Choice 101", "Choice 102", "Choice 103", "Choice 104", "Choice 105" };
    hideCursor();
    std::string choice = choiceList("Which template?", choices, 0, 1);
    showCursor();
    normalMode();
    ttyNormal();
    std::cout << "You chose: " << choice << std::endl;
    return 0;
}