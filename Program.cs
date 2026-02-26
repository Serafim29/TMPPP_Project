using System;

class Program
{
    static void Main()
    {
        Logger.Instance.Log("Application started.");
        Console.WriteLine("=== PLATFORMA E-COMMERCE ===\n");

        Console.WriteLine("--- 1. FACTORY METHOD ---");
        
        ProductFactory electronicsFactory = new ElectronicsFactory(24); 
        ProductFactory clothingFactory = new ClothingFactory("L", "Cotton"); 

        Product laptop = electronicsFactory.CreateProduct("Gaming Laptop", 4500);
        Product tshirt = clothingFactory.CreateProduct("T-Shirt", 150);

        Console.WriteLine($"Creat: {laptop}");
        Console.WriteLine($"Creat: {tshirt}");
        Logger.Instance.Log("Factory Method a creat produsele de bază.");
        Console.WriteLine();

        Console.WriteLine("--- 2. ABSTRACT FACTORY ---");

        Console.WriteLine("\n[Scenariu: Comanda Online]");
        IShoppingFactory onlineFactory = new OnlineShoppingFactory(20);
        ProcessOrder(onlineFactory, laptop, tshirt);

        Console.WriteLine("\n[Scenariu: Ridicare din Magazin]");
        IShoppingFactory storeFactory = new PhysicalStoreFactory("Mall Central");
        ProcessOrder(storeFactory, laptop, tshirt);

        Console.WriteLine("\n--- 3. BUILDER ---");
        IProductBuilder pcBuilder = new CustomPCBuilder();
        CustomPC premiumPC = pcBuilder
            .SetCPU("Intel i9")
            .SetRAM("32GB DDR5")
            .SetGPU("RTX 4090")
            .Build();
        
        Console.WriteLine($"Creat folosind Builder: {premiumPC}");
        Logger.Instance.Log($"Builder a creat: {premiumPC.Name}");

        Console.WriteLine("\n--- 4. PROTOTYPE ---");
        Product clonedLaptop = laptop.Clone();
        clonedLaptop.Name = "Gaming Laptop (Cloned)";
        clonedLaptop.Price = 4000; 
        
        Console.WriteLine($"Original: {laptop}");
        Console.WriteLine($"Clonat: {clonedLaptop}");
        Logger.Instance.Log("Prototype a fost folosit pentru clonare.");

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
