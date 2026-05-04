using System.Collections.Generic;

public class ProductIterator : IIterator<Product>
{
    private readonly List<Product> products;
    private int position = 0;

    public ProductIterator(List<Product> products)
    {
        this.products = products;
    }

    public bool HasNext()
    {
        return position < products.Count;
    }

    public Product Next()
    {
        if (HasNext())
        {
            return products[position++];
        }
        return null;
    }
}
