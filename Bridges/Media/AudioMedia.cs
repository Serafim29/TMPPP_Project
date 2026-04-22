using System;

public class AudioMedia : MediaFile
{
    private string _audioTrack;

    public AudioMedia(string audioTrack, IMediaDevice device) : base(device)
    {
        _audioTrack = audioTrack;
    }

    public override void Render()
    {
        Console.WriteLine($"[Audio] Procesare pista audio: '{_audioTrack}'...");
        _device.Play($"🎶 Audio stream din {_audioTrack}");
    }
}
