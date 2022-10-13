using System.IO;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Iolite;

public class IoliteFormatter {
    public string Data = "";
    public static string[] StringData = new string[1024];

    public void Regex(string pattern, string replacement) {
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

    private void InitSequence() {
        SubstituteStrings();

        RepopulateStrings();
    }
}