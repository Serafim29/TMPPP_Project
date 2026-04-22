using System;

public abstract class MediaFile
{
    protected IMediaDevice _device;

    public MediaFile(IMediaDevice device)
    {
        _device = device;
    }

    public abstract void Render();
}
