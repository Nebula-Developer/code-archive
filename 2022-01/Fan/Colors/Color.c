#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void red () {
  printf("\033[1;31m");
}

void yellow () {
  printf("\033[1;33m");
}

void black () {
  printf("\033[0;30m");
}

void cyan () {
  printf("\033[0;32m");
}

void blue () {
  printf("\033[0;34m");
}

void green () {
  printf("\033[0;36m");
}

void white () {
  printf("\033[0;37m");
}

void purple () {
  printf("\033[0;35m");
}

void bwhite () {
  
}