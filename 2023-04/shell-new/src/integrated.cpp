#include <iostream>
#include <vector>

#include "integrated.hpp"

bool handle_integrated_check(std::vector<std::string> args) {
    std::vector<std::tuple<std::string, void(*)()>> commands = integrated_commands();
    for (int i = 0; i < commands.size(); i++) {
        std::tuple<std::string, void(*)()> command = commands[i];
        if (args[0] == std::get<0>(command)) {
            std::get<1>(command)();
            return true;
        }
    }
    return false;
}

void help_func() {
    std::cout << "Integrated commands:\n";
    std::cout << "help - Display this message\n";
    std::cout << "exit - Exit the shell\n";
}

void exit_func() {
    exit(0);
}

std::vector<std::tuple<std::string, void(*)()>> integrated_commands() {
    std::vector<std::tuple<std::string, void(*)()>> commands;
    commands.push_back(std::make_tuple("help", help_func));
    commands.push_back(std::make_tuple("exit", exit_func));
    return commands;
}
