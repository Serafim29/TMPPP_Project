using System;

public class PhoneDevice : IMediaDevice
{
    public void Play(string content)
    {
        Console.WriteLine($"[Telefon] Se reda pe difuzorul si ecranul telefonului: {content}");
    }
}
