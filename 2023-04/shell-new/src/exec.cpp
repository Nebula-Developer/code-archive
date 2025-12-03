#include <iostream>
#include <unistd.h>
#include <sys/wait.h>
#include <vector>
#include <tuple>
#include <readline/readline.h>
#include <regex>

#include "exec.hpp"
#include "term.hpp"
#include "integrated.hpp"
#include "util.hpp"

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

const char *quote_placeholder_prefix = "___SH_INTERNAL_QUOTE-";
std::vector<std::string> handle_input(std::string input) {
    std::string quote_regex = "\"[^\"]*\"";
    std::string quote_placeholder_regex = std::string(quote_placeholder_prefix) + "[0-9]+";

    std::string command_substitution_regex = "\\$\\(.*\\)";

    // Handle command substitution
    std::regex command_substitution_regex_obj(command_substitution_regex);
    std::smatch command_substitution_match;

    while (std::regex_search(input, command_substitution_match, command_substitution_regex_obj)) {
        std::string command_substitution = command_substitution_match.str(0);
        std::string command = command_substitution.substr(2, command_substitution.length() - 3);

        std::tuple<int, std::string> command_res = execute_foutput(command);
        std::string command_output = std::get<1>(command_res);

        input.replace(command_substitution_match.position(0), command_substitution.length(), command_output);

        // Trim
        input = input.substr(0, input.find_last_not_of(" \n\r\t") + 1);
    }

    // Replace quotes with placeholders
    std::vector<std::tuple<std::string, std::string>> quotes;
    std::regex quote_regex_obj(quote_regex);
    std::smatch quote_match;

    while (std::regex_search(input, quote_match, quote_regex_obj)) {
        std::string quote = quote_match.str(0);
        std::string placeholder = std::string(quote_placeholder_prefix) + std::to_string(quotes.size());
        quotes.push_back(std::make_tuple(quote, placeholder));
        input.replace(quote_match.position(0), quote.length(), placeholder);
        printf("Replaced %s with %s\n", quote.c_str(), placeholder.c_str());
    }

    // Split input into tokens
    std::vector<std::string> tokens = split(input, " ");

    // Replace placeholders with quotes
    std::regex quote_placeholder_regex_obj(quote_placeholder_regex);
    std::smatch quote_placeholder_match;

    for (int i = 0; i < tokens.size(); i++) {
        std::string token = tokens[i];
        
        // Get all matches
        std::vector<std::string> matches;
        while (std::regex_search(token, quote_placeholder_match, quote_placeholder_regex_obj)) {
            std::string match = quote_placeholder_match.str(0);
            matches.push_back(match);
            token.replace(quote_placeholder_match.position(0), match.length(), "");
        }

        // Replace matches with quotes
        for (int j = 0; j < matches.size(); j++) {
            std::string match = matches[j];
            int index = std::stoi(match.substr(strlen(quote_placeholder_prefix)));
            std::string quote = std::get<0>(quotes[index]);
            tokens[i].replace(tokens[i].find(match), match.length(), quote);
            // Replace quotes with nothing
            for (int k = 0; k < 2; k++)
                tokens[i].replace(tokens[i].find("\""), 1, "");
        }
    }

    return tokens;
}

int execute_primary(std::string input) {
    std::vector<std::string> args = handle_input(input);

    if (handle_integrated_check(args) == true) {
        return 0;
    }

    char** argv = stringv_to_charv(args);

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
    } else if (pid == -1) {
        std::cout << "shell: fork: error" << std::endl;
        return 1;
    } else {
        int status;
        waitpid(pid, &status, 0);
        return status;
    }
}

std::tuple<int, std::string> execute_foutput(std::string input) {
    std::vector<std::string> args = handle_input(input);

    if (handle_integrated_check(args) == true) {
        return std::make_tuple(0, "");
    }

    char** argv = stringv_to_charv(args);

    int pipefd[2];
    if (pipe(pipefd) == -1) {
        std::cout << "shell: pipe: error" << std::endl;
        return std::make_tuple(1, "");
    }

    pid_t pid = fork();
    if (pid == 0) {
        rl_bind_key('\t', rl_insert);
        rl_initialize();

        setenv("GIT_TERMINAL_PROMPT", "0", 1);

        close(pipefd[0]);
        dup2(pipefd[1], STDOUT_FILENO);

        int execres = execvp(argv[0], argv);
        if (execres == -1) {
            std::cout << "shell: " << argv[0] << ": command not found" << std::endl;
            exit(1);
        }

        exit(0);
    }
    else if (pid == -1) {
        std::cout << "shell: fork: error" << std::endl;
        return std::make_tuple(1, "");
    }
    else {
        close(pipefd[1]);
        std::string output;
        char buf[1024];
        ssize_t nread;
        while ((nread = read(pipefd[0], buf, sizeof(buf))) > 0) {
            output.append(buf, nread);
        }

        int status;
        waitpid(pid, &status, 0);

        return std::make_tuple(status, output);
    }
}
