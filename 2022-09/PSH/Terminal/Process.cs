using System.Diagnostics;

namespace PSH.Terminal {
    public class TermProc {
        public static bool Start(string command) {
            String function = command.Split(' ')[0];
            switch (function) {
                case "exit":
                    return false;
            }

            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.FileName = "/bin/bash";
            startInfo.Arguments = "-c \"stty -onlcr; " + command + "\"";
            startInfo.UseShellExecute = false;
            startInfo.RedirectStandardError = false;
            startInfo.RedirectStandardOutput = false;
            startInfo.CreateNoWindow = true;
            startInfo.WindowStyle = ProcessWindowStyle.Hidden;

            Process process = new Process();
            process.StartInfo = startInfo;
            process.Start();

            process.WaitForExit();
            process.Close();
            process.Dispose();
            return true;
        }

        public static bool IsError(String str) {
            String low = str.ToLower();
            return low.Contains("error") || low.Contains("fatal") || low.Contains("exception") || low.Contains("fail") || low.Contains("cannot");
        }
    }
}