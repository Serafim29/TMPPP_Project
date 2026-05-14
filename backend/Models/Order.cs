using System.Collections.Generic;
using System.Linq;

public class Order
{
    private readonly List<Product> products = new();

    private IShippingStrategy shippingStrategy;

    private readonly List<IOrderObserver> observers = new();
    private string status;

    public string Status
    {
        get => status;
        set
        {
            status = value;
            Notify();
        }
    }

    public void AddProduct(Product product)
    {
        products.Add(product);
    }

    public virtual double TotalPrice()
    {
        return products.Sum(p => p.Price);
    }

    public void SetShippingStrategy(IShippingStrategy strategy)
    {
        shippingStrategy = strategy;
    }

    public double CalculateTotalWithShipping()
    {
        double total = TotalPrice();
        if (shippingStrategy != null)
        {
            total += shippingStrategy.CalculateShippingCost(this);
        }
        return total;
    }

    public void Attach(IOrderObserver observer)
    {
        observers.Add(observer);
    }

    public void Detach(IOrderObserver observer)
    {
        observers.Remove(observer);
    }

    private void Notify()
    {
        foreach (var observer in observers)
        {
            observer.Update(this);
        }
    }
}
