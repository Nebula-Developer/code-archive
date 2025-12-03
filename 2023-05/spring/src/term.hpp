#ifndef TERM_HPP
#define TERM_HPP

#include <iostream>

std::string set_term_pos(int x, int y);
void get_term_pos(int &x, int &y);
void get_term_size(int &width, int &height);
std::string remove_escape_sequences(const std::string& str);
int length_without_escape_sequences(const std::string& str);

#endif
