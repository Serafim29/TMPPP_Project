using System;

public class VideoMedia : MediaFile
{
    private string _videoFile;

    public VideoMedia(string videoFile, IMediaDevice device) : base(device)
    {
        _videoFile = videoFile;
    }

    public override void Render()
    {
        Console.WriteLine($"[Video] Decodare cadre video pentru fisierul: '{_videoFile}'...");
        _device.Play($"🎬 Video feed din {_videoFile}");
    }
}
