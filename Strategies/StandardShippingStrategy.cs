public class StandardShippingStrategy : IShippingStrategy
{
    public double CalculateShippingCost(Order order)
    {
        return order.TotalPrice() > 500 ? 0 : 15.0;
    }
}
