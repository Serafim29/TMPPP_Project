public class ClothingFactory : ProductFactory
{
    private string _defaultSize;
    private string _defaultMaterial;

    public ClothingFactory(string defaultSize, string defaultMaterial)
    {
        _defaultSize = defaultSize;
        _defaultMaterial = defaultMaterial;
    }

    public override Product CreateProduct(string name, double price)
    {
        return new ClothingProduct(new Random().Next(1000, 9999), name, price, _defaultSize, _defaultMaterial);
    }
}
