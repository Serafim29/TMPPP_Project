using System;

// Refined Abstraction - extinde abstractia pentru un scenariu concret 
public class OrderNotification : Notification
{
    public OrderNotification(INotificationSender sender) : base(sender)
    {
    }

    public override void Notify(string text)
    {
        Console.WriteLine("Generare sablon factura comanda...");
        string fullMessage = $"IMPORTANT: {text}";
        sender.Send(fullMessage);
    }
}
