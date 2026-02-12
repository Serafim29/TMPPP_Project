public class OrderService : IOrderService
{
    private readonly IPaymentMethod paymentMethod;

    public OrderService(IPaymentMethod paymentMethod)
    {
        this.paymentMethod = paymentMethod;
    }

    public void PlaceOrder(Order order)
    {
        double total = order.TotalPrice();
        paymentMethod.Pay(total);
    }
}
