#include <stdio.h>
#include <stdarg.h>

void move(int x, int y) {
    printf("\033[%d;%dH", y, x);
}

void printfxy(int x, int y, char *str) {
    move(x, y);
    printf("%s", str);
}

void print(char *str) {
    printf("%s", str);
}

void flush() {
    fflush(stdout);
}