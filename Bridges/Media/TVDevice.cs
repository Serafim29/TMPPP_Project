using System;

public class TVDevice : IMediaDevice
{
    public void Play(string content)
    {
        Console.WriteLine($"[Smart TV] Se reda in rezolutie inalta pe ecranul televizorului: {content}");
    }
}
