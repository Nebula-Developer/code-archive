using System;

namespace VisualAspect {
  public static class Input {
    public static void FetchInput(Data data) {
      while (true) {
        ConsoleKeyInfo key = Console.ReadKey(true);

        if (key.Key == ConsoleKey.Escape)
          return;

        bool isPrintable = key.KeyChar.ToString().Length == 1;
        isPrintable &= key.KeyChar != '\0' && key.Key != ConsoleKey.Enter && key.Key != ConsoleKey.Backspace;

        if (isPrintable) {
          data.InsertChar(key.KeyChar);
        } else switch (key.Key) {
          case ConsoleKey.Backspace:
            data.RemoveChar();
            break;

          case ConsoleKey.RightArrow:
            data.MoveRight();
            break;

          case ConsoleKey.LeftArrow:
            data.MoveLeft();
            break;

          case ConsoleKey.UpArrow:
            data.MoveUp();
            break;

          case ConsoleKey.DownArrow:
            data.MoveDown();
            break;

          case ConsoleKey.Home:
            data.X = 0;
            break;

          case ConsoleKey.End:
            data.X = data.Lines[data.Y].Length;
            break;

          case ConsoleKey.Enter:
            data.InsertLine();
            break;
        }

        Drawing.DrawData(data, 4, 2, Console.WindowWidth - 8, Console.WindowHeight - 4);
      }
    }
  }
}
