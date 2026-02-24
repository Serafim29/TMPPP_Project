public class OnlineShoppingFactory : IShoppingFactory
{
    private double _shippingCost;

    public OnlineShoppingFactory(double shippingCost)
    {
        _shippingCost = shippingCost;
    }

    public Order CreateOrder()
    {
        return new OnlineOrder(_shippingCost);
    }

    public IPaymentMethod CreatePaymentMethod()
    {
        return new CardPayment();
    }
}
