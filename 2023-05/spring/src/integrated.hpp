#ifndef INTEGRATED_HPP
#define INTEGRATED_HPP

#include <iostream>
#include <vector>

void exit_command() {
    std::cout << "Exiting..." << std::endl;
    exit(0);
}

void help_command() {
    std::vector<std::string> commands = {
        "exit - exit the shell",
        "help - display this help message"
    };

    std::cout << "spring integrated commands:" << std::endl;

    for (auto& command : commands) {
        std::cout << "\t" << command << std::endl;
    }
}

#endif
