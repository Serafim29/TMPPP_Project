using System;

public class Product : IPrototype<Product>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public virtual double Price { get; set; }

    public Product(int id, string name, double price)
    {
        Id = id;
        Name = name;
        Price = price;
    }

    public virtual Product Clone()
    {
        return (Product)this.MemberwiseClone();
    }

    public virtual void Display(int depth = 0)
    {
        Console.WriteLine(new string('-', depth) + " " + Name + " ($" + Price + ")");
    }
}
