#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

int main(int argc, char **argv) {

    int LSIZ = 1000;
    int RSIZ = 1000;

    char *filename;
    char *compilerCommand;

    if (argc > 2) {
        filename = argv[1];

        char temp[1000];

        for (int i = 2; i < argc; i++) {
            strcat(temp, argv[i]);
            strcat(temp, " ");
        }

        compilerCommand = temp;

        
        printf("Running ConstServ off of arguments..\n");

        FILE *fileChecker = fopen(filename, "r");

        if (fileChecker == NULL) {
            printf("ERROR - File '%s' could not exist, or cannot be opened.\n", filename);
            return -1;
        }

    } else {
        printf("Please supply a file, and the compiler arguments. (Example Below.)\n");
        printf("constserv ./myProgram.c gcc -o ./myProgramOut ./myProgram.c");
        printf("constserv <File to compile> <Arguments to compile> (gcc, gnu, etc.. what ever compiler, whatever language.)");
        printf("The compiler is done by running the arguments following the file name as a system command, so it runs in: \nTerminal (Linux/MacOS) \nor CMD/Powershell (Windows)");
    };

    char oldLine[RSIZ][LSIZ];

    while (true) {
        FILE *fi = fopen(filename, "r");

        if (fi == NULL) {
            printf("ERROR - File '%s' could not exist, or cannot be opened.\n", filename);
        }



        int b = 0;
        char line[RSIZ][LSIZ];

        while(fgets(line[b], LSIZ, fi)) 
        {
            line[b][strlen(line[b]) - 1] = '\0';
            b++;
        } 

        int didChange = 0;

        for(int i = 0; i < b; ++i)
        {
            if(strcmp(line[i], oldLine[i]) != 0) {
                for (int b = 0; b < strlen(oldLine[i]); b++) {
                    oldLine[i][b] = line[i][b]; 
                }

                for (int b = 0; b < strlen(line[i]); b++) {
                    oldLine[i][b] = line[i][b]; 
                }
 
                didChange = 1;
            }  
        }

        if (didChange == 1) {
            printf("\e[1;1H\e[2J");
            printf("Compiling..\n");
            system(compilerCommand);
            printf("Done.\n");
        }
        
        fclose(fi); 
        sleep(1);
    }
} 