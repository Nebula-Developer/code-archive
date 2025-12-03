/* 

The actual executable files for FAN are in the alias folder.
This folder gets compiled with GCC, on a Fedora Linux dual boot.
Go wild!

*/

#define _CRT_SECURE_NO_DEPRECATE
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include "Colors/Color.c"
#include <string.h>
#include <time.h>
#include <errno.h>
#include <sys/time.h>

char* ver = "v0.0.8";  


int main(int argc,char* argv[])
{
    int counter;

    if(argc<2) 
    {
        red();
        printf("Please supply an argument. (Type 'fan -h' for more information.)\n"); 
        white();
        return -1;
    }

    if (strcmp(argv[1], "-h") == 0 || strcmp(argv[1], "--help") == 0) {
        cyan();
        printf("All supported arguments as of %s:\n",ver);

        char* helpArray[] = 
        {
            "-h // --help",
            "-r // --refresh",
            "-d // --do",
            "-l // --list"
        };

        char* resultOfCommand[] =
        {
            "brings up this menu",
            "refreshes the current list of commands",
            "run a command with arguments",
            "list all actions in the current version"
        };

        int length = 0;

        int spacing = 40;
        int spacingOut = 0;
        green();
        for (int i = 0; i < sizeof(helpArray)/sizeof(helpArray[0]); i++) {
            length = strlen(helpArray[i]);
            spacingOut = spacing - length;

            printf(helpArray[i]);
            for (int b = 0; b < spacingOut; b++) { printf(" "); }
            yellow();
            printf(resultOfCommand[i]);
            printf("\n");
            green();
        }


        white();
        return 0;
    } else if (strcmp(argv[1], "-d") == 0 || strcmp(argv[1], "--do") == 0) {
        if (argc < 3) {
            red();
            printf("Please supply an action argument. (Do 'fan -l' for a list of all actions.)\n");
            white();
            return -1;
        }

        if (strcmp(argv[2], "graph") == 0) {
            if (argc < 5) {
                red();
                printf("Please supply two integers.\n");
                white();
                return -1;
            }

            int longest = 0;
            int shortest = 0;

            if (strlen(argv[3]) > strlen(argv[4])) {
                longest = strlen(argv[3]);
                shortest = strlen(argv[4]);
            } else {
                longest = strlen(argv[4]);
                shortest = strlen(argv[3]);
            }

            for(int i = 0; i < longest; i++) {
                printf("-");
            }
            printf(">\n");
            for(int i = 0; i < shortest; i++) {
                printf("-");
            }
            int comparison = longest - shortest;
            printf("<%i \n",comparison);
        }

        if (strcmp(argv[2], "opencmd") == 0) {
            green();
            printf("Opening CMD batch layout (Windows Only) on branch: 'NORMAL'..\n");
            yellow();
            printf("Opening batch file..\n");
            cyan();
            printf("Applying short timeout to stop file overlapse..\n");

            usleep(100000);

            yellow();
            FILE *batch;
            batch = fopen("cmd.bat", "w");

            if (batch == NULL) {
                red();
                printf("\nFailed to open cmd.bat.\n");
                white();
                return -1;
            }

            purple();
            printf("Successfully opened cmd.bat.\n");

            yellow();
            printf("Writing data to cmd.bat..\n");

            usleep(200000);



            fprintf(batch, "@echo off\necho OPENCMD: Made with FAN %s.\n\n:open\nset /p input=\"%%CD%%>\"\n%%input%%\ngoto open\n", ver);
            fclose(batch);

            purple();
            printf("Successfully appended text to cmd.bat.\n");

            blue();

            printf("Created batch layout successfully.\n");
            printf("Closing file managers..\n");

            usleep(500000);

            white();
        }

        if (strcmp(argv[2], "make") == 0) {
            if(argc < 4) {
                red();
                printf("Please supply a third argument (FILE_NAME).\n");
                white();
                return -1;
            }

            green();
            printf("Creating file: '%s'...", argv[3]);

            FILE *custom;
            custom = fopen(argv[3], "w");
            fclose(custom);
        }

        if (strcmp(argv[2], "package") == 0) {
            red();
            printf("Please try again later. ");
            purple();
            printf("(Not implemented yet.)\n");
            white();
        }

        if (strcmp(argv[2], "html") == 0) {
            green();
            printf("Creating html template project on branch: 'NORMAL'..\n");
            yellow();
            printf("Opening index file..\n");
            cyan();
            printf("Applying short timeout to stop file overlapse..\n");

            usleep(100000);

            yellow();
            FILE *index;
            index = fopen("index.html", "w");

            if (index == NULL)
            {
                red();
                printf("\nFailed to open index.html.\n");
                white();
                return -1;
            }

            purple();
            printf("Successfully opened index.html.\n");

            yellow();
            printf("Writing data to index.html..\n");

            usleep(200000);


            fprintf(index, "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Template Project</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n    <p>This is a template project made by FAN.</p>\n</body>\n</html>");
            fclose(index);

            purple();
            printf("Successfully appended text to index.html.\n");



            yellow();
            printf("Opening css file..\n");
            cyan();
            printf("Applying short timeout to stop file overlapse..\n");

            usleep(100000);

            yellow();
            FILE *css;
            css = fopen("style.css", "w");

            if (index == NULL)
            {
                red();
                printf("\nFailed to open style.css.\n");
                white();
                return -1;
            }

            purple();
            printf("Successfully opened style.css.\n");



            blue();

            printf("Created template project successfully.\n");
            printf("Closing file managers..\n");

            fclose(css);

            usleep(500000);

            white();
        }
    } else if (strcmp(argv[1], "-l") == 0 || strcmp(argv[1], "--list") == 0) {
        cyan();
        printf("All supported action arguments as of %s:\n",ver);

        char* helpArray[] = 
        {
            "html",
            "opencmd",
            "package"
        };

        char* resultOfCommand[] =
        {
            "creates an html template in the current open directory",
            "creates a batch file with a template CMD command runner",
            "this is not implemented yet. Please wait for it's release on the github page"
        };

        int length = 0;

        int spacing = 40;
        int spacingOut = 0;
        green();
        for (int i = 0; i < sizeof(helpArray)/sizeof(helpArray[0]); i++) {
            length = strlen(helpArray[i]);
            spacingOut = spacing - length;

            printf(helpArray[i]);
            for (int b = 0; b < spacingOut; b++) { printf(" "); }
            yellow();
            printf(resultOfCommand[i]);
            printf("\n");
            green();
        }


        white();
    } else if (strcmp(argv[1], "-r") == 0 || strcmp(argv[1], "--reload") == 0) {
        yellow();
        printf("Reloading all actions...\n");

        usleep(1000000);

        purple();
        printf("Could not connect to server. ");

        red();
        printf("(Not released yet).\n");

        white();
    }

    yellow();
    printf("\nCompleted task. Details above.\n");
    white();

    return 0;
}


