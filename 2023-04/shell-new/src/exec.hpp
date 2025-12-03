#ifndef EXEC_HPP
#define EXEC_HPP

#include <iostream>
#include <tuple>

/// Primary execution method for invoking commands relati
int execute_primary(std::string input);

/// Execution method for retrieving output upon command invocation
std::tuple<int, std::string> execute_foutput(std::string input);

#endif
