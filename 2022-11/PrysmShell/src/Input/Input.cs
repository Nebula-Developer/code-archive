using System;
using Prysm.System;

namespace Prysm.Input;

public static class PrysmInput {
    public static string RightArrow = "";

    public static string Yellow = "\x1b[33m",
                         Red = "\x1b[31m",
                         Blue = "\x1b[34m",

                         YellowBG = "\x1b[43m",
                         RedBG = "\x1b[41m",
                         BlueBG = "\x1b[44m",
                         Reset = "\x1b[0m",


                         White = "\x1b[37m",
                         Black = "\x1b[30m",
                         BlackBG = "\x1b[40m",
                         WhiteBG = "\x1b[47m";

    public static void WriteAt(int x, int y, String text) {
        Output.printfxy(x + 1, y + 1, text);
    }

    public static void WriteAt(int x, String text) {
        Output.printfxy(x + 1, Console.CursorTop + 1, text);
    }

    public static string FG(int r, int g, int b) {
        return "\x1b[38;2;" + r + ";" + g + ";" + b + "m";
    }

    public static string BG(int r, int g, int b) {
        return "\x1b[48;2;" + r + ";" + g + ";" + b + "m";
    }
    
    public static string Prefix() {
        String host = Environment.MachineName;
        String user = Environment.UserName;

        return BlackBG + White + " " + user + "@" + host + " " + Reset + Black + BlueBG + RightArrow + " " + Environment.CurrentDirectory + " " + Reset + Blue + RightArrow + Reset + " ";
    }

    public static string PrefixNoColor() {
        String host = Environment.MachineName;
        String user = Environment.UserName;

        return " " + user + "@" + host + " " + RightArrow + " " + Environment.CurrentDirectory + " " + RightArrow + " ";
    }

    public static string Read() {
        string input = "";
        string oldInput = "";
        int index = 0;

        while (true) {
            String prefix = Prefix();
            String prefixNoColor = PrefixNoColor();

            WriteAt(0, prefix + input);
            int oldDiff = oldInput.Length - input.Length;
            if (oldDiff > 0)
                WriteAt(input.Length + prefixNoColor.Length, new String(' ', oldDiff));

            oldInput = input;
            Output.flush();
            Console.SetCursorPosition(index + prefixNoColor.Length, Console.CursorTop);

            ConsoleKeyInfo key = Console.ReadKey(true);
            if (key.Key == ConsoleKey.Enter) break;

            bool isChar = (key.KeyChar >= ' ' && key.KeyChar <= '~');

            switch (key.Key) {
                case ConsoleKey.Backspace:
                    if (index > 0) {
                        input = input.Remove(index - 1, 1);
                        index--;
                    }
                    break;

                case ConsoleKey.LeftArrow:
                    if (index > 0) index--;
                    break;
                
                case ConsoleKey.RightArrow:
                    if (index < input.Length) index++;
                    break;

                default:
                    if (!isChar) break;

                    input = input.Insert(index, key.KeyChar.ToString());
                    index++;
                    break;
            }
        }

        Console.WriteLine();
        return input;
    }
}

/*

Characters:
The opposite of  is 
Fade symbol: 
*/