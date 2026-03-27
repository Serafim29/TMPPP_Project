using System;

// Abstraction - clasa de baza arhitecturala ce pastreaza o referinta la Implementor
public abstract class Notification
{
    protected INotificationSender sender;

    protected Notification(INotificationSender sender)
    {
        this.sender = sender;
    }

    public abstract void Notify(string text);
}
