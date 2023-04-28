#include <iostream>
#include <unistd.h>
#include <sys/wait.h>
#include <vector>
#include <readline/readline.h>

#include "exec.hpp"

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

int execute_primary(std::string input) {
    std::vector<std::string> args = split(input, " ");
    char **argv = new char*[args.size() + 1];
    for (int i = 0; i < args.size(); i++) {
        argv[i] = new char[args[i].length() + 1];
        strcpy(argv[i], args[i].c_str());
    }
    argv[args.size()] = NULL;

    if (args.size() == 1 && args[0] == "") return 0;

    pid_t pid = fork();
    if (pid == 0) {
        // Fix readline
        rl_bind_key('\t', rl_insert);
        rl_initialize();
        
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
