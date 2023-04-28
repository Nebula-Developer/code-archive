#include <iostream>
#include <unistd.h>
#include <sys/wait.h>
#include <vector>
#include <tuple>
#include <readline/readline.h>

#include "exec.hpp"
#include "term.hpp"

std::vector<std::string> split(std::string str, std::string delim) {
    std::vector<std::string> result;
    size_t pos = 0;
    std::string token;
    while ((pos = str.find(delim)) != std::string::npos) {
        token = str.substr(0, pos);
        result.push_back(token);
        str.erase(0, pos + delim.length());
    }
    result.push_back(str);
    return result;
}

std::vector<std::string> join(const std::vector<std::string>& strings) {
    std::vector<std::string> result;
    bool in_quotes = false;
    std::string current_string;
    for (const auto& str : strings) {
        if (!in_quotes && (str.front() == '\'' || str.front() == '\"')) {
            // Start of a quoted string
            in_quotes = true;
            current_string = str;
        } else if (in_quotes && str.back() == current_string.front()) {
            // End of a quoted string
            in_quotes = false;
            current_string += " " + str;
            result.push_back(current_string);
        } else if (in_quotes) {
            // Quoted string in the middle
            current_string += " " + str;
        } else {
            // Non-quoted string
            result.push_back(str);
        }
    }
    if (in_quotes) {
        // If there was an unmatched quote, append it as is
        result.push_back(current_string);
    }
    return result;
}

int execute_primary(std::string input) {
    std::vector<std::string> args = split(input, " ");
    args = join(args);

    for (int i = 0; i < args.size(); i++) {
        std::cout << args[i] << std::endl;
    }

    char** argv = new char*[args.size() + 1];
    for (int i = 0; i < args.size(); i++) {
        argv[i] = new char[args[i].length() + 1];
        strcpy(argv[i], args[i].c_str());
    }

    argv[args.size()] = NULL;

    pid_t pid = fork();
    if (pid == 0) {
        // Fix readline
        rl_bind_key('\t', rl_insert);
        rl_initialize();

        // Fix git not recognizing strings
        setenv("GIT_TERMINAL_PROMPT", "0", 1);

        int execres = execvp(argv[0], argv);
        if (execres == -1) {
            std::cout << "shell: " << argv[0] << ": command not found" << std::endl;
            exit(1);
        }

        exit(0);
    }
    else if (pid == -1) {
        std::cout << "Error: fork() failed" << std::endl;
        return 1;
    }
    else {
        int status;
        waitpid(pid, &status, 0);
        return status;
    }
}
