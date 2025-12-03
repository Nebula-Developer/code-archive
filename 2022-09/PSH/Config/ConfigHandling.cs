using System.IO;
using System;
using PSH.Strings;

namespace PSH.ConfigHandling {
    public class PearlConfig {
        /// <summary>
        /// Read a config file as a configuration dictionary.
        /// </summary>
        /// <param name="path">The config file to read.</param>
        /// <param name="useAbsPath">Whether to use a path relative to the pearl executable, or an absolute path.</param>
        /// <param name="commentChar">The character to use for comments.</param>
        /// <returns>A dynamic-typed dictionary of the config file.</returns>
        public static Dictionary<string, dynamic>? ReadConfig(String path, bool useAbsPath = false, String commentChar = ";") {
            String configPath = useAbsPath ? path : Path.Combine(AppContext.BaseDirectory, path);
            Dictionary<string, dynamic> config = new Dictionary<string, dynamic>();

            if (File.Exists(configPath)) {
                String[] lines = File.ReadAllText(configPath).Replace("&&","\n").Split("\n");

                foreach (string line in lines) {
                    if (line.StartsWith(commentChar))
                        continue;

                    String outLine = line.Substring(0, line.Contains(commentChar) ? line.IndexOf(commentChar) - 1 : line.Length).Replace(" ", "");
                    if (outLine.Length == 0)
                        continue;

                    if (!outLine.Contains("="))
                        continue;

                    string key = outLine.Substring(0, outLine.IndexOf("="));
                    string value = outLine.Substring(outLine.IndexOf("=") + 1);

                    config.Add(key, ParseStrValue(value));
                }
            } else {
                return null;
            }

            return config;
        }

        /// <summary>
        /// Convert a string to a dynamic type
        /// </summary>
        /// <param name="value">The string to convert</param>
        public static dynamic? ParseStrValue(String value) {
            String lowValue = value.ToLower();
            
            // BOOLEANS:
            if (lowValue == "yes" || lowValue == "true" || lowValue == "on")
                return true;
            else if (lowValue == "no" || lowValue == "false" || lowValue == "off")
                return false;
            
            // NUMBERS:
            if (int.TryParse(value, out int intValue))
                return intValue;
            else if (double.TryParse(value, out double doubleValue))
                return doubleValue;

            // STRINGS:
            if (value.StartsWith("\"") && value.EndsWith("\""))
                return value.Substring(1, value.Length - 2);
            else if (value.StartsWith("'") && value.EndsWith("'"))
                if (Char.TryParse(value.Substring(1, value.Length - 2), out char charValue))
                    return charValue;
            
            // ARRAYS:
            if (value.StartsWith("[") && value.EndsWith("]")) {
                String arrayStr = value.Substring(1, value.Length - 2);
                String[] array = arrayStr.Split(",");

                // Handle array types:
                List<dynamic> arrayOut = new List<dynamic>();
                foreach (String arrayValue in array) {
                    dynamic? parsedValue = ParseStrValue(arrayValue);
                    if (parsedValue != null)
                        arrayOut.Add(parsedValue);
                }

                return arrayOut.ToArray();
            }

            return value;
        }

        /// <summary>
        /// Cast a config dictionary to a class.
        /// </summary>
        /// <param name="config">The config dictionary to cast.</param>
        /// <param name="type">The type to cast to.</param>
        /// <returns>The casted config (or null if the cast failed)</returns>
        public static dynamic? CastConfig(Dictionary<string, dynamic> config, Type type) {
            dynamic? castedConfig = Activator.CreateInstance(type);

            foreach (KeyValuePair<string, dynamic> configItem in config) {
                if (type.GetProperty(configItem.Key) != null)
                    type.GetProperty(configItem.Key)?.SetValue(castedConfig, configItem.Value);
            }

            return castedConfig;
        }

        /// <summary>
        /// Convert a class to a config dictionary.
        /// </summary>
        /// <param name="config">The config to convert.</param>
        /// <returns>The converted config.</returns>
        public static Dictionary<string, dynamic> ConvertConfig(dynamic config) {
            Dictionary<string, dynamic> configDict = new Dictionary<string, dynamic>();

            foreach (var prop in config.GetType().GetProperties()) {
                configDict.Add(prop.Name, prop.GetValue(config));
            }

            foreach (var field in config.GetType().GetFields()) {
                configDict.Add(field.Name, field.GetValue(config));
            }

            return configDict;
        }
    }
}