using System;
using System.Collections.Generic;
using System.Linq;

public class ProductBundle : Product
{
    private List<Product> _products = new List<Product>();

    public ProductBundle(int id, string name) : base(id, name, 0)
    {
    }

    public void AddProduct(Product product)
    {
        _products.Add(product);
    }

    public void RemoveProduct(Product product)
    {
        _products.Remove(product);
    }

    public override double Price
    {
        get { return _products.Sum(p => p.Price); }
        set { /* Pretul bundle-ului este derivat doar din produsele continute */ }
    }

    public override void Display(int depth = 0)
    {
        Console.WriteLine(new string('-', depth) + "+ Bundle: " + Name + " (Total: $" + Price + ")");
        foreach (var product in _products)
        {
            product.Display(depth + 2);
        }
    }
}
