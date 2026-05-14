using System;
using System.Collections.Generic;

// Facade - ofera o interfata unificata si mai simpla catre multiple clase/subsisteme (Abstract Factory, Services, Notifications).
public class ECommerceFacade
{
    public void PlaceOrder(IShoppingFactory factory, List<Product> products, INotificationSender notificationMethod)
    {
        Console.WriteLine("=== [Facade] Initializare plasare comanda ===");
        
        // 1. Creare comanda utilizand clasa existenta "Order"
        Order order = factory.CreateOrder();
        foreach(var product in products)
        {
            order.AddProduct(product);
        }

        // 2. Creare a metodei de plata specifice fabricii si plasarea propriu zisa
        IPaymentMethod paymentMethod = factory.CreatePaymentMethod();
        IOrderService orderService = new OrderService(paymentMethod);
        
        orderService.PlaceOrder(order); // Va afisa si va plati prin serviciu
        
        // 3. Afisare detalii
        Console.WriteLine(order.ToString());

        // 4. Folosirea Bridge pentru a trimite o notificare prin canalul precizat
        Notification notification = new OrderNotification(notificationMethod);
        notification.Notify($"Comanda dvs. in valoare de {order.TotalPrice()} Lei a fost plasata cu succes!");

        Console.WriteLine("=== [Facade] Comanda finalizata pe deplin ===");
        Logger.Instance.Log("Facade a coordonat plasarea comenzii complexe.");
    }
}
