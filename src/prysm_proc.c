#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>
#include <signal.h>
#include <syslog.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/ioctl.h>

void output_write(char *buf, int n);

// Run exec_name with args while sending output to output_write
// Example: run_exec("ls", new char[] {"ls", "-l", NULL}, output_write);
int start_proc(char *exec_name, char **args, int argCount) {
    int pipefd[2];
    int pid;
    int status;
    int n;
    char buf[1024];

    args[argCount] = NULL;

    if (pipe(pipefd) < 0) {
        perror("pipe");
        return -1;
    }

    if ((pid = fork()) < 0) {
        perror("fork");
        return -1;
    }

    if (pid == 0) {
        // Child
        close(pipefd[0]);
        dup2(pipefd[1], 1);
        dup2(pipefd[1], 2);
        close(pipefd[1]);
        execvp(exec_name, args);
        
        output_write("", 0);
        output_write(NULL, 0);
        return -1;
    }

    // Parent
    close(pipefd[1]);
    while ((n = read(pipefd[0], buf, sizeof(buf))) > 0) {
        output_write(buf, n);
    }

    close(pipefd[0]);
    waitpid(pid, &status, 0);

    // Fix the glitch where lines would be printed twice
    output_write("", 0);
    output_write(NULL, 0);
    return status;
}

void output_write(char *buf, int n) {
    // print to stdout
    write(1, buf, n);
    fflush(stdout);
}

/*
As vim exclaims when we run it, "Vim: Warning: Output is not to a terminal".
This is because this is a child process, not a terminal.

*/