using System.Collections.Generic;

public class ProductCollection : IAggregate<Product>
{
    private readonly List<Product> products = new List<Product>();

    public void AddProduct(Product product)
    {
        products.Add(product);
    }

    public void RemoveProduct(Product product)
    {
        products.Remove(product);
    }

    public IIterator<Product> CreateIterator()
    {
        return new ProductIterator(products);
    }
}
