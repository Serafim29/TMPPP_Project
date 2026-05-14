public class ElectronicsFactory : ProductFactory
{
    private int _defaultWarranty;

    public ElectronicsFactory(int defaultWarranty)
    {
        _defaultWarranty = defaultWarranty;
    }

    public override Product CreateProduct(string name, double price)
    {
        return new ElectronicsProduct(new Random().Next(1000, 9999), name, price, _defaultWarranty);
    }
}
