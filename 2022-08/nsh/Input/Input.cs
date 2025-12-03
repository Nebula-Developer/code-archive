using System.Collections.Generic;
using System;
using System.IO;
using System.Text.RegularExpressions;
using NSH.Shell;
using System.Diagnostics;

namespace NSH.Shell {
    public class Input {
        public Printer printer;
        public NShell hostShell;
        public static List<String> history = new List<String>();

        public Input(Printer printer, NShell hostShell) {
            this.printer = printer;
            this.hostShell = hostShell;
        }

        public static bool IsChar(char c) {
            return c >= ' ' && c <= '~';
        }

        public string ShortenDirectory(String dir) {
            // Convert a directory like: /this/is/my/folder
            // To: /t/i/m/folder

            String homePath = Environment.GetEnvironmentVariable("HOME") ?? "/home";

            string[] parts = dir.Replace(homePath, "~").Split('/');
            string result = "";
            for (int i = 0; i < parts.Length - 1; i++) {
                if (parts[i].Length > 0) {
                    result += parts[i][0];
                    if (i < parts.Length - 1) {
                        result += "/";
                    }
                }
            }

            result += parts[parts.Length - 1];
            if (result.Length == 0) result = "/";
            return result;
        }

        public static string ColorDirectory(String dir) {
            String[] parts = dir.Split('/');
            string result = GREY;
            for (int i = 0; i < parts.Length - 1; i++) {
                if (parts[i].Length > 0) {
                    result += parts[i];
                    if (i < parts.Length - 1) {
                        result += "/";
                    }
                }
            }

            result += GREEN + parts[parts.Length - 1];
            if (parts[0].Length == 0) result = RED + "/";
            result += RESET;
            return result;
        }

        public virtual string Prefix() {
            String user = Environment.UserName;
            String pc = Environment.MachineName;
            String localStr = user + "@" + pc;
            return localStr + " " + ShortenDirectory(Directory.GetCurrentDirectory()) + "> ";
        }

        public virtual string ColorPrefix() {
            String user = Environment.UserName;
            String pc = Environment.MachineName;
            String localStr = GREEN + user + RESET + "@" + YELLOW + pc + RESET;
            return  localStr + " " + GREENALT + ColorDirectory(ShortenDirectory(Directory.GetCurrentDirectory())) + RESET + "> ";
        }

        public static string GREY = "\x1b[38;5;242m";
        public static string RESET = "\x1b[0m";
        public static string RED = "\x1b[31m";
        public static string GREEN = "\x1b[32m";
        public static string YELLOW = "\x1b[33m";
        public static string BLUE = "\x1b[34m";
        public static string MAGENTA = "\x1b[35m";
        public static string CYAN = "\x1b[36m";
        public static string WHITE = "\x1b[37m";
        public static string BOLD = "\x1b[1m";
        public static string UNDERLINE = "\x1b[4m";
        public static string BLINK = "\x1b[5m";
        public static string GREENALT = "\x1b[38;5;46m";

        public static List<String> endCheckSegments = new List<String>() {
            "|", ">", "<", ">>", "2>", "2>>", "1>", "1>>",
            "&&", "||", "&", ";", "(", ")", "{", "}"
        };

        public static string FormatInput(string input) {
            String output = "";
            String[] inputSplit = input.Split(" ");

            for (int i = 0; i < inputSplit.Length; i++) {
                String s = inputSplit[i];
                bool check = false;
                String checkChunk = s;

                if (i == 0) check = true;
                if (i != 0) {
                    String beforeStr = inputSplit[i - 1];

                    foreach (String segment in endCheckSegments) {
                        if (beforeStr.EndsWith(segment)) {
                            check = true;
                            break;
                        } else if (s.Contains(segment)) {
                            check = true;
                            checkChunk = s.Substring(segment.Length + s.LastIndexOf(segment));
                            break;
                        }
                    }
                }

                if (endCheckSegments.Contains(s)) output += BLUE + s + RESET;
                else if (check) output += (Autocomplete.IsValid(checkChunk) ? GREEN : RED) + s + RESET;
                else output += s;
                if (i < inputSplit.Length - 1) output += " ";
            }
            return output;
        }

        public static void SetCursorPosEsc(int x, int y) {
            Console.Write("\x1b[" + (y + 1) + ";" + (x + 1) + "H");
        }

        private string InputLoop() {
            string input = "";
            int y = Console.CursorTop;
            int x = 0;

            String oldStr = "";
            Console.SetCursorPosition(0, y);
            Console.Write(ColorPrefix());

            while (true) {
                ConsoleKeyInfo key = Console.ReadKey(true);
                y = Console.CursorTop;

                switch (key.Key) {
                    case ConsoleKey.LeftArrow:
                        if (x > 0) {
                            x--;
                            Console.SetCursorPosition(x, y);
                        }
                        break;

                    case ConsoleKey.RightArrow:
                        if (x < input.Length) {
                            x++;
                            Console.SetCursorPosition(x, y);
                        } else {
                            String correct = Autocomplete.SearchAutocomplete(input, x) ?? "";
                            if (correct.Split(" ").Length > 1) {
                                // hello w|hello world
                                // =>
                                // hello w|orld
                                correct = correct.Substring(input.Length);
                            } else {
                                correct = correct.Substring(input.Split(" ")[input.Split(" ").Length - 1].Length);
                            }
                            input += correct;
                            x = input.Length;
                        }
                        break;

                    case ConsoleKey.Backspace:
                        if ((key.Modifiers & ConsoleModifiers.Control) != 0) {
                            if (x > 0) {
                                input = input.Remove(x - 1, 1);
                                x--;
                                Console.SetCursorPosition(x, y);
                                Console.Write(" ");
                                Console.SetCursorPosition(x, y);
                            }
                        } else {
                            if (x > 0) {    
                                input = input.Remove(x - 1, 1);
                                x--;
                            }
                        }
                        y = Console.CursorTop;
                        break;

                    case ConsoleKey.Tab:
                        
                        break;
                }

                if (key.Key == ConsoleKey.Enter) {
                    break;
                } else if (IsChar(key.KeyChar)) {
                    input = input.Insert(x, key.KeyChar.ToString());
                    x++;
                }


                String autocomplete = Autocomplete.SearchAutocomplete(input, x) ?? "";
                String inputEndSplit = input.Split(" ")[input.Split(" ").Length - 1];

                if (input.Length < autocomplete.Length) {
                    autocomplete = autocomplete.Substring(input.Length);
                } else autocomplete = "";

                String mainStr = input + GREY + autocomplete + RESET;

                if (oldStr == mainStr) continue;
                int diff = oldStr.Length - mainStr.Length;
                String spaces = new String(' ', diff < 0 ? 0 : diff);

                Console.SetCursorPosition(Prefix().Length, y);
                Console.Write(FormatInput(input) + GREY + autocomplete + RESET + spaces);

                oldStr = mainStr;
                int xPos = x + Prefix().Length;
                Console.SetCursorPosition(xPos, y);
            }

            int diffEnd = oldStr.Length - input.Length + Prefix().Length + input.Length;
            String spacesEnd = new String(' ', diffEnd < 0 ? 0 : diffEnd);

            printer.Print(spacesEnd, 0, y);
            printer.Print(ColorPrefix() + FormatInput(input), 0, y);
            
            Console.WriteLine();
            history.Add(input);
            return input;
        }

        public string FetchInput() {
            string input = InputLoop();
            return input;
        }
    }
}