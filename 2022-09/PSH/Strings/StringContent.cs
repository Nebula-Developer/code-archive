using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace PSH.Strings {
    public class PearlStrings {
        /// <summary>
        /// Remove content between two pins in a haystack.
        /// </summary>
        /// <param name="str">String to use</param>
        /// <param name="start">The start key</param>
        /// <param name="end">The end key</param>
        public static String RemoveBetween(String str, String start, String end) {
            String regex = $"{start}.*?{end}";
            return Regex.Replace(str, regex, "");
        }
    }
}