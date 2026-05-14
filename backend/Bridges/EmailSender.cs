using System;

// Concrete Implementor 1
public class EmailSender : INotificationSender
{
    public void Send(string message)
    {
        Console.WriteLine($"[Email] Trimitere mesaj: {message}");
        Logger.Instance.Log("Notificare de tip Email a fost trimisa.");
    }
}
