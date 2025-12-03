using System;
using System.Collections.Generic;

namespace NInput;

public static class ProgramExample
{
    public static void Main(String[] args)
    {
        while (true)
        {
            Console.ResetColor();
            String input = new Input().Read();
            if (input == "exit") break;
                
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("\"" + input + "\"");
        }
    }
}

public class Input
{
    public string input = "";
    public string oldInput = "";
    public int index = 0;
    
    public string Read()
    {
        this.startX = Console.CursorLeft;
        this.startY = Console.CursorTop;
        
        this.input = "";
        this.index = 0;
        this.oldInput = "";

        while (true)
        {
            ConsoleKeyInfo c = Console.ReadKey(true);
            ConsoleKey key = c.Key;

            bool isAsciiChar = c.KeyChar >= 32 && c.KeyChar <= 126;
            
            if (key == ConsoleKey.Enter)
                break;
            

            if (isAsciiChar && c.Modifiers is 0 or ConsoleModifiers.Shift)
            {
                input = input.Insert(index, c.KeyChar.ToString());
                index++;
            }

            else if (key == ConsoleKey.Backspace && index > 0)
            {
                if ((c.Modifiers & ConsoleModifiers.Alt) != 0 || (c.Modifiers & ConsoleModifiers.Control) != 0)
                {
                    // Check if the previous character is a space, if so keep removing characters until a non-space is found
                    while (index > 0 && input[index - 1] == ' ')
                    {
                        input = input.Remove(index - 1, 1);
                        index--;
                    }

                    if (index > 0)
                    {
                        int lastSpace = input.LastIndexOf(' ', index - 1);
                        if (lastSpace == -1)
                        {
                            input = input.Remove(0, index);
                            index = 0;
                        }
                        else
                        {
                            input = input.Remove(lastSpace + 1, index - lastSpace - 1);
                            index = lastSpace + 1;
                        }
                    }
                }
                else
                {
                    input = input.Remove(index - 1, 1);
                    index--;
                }
            }

            else if (key == ConsoleKey.Delete && index < input.Length)
            {
                input = input.Remove(index, 1);
            }
            
            else if (key == ConsoleKey.LeftArrow && index > 0)
            {
                index--;
            }
            
            else if (key == ConsoleKey.RightArrow && index < input.Length)
            {
                index++;
            }
            
            else if (key == ConsoleKey.Home)
            {
                index = 0;
            }
            
            else if (key == ConsoleKey.End)
            {
                index = input.Length;
            }
            
            else if (key == ConsoleKey.B && ((c.Modifiers & ConsoleModifiers.Control) != 0 || (c.Modifiers & ConsoleModifiers.Alt) != 0) && index > 0)
            {
                index--;
                // Check if the previous character is a space, if so keep removing characters until a non-space is found
                while (index > 0 && input[index - 1] == ' ')
                {
                    index--;
                }
                
                // Keep going left until a space is found
                while (index > 0 && input[index - 1] != ' ')
                {
                    index--;
                }
            }
            
            else if (key == ConsoleKey.F && ((c.Modifiers & ConsoleModifiers.Control) != 0 || (c.Modifiers & ConsoleModifiers.Alt) != 0) && index < input.Length)
            {
                index++;
                // Check if the next character is a space, if so keep removing characters until a non-space is found
                while (index < input.Length && input[index] == ' ')
                {
                    index++;
                }
                
                // Keep going right until a space is found
                while (index < input.Length && input[index] != ' ')
                {
                    index++;
                }
            }

            else
            {
                this.onUnhandledKey?.Invoke(c);
            }


            this.onInput?.Invoke();
            oldInput = input;
        }

        Console.WriteLine();
        return input;
    }
    
    public int startX, startY;

    public Action onInput;

    public Action<ConsoleKeyInfo> onUnhandledKey = (c) => { };

    public Func<bool, string> prefix = (useColor) =>
    {
        if (useColor)
            return "\u001b[32m\u001b[1m>\u001b[0m ";
        else
            return "> ";
    };
    
    public Input(Action? onInput = null, Action<ConsoleKeyInfo>? onUnhandledKey = null)
    {
        this.onInput = onInput ?? new Action(() =>
        {
            Console.SetCursorPosition(this.startX, this.startY);
            Console.Write(prefix(true) + input);
            int oldInputDiff = oldInput.Length - input.Length;
            if (oldInputDiff > 0)
                Console.Write(new string(' ', oldInputDiff));
            Console.SetCursorPosition(this.startX + index + prefix(false).Length, this.startY);
        });
        
        this.onUnhandledKey = onUnhandledKey ?? this.onUnhandledKey;
    }
}