using System;
using System.Collections.Generic;

namespace VisualAspect {
  /// <summary>
  /// Holds data for the text editor.
  /// </summary>
  public class Data {
    public List<string> Lines { get; set; }
    public int X { get; set; }
    public int Y { get; set; }

    public char CurrentChar {
      get {
        if (Lines.Count <= Y) return '\0';
        if (X >= Lines[Y].Length) return '\0';
        return Lines[Y][X];
      }
    }

    public string CurrentLine {
      get {
        if (Lines.Count <= Y) return "";
        return Lines[Y];
      }
      set {
        if (Lines.Count <= Y) return;
        Lines[Y] = value;
      }
    }

    public string CurrentWord {
      get {
        if (Lines.Count <= Y) return "";
        if (X >= Lines[Y].Length) return "";
        string line = Lines[Y];
        int start = X;
        int end = X;
        while (start > 0 && line[start - 1] != ' ') start--;
        while (end < line.Length && line[end] != ' ') end++;
        return line.Substring(start, end - start);
      }
    }

    public Data() {
      Lines = new List<string>() { "" };
      X = 0;
      Y = 0;
    }

    public void CapXPosition() {
      if (Lines.Count <= Y) return;
      X = Math.Min(X, CurrentLine.Length);
    }

    public void InsertChar(char c) {
      CapXPosition();
      CurrentLine = CurrentLine.Insert(X, c.ToString());
      X++;
    }

    public void RemoveChar() {
      CapXPosition();
      if (X > 0) {
        CurrentLine = CurrentLine.Remove(X - 1, 1);
        X--;
      } else if (Y > 0) {
        string previousLine = Lines[Y - 1];
        string curCopy = CurrentLine;
        Lines.RemoveAt(Y);
        Y--;
        X = previousLine.Length;
        CurrentLine = previousLine + curCopy;
      }
    }

    public void MoveRight() {
      CapXPosition();
      if (X + 1 > CurrentLine.Length) {
        if (Y + 1 < Lines.Count) {
          Y++;
          X = 0;
        }
      } else X++;
    }

    public void MoveLeft() {
      CapXPosition();
      if (X - 1 < 0) {
        if (Y - 1 >= 0) {
          Y--;
          X = CurrentLine.Length;
        }
      } else X--;
    }

    public void MoveUp() { 
      if (Y - 1 >= 0) {
        Y--;
      }
    }

    public void MoveDown() {
      if (Y + 1 < Lines.Count) {
        Y++;
      }   
    }
 
    public void InsertLine() {
      string currentLineChopped = CurrentLine.Substring(X);
      CurrentLine = CurrentLine.Substring(0, X);
      Lines.Insert(Y + 1, currentLineChopped);
      Y++;
      X = 0;
    }
  }
}
