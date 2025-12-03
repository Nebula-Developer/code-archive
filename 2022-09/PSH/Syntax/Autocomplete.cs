using System;

namespace PSH.Syntax {
    public class Autocomplete {
        public static String RemLastSplit(String str) {
            if (!str.Contains(" ")) return "";
            return str.Substring(0, str.LastIndexOf(" "));
        }

        public static string? SearchAutocomplete(String str, int index = -1) {
            if (index == -1) index = str.Length;
            if (index != str.Length) return null;

            String[] strSplit = str.Split(' ');
            String last = strSplit[strSplit.Length - 1];

            String output = RemLastSplit(str);
            String? FileComplete = Syntax.PearlSyntax.SearchFileSyntax(last);
            String? PathComplete = Syntax.PearlSyntax.SearchPathSyntax(last);

            if (FileComplete != null) {
                output += FileComplete;
            } else if (PathComplete != null) {
                output += PathComplete;
            } else {
                return null;
            }
            return output;
        }
    }
}