using System;
using System.Collections.Generic;
using ECommerceApp.ChainOfResponsibility;
using ECommerceApp.States;
using ECommerceApp.Mediators;
using ECommerceApp.TemplateMethod;
using ECommerceApp.Visitors;

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
        StripePaymentAPI stripeApi = new StripePaymentAPI();
        IPaymentMethod stripeAdapter = new StripePaymentAdapter(stripeApi);
        stripeAdapter.Pay(1250); 
        
        Console.WriteLine("\n--- 6. BRIDGE ---");
        INotificationSender emailSender = new EmailSender();
        INotificationSender smsSender = new SmsSender();

        Notification emailNotification = new OrderNotification(emailSender);
        emailNotification.Notify("Comanda #102 a fost confirmata.");

        Notification smsNotification = new OrderNotification(smsSender);
        smsNotification.Notify("Comanda #103 a fost expediata.");

        Console.WriteLine("\n--- 7. FACADE ---");
        ECommerceFacade facade = new ECommerceFacade();
        List<Product> productsToOrder = new List<Product> { laptop, tshirt };
        
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

        Console.WriteLine("\n=== LABORATORUL 5: Paternuri Structurale ===");

        Console.WriteLine("\n--- 9. FLYWEIGHT ---");
        CategoryFactory categoryFactory = new CategoryFactory();
        
        Product p1 = new Product(101, "Laptop ZenBook", 4500);
        p1.Category = categoryFactory.GetCategory("Electronice");
        
        Product p2 = new Product(102, "Mouse Wireless", 150);
        p2.Category = categoryFactory.GetCategory("Electronice"); 
        
        Product p3 = new Product(103, "Tricou Polo", 90);
        p3.Category = categoryFactory.GetCategory("Imbracaminte");
        
        p1.Display();
        p2.Display();
        p3.Display();
        Console.WriteLine($"Total categorii unice in memorie: {categoryFactory.GetTotalCategoriesCreated()}");

        Console.WriteLine("\n--- 10. DECORATOR ---");
        ProductDecorator giftWrappedLaptop = new GiftWrapDecorator(p1);
        Console.WriteLine("Inainte de decorare:");
        p1.Display();
        Console.WriteLine("Dupa adaugarea optiunii de impachetare cadou (Decorator):");
        giftWrappedLaptop.Display();

        Console.WriteLine("\n--- 11. PROXY ---");
        IDiscountService proxyService = new DiscountProxy("UserNormal");
        Console.WriteLine("Client normal incearca codul VIP20:");
        double price1 = proxyService.ApplyDiscount(giftWrappedLaptop.Price, "VIP20");
        Console.WriteLine($"Pret rezultat: {price1}");

        Console.WriteLine("\nAdmin incearca codul VIP20:");
        IDiscountService adminProxyService = new DiscountProxy("Admin");
        double price2 = adminProxyService.ApplyDiscount(giftWrappedLaptop.Price, "VIP20");
        Console.WriteLine($"Pret rezultat: {price2}");

        Console.WriteLine("\n--- 12. BRIDGE (Media Player din Lab 5) ---");
        IMediaDevice phone = new PhoneDevice();
        IMediaDevice tv = new TVDevice();

        MediaFile audioOnPhone = new AudioMedia("Podcast_Tech.mp3", phone);
        audioOnPhone.Render();

        MediaFile videoOnTv = new VideoMedia("Review_Laptop.mp4", tv);
        videoOnTv.Render();

        Console.WriteLine("\n=== LABORATORUL 6: Paternuri Comportamentale ===");

        Console.WriteLine("\n--- 13. STRATEGY ---");
        Order strategyOrder = new Order();
        strategyOrder.AddProduct(laptop);
        
        Console.WriteLine("Livrare Standard:");
        strategyOrder.SetShippingStrategy(new StandardShippingStrategy());
        Console.WriteLine($"Cost total (cu livrare): {strategyOrder.CalculateTotalWithShipping()}");

        Console.WriteLine("Livrare Express:");
        strategyOrder.SetShippingStrategy(new ExpressShippingStrategy());
        Console.WriteLine($"Cost total (cu livrare): {strategyOrder.CalculateTotalWithShipping()}");

        Console.WriteLine("\n--- 14. OBSERVER ---");
        Order observedOrder = new Order();
        observedOrder.SetShippingStrategy(new StandardShippingStrategy());
        observedOrder.AddProduct(tshirt);

        IOrderObserver customerObs = new CustomerNotifier("client@email.com");
        IOrderObserver adminObs = new StoreAdminNotifier();

        observedOrder.Attach(customerObs);
        observedOrder.Attach(adminObs);

        Console.WriteLine("Schimbare status in Procesare...");
        observedOrder.Status = "Procesare";
        
        Console.WriteLine("Schimbare status in Expediat...");
        observedOrder.Status = "Expediat";

        Console.WriteLine("\n--- 15. COMMAND & 16. MEMENTO ---");
        ShoppingCart cart = new ShoppingCart();
        ShoppingCartInvoker invoker = new ShoppingCartInvoker();
        CartCaretaker caretaker = new CartCaretaker(cart);

        Console.WriteLine("Adaugare Laptop in cos...");
        ICommand addLaptop = new AddToCartCommand(cart, laptop);
        invoker.ExecuteCommand(addLaptop);
        
        Console.WriteLine("Adaugare Mouse in cos...");
        ICommand addMouse = new AddToCartCommand(cart, mouse);
        invoker.ExecuteCommand(addMouse);
        
        Console.WriteLine($"Total cos: {cart.GetTotal()}");

        Console.WriteLine("Salvam starea cosului (Memento)...");
        caretaker.Backup();

        Console.WriteLine("Adaugam Tastatura in cos...");
        ICommand addKeyboard = new AddToCartCommand(cart, keyboard);
        invoker.ExecuteCommand(addKeyboard);
        Console.WriteLine($"Total cos dupa tastatura: {cart.GetTotal()}");

        Console.WriteLine("Undo ultima comanda (Command Undo - eliminam tastatura)...");
        invoker.UndoLastCommand();
        Console.WriteLine($"Total cos dupa Undo: {cart.GetTotal()}");

        Console.WriteLine("Golim cosul (Simulare stergere accidentala)...");
        cart.Remove(laptop);
        cart.Remove(mouse);
        Console.WriteLine($"Total cos dupa golire: {cart.GetTotal()}");

        Console.WriteLine("Restaurare cos din salvarea anterioara (Memento)...");
        caretaker.Undo();
        Console.WriteLine($"Total cos dupa restaurare: {cart.GetTotal()}");

        Console.WriteLine("\n--- 17. ITERATOR ---");
        ProductCollection collection = new ProductCollection();
        collection.AddProduct(laptop);
        collection.AddProduct(mouse);
        collection.AddProduct(keyboard);

        Console.WriteLine("Parcurgere produse din colectie folosind Iterator:");
        IIterator<Product> iterator = collection.CreateIterator();
        while (iterator.HasNext())
        {
            Product p = iterator.Next();
            Console.WriteLine($"- {p.Name} (${p.Price})");
        }

        Console.WriteLine("\n=== LABORATORUL 7: Paternuri Comportamentale (Partea 2) ===");

        Console.WriteLine("\n--- 18. CHAIN OF RESPONSIBILITY ---");
        SupportHandler level1 = new Level1Support();
        SupportHandler level2 = new Level2Support();
        SupportHandler level3 = new Level3Support();
        
        level1.SetNext(level2).SetNext(level3);
        
        level1.HandleRequest("Basic", "Am uitat parola");
        level1.HandleRequest("Technical", "Eroare la procesarea platii pe site");
        level1.HandleRequest("Critical", "Serverul a picat, site-ul este indisponibil");
        level1.HandleRequest("Unknown", "Vreau sa schimb culoarea butonului in mov");

        Console.WriteLine("\n--- 19. STATE ---");
        OrderContext statefulOrder = new OrderContext();
        statefulOrder.Ship(); // Eroare, nu e platita
        statefulOrder.Pay();  // Trece in Platita
        statefulOrder.Pay();  // Deja platita
        statefulOrder.Ship(); // Trece in Expediata
        statefulOrder.Cancel(); // Eroare, deja expediata

        Console.WriteLine("\n--- 20. MEDIATOR ---");
        IChatMediator chatMediator = new SupportChatMediator();
        ChatUser customer = new CustomerChatUser(chatMediator, "Ionut");
        ChatUser agent = new SupportAgentChatUser(chatMediator, "Agent Vasile");
        
        chatMediator.RegisterUser(customer);
        chatMediator.RegisterUser(agent);
        
        customer.Send("Salut, am o problema cu comanda #105.");
        agent.Send("Buna ziua, Ionut! Imediat verificam statusul.");

        Console.WriteLine("\n--- 21. TEMPLATE METHOD ---");
        ReportGenerator salesReport = new SalesReportGenerator();
        salesReport.GenerateReport();
        
        Console.WriteLine();
        ReportGenerator inventoryReport = new InventoryReportGenerator();
        inventoryReport.GenerateReport();

        Console.WriteLine("\n--- 22. VISITOR ---");
        Product pGeneric = new Product(701, "Cablu HDMI", 25);
        ElectronicsProduct pElectro = new ElectronicsProduct(702, "Monitor 4K", 1500, 24);
        ClothingProduct pClothing = new ClothingProduct(703, "Geaca Iarna", 350, "XL", "Fleece");

        IProductVisitor taxVisitor = new TaxVisitor();
        IProductVisitor exportVisitor = new ExportVisitor();

        Console.WriteLine("--- Calculare Taxe (Visitor) ---");
        pGeneric.Accept(taxVisitor);
        pElectro.Accept(taxVisitor);
        pClothing.Accept(taxVisitor);

        Console.WriteLine("--- Export Date (Visitor) ---");
        pGeneric.Accept(exportVisitor);
        pElectro.Accept(exportVisitor);
        pClothing.Accept(exportVisitor);


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
