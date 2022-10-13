using System.Text.RegularExpressions;

namespace Iolite;

public static class IoliteRegex {
    public static string Replace(string input, string pattern, string replacement) {
        return Regex.Replace(input, pattern, replacement);
    }
}