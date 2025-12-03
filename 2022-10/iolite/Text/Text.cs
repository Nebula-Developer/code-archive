using System.Text.RegularExpressions;

namespace Iolite;

public static class IoliteText {
    public static string Replace(string input, string find, string replacement) {
        return input.Replace(find, replacement);
    }
}