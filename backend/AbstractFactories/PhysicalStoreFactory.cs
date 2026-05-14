public class PhysicalStoreFactory : IShoppingFactory
{
    private string _storeLocation;

    public PhysicalStoreFactory(string storeLocation)
    {
        _storeLocation = storeLocation;
    }

    public Order CreateOrder()
    {
        return new StoreOrder(_storeLocation);
    }

    public IPaymentMethod CreatePaymentMethod()
    {
        return new CashPayment();
    }
}
