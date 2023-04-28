#ifdef _WIN32
#error "Windows is not natively supported by this shell. If you would like to use this shell on Windows, please use the Windows Subsystem for Linux (WSL)."
#endif

#include <stdio.h>

#include "input.hpp"
#include "exec.hpp"
#include "term.hpp"

int main(int argc, char **argv) {
    no_flush_term();
    set_output_mode();

    while (true) {
        std::string input = read_input();
        int status = execute_primary(input);
    }
}