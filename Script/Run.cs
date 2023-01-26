using System.Collections.Generic;
using System.Text.RegularExpressions;

public static class Script {
    public static void Run(string[] lines) {
        List<Tuple<string, dynamic?>> variables = new List<Tuple<string, dynamic?>>();

        for (int i = 0; i < lines.Length; i++) {
            string line = lines[i];
            string[] words = line.Split(" ");

            if (words[0] == "var") {
                if (words.Length == 4 && words[2] == "=") {
                    variables.Add(new Tuple<string, dynamic?>(words[1], StringToValue(words[3])));
                } else if (words.Length == 2) {
                    variables.Add(new Tuple<string, dynamic?>(words[1], null));
                } else {
                    Error("Invalid variable declaration", i, line);
                }
            }

            if (words[0] == "log") {
                if (words.Length == 2) {
                    dynamic? value = GetValue(words[1], variables);
                    if (value != null) {
                        Console.WriteLine(value);
                    } else {
                        Error("Variable not found", i, line);
                    }
                } else {
                    Error("Invalid log statement", i, line);
                }
            }

            if (GetVariable(words[0], variables) != null) {
                if (words.Length == 3 && words[1] == "=") {
                    dynamic? value = StringToValue(words[2]);
                    if (value != null) {
                        SetVariable(words[0], value, variables);
                    } else {
                        Error("Invalid value", i, line);
                    }
                } else {
                    Error("Invalid variable assignment", i, line);
                }
            }
        }
    }

    // use regex to get type of value and convert it to the correct type
    public static dynamic? StringToValue(string value) {
        if (Regex.IsMatch(value, @"^"".*""$")) {
            return value.Substring(1, value.Length - 2);
        } else if (Regex.IsMatch(value, @"^'.*'$")) {
            return value.Substring(1, value.Length - 2);
        } else if (Regex.IsMatch(value, @"^true$")) {
            return true;
        } else if (Regex.IsMatch(value, @"^false$")) {
            return false;
        } else if (Regex.IsMatch(value, @"^null$")) {
            return null;
        } else if (Regex.IsMatch(value, @"^(\d+)$")) {
            return int.Parse(value);
        } else if (Regex.IsMatch(value, @"^(\d+\.\d+)$")) {
            return float.Parse(value);
        } else {
            return value;
        }
    }

    public static dynamic? GetValue(string name, List<Tuple<string, dynamic?>> variables) {
        foreach (Tuple<string, dynamic?> variable in variables) {
            if (variable.Item1 == name) {
                return variable.Item2;
            }
        }
        return null;
    }

    public static void SetVariable(string name, dynamic? value, List<Tuple<string, dynamic?>> variables) {
        for (int i = 0; i < variables.Count; i++) {
            if (variables[i].Item1 == name) {
                variables[i] = new Tuple<string, dynamic?>(name, value);
            }
        }
    }

    public static Tuple<string, dynamic?>? GetVariable(string name, List<Tuple<string, dynamic?>> variables) {
        foreach (Tuple<string, dynamic?> variable in variables) {
            if (variable.Item1 == name) {
                return variable;
            }
        }
        return null;
    }

    public static void Error(string message, int line, string lineText) {
        Console.WriteLine($"[{line}] {message} - ({lineText})");
    }
}
