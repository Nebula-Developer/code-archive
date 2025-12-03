#include <sys/ioctl.h>
#include <termios.h>
#include <unistd.h>
#include <iostream>
#include <regex>

#include "term.hpp"

void get_term_size(int &width, int &height) {
    struct winsize w;
    ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
    width = w.ws_col;
    height = w.ws_row;
}

void get_term_pos(int &x, int &y) {
    // save current terminal settings
    struct termios old_tio, new_tio;
    tcgetattr(STDIN_FILENO, &old_tio);
    new_tio = old_tio;

    // disable canonical mode and echo
    new_tio.c_lflag &= ~(ICANON | ECHO);
    tcsetattr(STDIN_FILENO, TCSANOW, &new_tio);

    // send query to get cursor position
    std::cout << "\033[6n";
    std::cout.flush();

    // read response from terminal
    char buf[32];
    int i = 0;
    char c;
    while (read(STDIN_FILENO, &c, 1) > 0) {
        if (c == 'R') break;
        buf[i++] = c;
    }
    buf[i] = '\0';

    // parse response to get cursor position
    sscanf(buf, "\033[%d;%dR", &y, &x);

    // restore original terminal settings
    tcsetattr(STDIN_FILENO, TCSANOW, &old_tio);
}

std::string set_term_pos(int x, int y) {
    return "\033[" + std::to_string(y) + ";" + std::to_string(x) + "H";
}

std::string remove_escape_sequences(const std::string& str) {
    std::regex re("\033\\[[0-9;]*m");
    return std::regex_replace(str, re, "");
}

int length_without_escape_sequences(const std::string& str) {
    return remove_escape_sequences(str).length();
}

