public class OnlineOrder : Order
{
    public double ShippingCost { get; private set; }

    public OnlineOrder(double shippingCost)
    {
        ShippingCost = shippingCost;
    }

    public override double TotalPrice()
    {
        return base.TotalPrice() + ShippingCost;
    }

    public override string ToString()
    {
        return $"Online Order (Shipping: Lei {ShippingCost}) - Total: Lei {TotalPrice()}";
    }
}
