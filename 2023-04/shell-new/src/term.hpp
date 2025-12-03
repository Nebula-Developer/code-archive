#ifndef TERM_H
#define TERM_H

#include <iostream>

/// Get the terminal's current y position
int get_term_y();
/// Get the terminal's current x position
int get_term_x();
/// Get the terminal's current y and x position
void get_term_pos(int *y, int *x);

/// Set the terminal's x and y position
void set_term_pos(int y, int x);
/// Set the terminal's y position
void set_term_pos_y(int y);
/// Set the terminal's x position
void set_term_pos_x(int x);

/// Clear the terminal
void term_clear();
/// Clear the current line
void term_clear_line();
/// Clear the current line from the cursor to the right
void term_clear_line_right();
/// Clear the current line from the cursor to the left
void term_clear_line_left();

/// Write a string to the terminal
void write_term(std::string str);
/// Flush the terminal
void flush_term();
/// Stops the terminal from flushing
void no_flush_term();
/// Resumes the terminal's flushing
void resume_flush_term();

/// Move into a mode designed for input (no echo, no buffering)
void set_input_mode();
/// Move into a mode designed for output (echo, buffering)
void set_output_mode();

/// Create a string from a set of strings
std::string create_string(const char *str, ...);

#endif
