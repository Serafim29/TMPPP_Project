using System;

public class GiftWrapDecorator : ProductDecorator
{
    private double _wrappingCost = 15.50;

    public GiftWrapDecorator(Product product) : base(product)
    {
    }

    public override double Price 
    { 
        get => base.Price + _wrappingCost; 
    }

    public override void Display(int depth = 0)
    {
        Console.WriteLine(new string('-', depth) + $" [Cadou Împachetat 🎁 (+${_wrappingCost})] " + _product.Name + " ($" + Price + ")");
    }
}
