using System;

// Concrete Implementor 2
public class SmsSender : INotificationSender
{
    public void Send(string message)
    {
        Console.WriteLine($"[SMS] Trimitere mesaj text: {message}");
        Logger.Instance.Log("Notificare de tip SMS a fost trimisa.");
    }
}
