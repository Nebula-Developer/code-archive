#ifndef INTEGRATED_HPP
#define INTEGRATED_HPP

#include <iostream>
#include <tuple>
#include <vector>

void help_func();
void exit_func();

std::vector<std::tuple<std::string, void(*)()>> integrated_commands();

bool handle_integrated_check(std::vector<std::string> args);

#endif
