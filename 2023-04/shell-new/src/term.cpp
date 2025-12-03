#include <iostream>
#include <termios.h>
#include <unistd.h>
#include <sys/ioctl.h>

#include "term.hpp"

void get_term_pos(int *y, int *x) {
    struct winsize w;
    ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
    *y = w.ws_row;
    *x = w.ws_col;
}

int get_term_y() {
    int y, x;
    get_term_pos(&y, &x);
    return y;
}

int get_term_x() {
    int y, x;
    get_term_pos(&y, &x);
    return x;
}

void set_term_pos(int y, int x) {
    std::string str = "\033[" + std::to_string(y) + ";" + std::to_string(x) + "H";
    write_term(str); 
}

void set_term_pos_y(int y) {
    std::string str = "\033[" + std::to_string(y) + "H";
    write_term(str);
}

void set_term_pos_x(int x) {
    std::string str = "\033[" + std::to_string(x) + "G";
    write_term(str);
}

void term_clear() {
    write_term("\033[2J");
}

void term_clear_line() {
    write_term("\033[2K");
}

void term_clear_line_right() {
    write_term("\033[K");
}

void term_clear_line_left() {
    write_term("\033[1K");
}

void write_term(std::string str) {
    char *cstr = new char[str.length() + 1];
    strcpy(cstr, str.c_str());
    int len = strlen(cstr);
    write(STDOUT_FILENO, cstr, len);
    delete[] cstr;
}

void flush_term() {
    std::cout.flush();
}

void no_flush_term() {
    std::ios_base::sync_with_stdio(false);
    std::cout.tie(nullptr);
}

void resume_flush_term() {
    std::ios_base::sync_with_stdio(true);
    std::cout.tie(nullptr);
}

void set_input_mode() {
    struct termios term;
    tcgetattr(STDIN_FILENO, &term);
    term.c_lflag &= ~(ICANON | ECHO);
    tcsetattr(STDIN_FILENO, TCSANOW, &term);
}

void set_output_mode() {
    struct termios term;
    tcgetattr(STDIN_FILENO, &term);
    term.c_lflag |= (ICANON | ECHO);
    tcsetattr(STDIN_FILENO, TCSANOW, &term);
}

std::string create_string(const char *str, ...) {
    std::string result = str;

    va_list args;
    va_start(args, str);

    while (true) {
        const char *arg = va_arg(args, const char *);

        if (arg == NULL) break;
        else result += arg;
    }

    va_end(args);

    return result;
}
