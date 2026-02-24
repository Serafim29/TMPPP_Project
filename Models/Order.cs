using System.Collections.Generic;
using System.Linq;

public class Order
{
    private readonly List<Product> products = new();

    public void AddProduct(Product product)
    {
        products.Add(product);
    }

    public virtual double TotalPrice()
    {
        return products.Sum(p => p.Price);
    }
}
