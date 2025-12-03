using System;
using System.IO;

namespace VisualAspect {
  public static class Program {
    public static void Main(string[] args) {
      Console.Clear();
      string[] lines = File.ReadAllLines("Program.cs");
      Data data = new Data();
      data.Lines = new List<string>(lines);
      Drawing.DrawData(data, 4, 2, Console.WindowWidth - 8, Console.WindowHeight - 4);
      Input.FetchInput(data);
    }
  }
}

