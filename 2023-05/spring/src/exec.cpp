#include <vector>
#include <iostream>
#include <unistd.h>

#include "exec.hpp"
#include "integrated_command.hpp"
#include "integrated.hpp"

char **split_str(const std::string& str, const std::string& delim) {
    std::vector<std::string> tokens;
    size_t start = 0, end = 0;
    bool in_quotes = false;
    while ((end = str.find(delim, start)) != std::string::npos) {
        std::string token = str.substr(start, end - start);
        if (token.front() == '"' && token.back() != '"') {
            in_quotes = true;
            token.erase(0, 1);
        } else if (token.back() == '"' && token.front() != '"') {
            in_quotes = false;
            token.erase(token.length() - 1, 1);
        } else if (in_quotes) {
            token = tokens.back() + delim + token;
            tokens.pop_back();
        }
        if (!in_quotes) {
            tokens.push_back(token);
            start = end + delim.length();
        } else {
            start = end + 1;
        }
    }
    tokens.push_back(str.substr(start));

    char **args = new char*[tokens.size() + 1];
    for (int i = 0; i < tokens.size(); i++) {
        args[i] = new char[tokens[i].length() + 1];
        strcpy(args[i], tokens[i].c_str());
    }
    args[tokens.size()] = NULL;

    return args;
}

void process_output(std::string output) {
    std::cout << output << std::endl;
}

IntegratedCommand exit_integrated("exit", exit_command);

std::vector<IntegratedCommand> integrated_commands = {
    exit_integrated
};

void exec_command(std::string command) {
    char **args = split_str(command, " ");

    for (auto& integrated_command : integrated_commands) {
        if (std::string(args[0]) == integrated_command.name()) {
            integrated_command();
            break;
        }
    }

    pid_t pid = fork();

    if (pid == 0) {
        int status = execvp(args[0], args);
        if (status == -1) std::cout << "spring: command not found: " << args[0] << std::endl;
        // kill child process
        exit(0);
    } else {
        wait(NULL);
    }
}
