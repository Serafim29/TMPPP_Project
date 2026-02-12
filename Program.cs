class Program
{
    static void Main()
    {
        User customer = new Customer("Ion Popescu", "ion@email.com");
        customer.DisplayRole();

        Product laptop = new Product(1, "Laptop", 4500);
        Product mouse = new Product(2, "Mouse", 150);

        Order order = new Order();
        order.AddProduct(laptop);
        order.AddProduct(mouse);

        IPaymentMethod payment = new CashPayment();
        IOrderService orderService = new OrderService(payment);

        orderService.PlaceOrder(order);

        Console.ReadKey();
    }
}

