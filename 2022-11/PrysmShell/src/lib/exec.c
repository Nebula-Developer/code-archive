#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#define __null 0

int exec(char *cmd, char *args[], int argc) {
    args[argc] = NULL;

    int pid = fork();
    int status;

    if (pid == 0) {
        execvp(cmd, args);
    } else {
        waitpid(pid, &status, 0);
    }

    return status;
}