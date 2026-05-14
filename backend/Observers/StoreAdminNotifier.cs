using System;

public class StoreAdminNotifier : IOrderObserver
{
    public void Update(Order order)
    {
        Console.WriteLine($"[Admin Notifier] O comandă și-a schimbat statusul în: {order.Status}. Valoare totală (cu livrare): {order.CalculateTotalWithShipping()}");
    }
}
