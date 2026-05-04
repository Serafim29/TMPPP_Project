using System.Collections.Generic;
using System.Linq;

public class ShoppingCart
{
    private List<Product> products = new List<Product>();

    public void Add(Product product)
    {
        products.Add(product);
    }

    public void Remove(Product product)
    {
        products.Remove(product);
    }

    public List<Product> GetProducts()
    {
        return products;
    }

    public double GetTotal()
    {
        return products.Sum(p => p.Price);
    }

    // Memento: Salvează starea
    public CartMemento Save()
    {
        return new CartMemento(products);
    }

    // Memento: Restaurează starea
    public void Restore(CartMemento memento)
    {
        products = new List<Product>(memento.Products);
    }
}
