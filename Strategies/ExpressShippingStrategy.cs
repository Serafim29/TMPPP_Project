public class ExpressShippingStrategy : IShippingStrategy
{
    public double CalculateShippingCost(Order order)
    {
        return 50.0;
    }
}
