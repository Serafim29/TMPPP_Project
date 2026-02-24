public class StoreOrder : Order
{
    public string StoreLocation { get; private set; }

    public StoreOrder(string storeLocation)
    {
        StoreLocation = storeLocation;
    }

    public override string ToString()
    {
        return $"Store Order (Pickup at: {StoreLocation}) - Total: Lei {TotalPrice()}";
    }
}
