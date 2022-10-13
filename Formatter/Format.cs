using System.IO;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Iolite;

public class IoliteFormatter {
    public string Data = "";
    public static string[] StringData = new string[1024];

    public void Regex(string pattern, string replacement, bool modPattern = true) {
        if (modPattern) {
            pattern = pattern.Replace(" ", "\\s*");
            pattern = pattern.Replace("__", "\\s+");
        }

        Data = IoliteRegex.Replace(Data, pattern, replacement);
    }

    public void Replace(string find, string replacement) {
        Data = IoliteText.Replace(Data, find, replacement);
    }

    public void BeginFormatterSequence(String InputFile) {
        if (Arguments.InputFile == null || !File.Exists(InputFile)) {
            Console.WriteLine("Error: Could not open file: '" + InputFile + "'");
            Environment.Exit(1);
        }

        Data = File.ReadAllText(Arguments.InputFile);
        this.InitSequence();
    }

    private void SubstituteStrings() {
        Replace("\\\"", Strings.Speech);

        int id = 0;
        System.Text.RegularExpressions.Regex.Matches(Data, "\".*?\"").ToList().ForEach(match => {
            string idStr = "<<" + Strings.StringPrefix + id + ">>";
            StringData[id] = match.Value;
            id++;
            Data = Data.Replace(match.Value, idStr);
        });
    }

    private void RepopulateStrings() {
        System.Text.RegularExpressions.Regex.Matches(Data, "<<" + Strings.StringPrefix + "[0-9]+>>").ToList().ForEach(match => {
            int id = int.Parse(match.Value.Replace("<<" + Strings.StringPrefix, "").Replace(">>", ""));
            Data = Data.Replace(match.Value, StringData[id]);
        });

        Replace(Strings.Speech, "\\\"");
    }

    private void PrestringActions() {
        // Replace:
        // cimport "<file>"
        // With:
        // #include <<file>>
        Regex("cimport__\"(.*?)\"", "#include <$1>");
        // Local import:
        Regex("climport__\"(.*?)\"", "#include \"<$1>\"");
    }

    private void MainActions() {
        // This is the main C translation function. It will handle things like functions.

        // Replace:
        // func <name>(<args>) -> <return type> { ... }
        // With:
        // <return type> <name>(<args>) { ... }
        Regex("func__(.*?)\\((.*?)\\) -> (.*?) \\{", "$3 $1($2) {");
        // Void shorthand:
        Regex("func__(.*?)\\((.*?)\\) \\{", "void $1($2) {");
        // Classed declaration:
        Regex("func__(.*?)\\.(.*?)\\((.*?)\\) -> (.*?) \\{", "$4 $1_$2($3) {");

    }

    private void InitSequence() {
        PrestringActions();
        SubstituteStrings();
        MainActions();
        RepopulateStrings();
    }
}

/*

In gcc, when you do this:
gcc -o ./example -x - <your stuff here>
It will compile your stuff and output it to ./example, all from the commandline without
a C file.

If you wanted to do this but as an include to that file, you would do:
gcc -o ./example -x c-header - <your stuff here>

Then, to include it, you would do:
gcc -o ./example -x c - <your stuff here> -include ./example

If you wanted to do this:
gcc -o ./example -x - <your stuff here>
While including this:
gcc -o ./example -x c-header - <your stuff here>
You would do this (its a very long line):
gcc -o ./example -x - <your stuff here> -include <(gcc -x c-header - <your stuff here> -E -P -C)>

*/