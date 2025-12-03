using System;
using System.Collections.Generic;

namespace VisualAspect {
  public static class Drawing {
    public static void DrawData(Data data, int posX, int posY, int width, int height) {
      List<string> lines = data.Lines;
      Console.Clear();

      int cursorX = data.X;
      int offsetX = data.X > width ? data.X - width : 0;
      int printCursorX = cursorX - offsetX;
      
      for (int line = 0; line < height; line++) {
        if (line >= lines.Count) break;
        string text = lines[line];
        for (int i = 0; i < width; i++) {
          if (i >= text.Length) break;
          Console.SetCursorPosition(posX + i, posY + line);
          if (i + offsetX >= text.Length) break;
          Console.Write(text[i + offsetX]);
        }
      }
      
      int realX = Math.Min(data.CurrentLine.Length, printCursorX);
      Console.SetCursorPosition(posX + realX, posY + data.Y);
    }
  }
}

