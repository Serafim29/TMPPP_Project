using System;

public class CustomerNotifier : IOrderObserver
{
    private string customerEmail;

    public CustomerNotifier(string email)
    {
        customerEmail = email;
    }

    public void Update(Order order)
    {
        Console.WriteLine($"[Customer Notifier - {customerEmail}] Comanda ta și-a schimbat statusul în: {order.Status}");
    }
}
