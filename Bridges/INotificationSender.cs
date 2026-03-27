using System;

// Implementor - defineste interfata pentru clasele de implementare din Bridge pattern.
public interface INotificationSender
{
    void Send(string message);
}
