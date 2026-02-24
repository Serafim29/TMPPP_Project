using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== PLATFORMA E-COMMERCE ===\n");

        Console.WriteLine("--- 1. FACTORY METHOD ---");
        
        ProductFactory electronicsFactory = new ElectronicsFactory(24); 
        ProductFactory clothingFactory = new ClothingFactory("L", "Cotton"); 

        Product laptop = electronicsFactory.CreateProduct("Gaming Laptop", 4500);
        Product tshirt = clothingFactory.CreateProduct("T-Shirt", 150);

        Console.WriteLine($"Creat: {laptop}");
        Console.WriteLine($"Creat: {tshirt}");
        Console.WriteLine();

        Console.WriteLine("--- 2. ABSTRACT FACTORY ---");

        Console.WriteLine("\n[Scenariu: Comanda Online]");
        IShoppingFactory onlineFactory = new OnlineShoppingFactory(20);
        ProcessOrder(onlineFactory, laptop, tshirt);

        Console.WriteLine("\n[Scenariu: Ridicare din Magazin]");
        IShoppingFactory storeFactory = new PhysicalStoreFactory("Mall Central");
        ProcessOrder(storeFactory, laptop, tshirt);

        Console.ReadKey();
    }

    static void ProcessOrder(IShoppingFactory factory, Product p1, Product p2)
    {
        Order order = factory.CreateOrder();
        
        order.AddProduct(p1);
        order.AddProduct(p2);

        IPaymentMethod payment = factory.CreatePaymentMethod();

        Console.WriteLine(order); 
        
        IOrderService orderService = new OrderService(payment);
        orderService.PlaceOrder(order);
    }
}
