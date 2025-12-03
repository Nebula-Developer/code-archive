#ifndef INPUT_HPP
#define INPUT_HPP

#include <iostream>

std::string bg_esc(int r, int g, int b);
std::string fg_esc(int r, int g, int b);
std::string prefix();
void get_input(std::string &command);

#endif
