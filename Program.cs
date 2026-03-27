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

        Console.WriteLine("\n--- 5. ADAPTER ---");
        // Testam plata prin Stripe (API Extern incompatibil) folosind Adaptorul
        StripePaymentAPI stripeApi = new StripePaymentAPI();
        IPaymentMethod stripeAdapter = new StripePaymentAdapter(stripeApi);
        stripeAdapter.Pay(1250); // Apelam metoda noastra standard care 'vorbeste' de fapt cu Stripe
        
        Console.WriteLine("\n--- 6. BRIDGE ---");
        // Decuplam logica de notificare (Abstraction) de implementarea efectiva (Implementor)
        INotificationSender emailSender = new EmailSender();
        INotificationSender smsSender = new SmsSender();

        Notification emailNotification = new OrderNotification(emailSender);
        emailNotification.Notify("Comanda #102 a fost confirmata.");

        Notification smsNotification = new OrderNotification(smsSender);
        smsNotification.Notify("Comanda #103 a fost expediata.");

        Console.WriteLine("\n--- 7. FACADE ---");
        // Simplificam interactiunea utilizatorului cu intreg subsistemul complex de plasare a comenzilor
        ECommerceFacade facade = new ECommerceFacade();
        List<Product> productsToOrder = new List<Product> { laptop, tshirt };
        
        // Plasare comanda complet mascand detaliile despre abstract factory, order builder, etc.
        facade.PlaceOrder(onlineFactory, productsToOrder, smsSender);

        Console.WriteLine("\n--- 8. COMPOSITE ---");
        ProductBundle techBundle = new ProductBundle(500, "Gamer Tech Bundle");
        techBundle.AddProduct(laptop);
        
        Product mouse = new Product(501, "Gaming Mouse", 300);
        Product keyboard = new Product(502, "Mechanical Keyboard", 500);
        
        ProductBundle accessoriesBundle = new ProductBundle(503, "Accessories Bundle");
        accessoriesBundle.AddProduct(mouse);
        accessoriesBundle.AddProduct(keyboard);

        techBundle.AddProduct(accessoriesBundle);
        
        Console.WriteLine("Structura pachetului:");
        techBundle.Display();
        
        Console.WriteLine($"\nPret total pachet calculat dinamic: ${techBundle.Price}");
        Logger.Instance.Log("Composite a fost folosit pentru structura pachetului Gamer Tech Bundle.");

        Console.WriteLine("\nApasa orice tasta pentru a inchide aplicatia...");
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
