using System;

public abstract class ProductDecorator : Product
{
    protected Product _product;

    public ProductDecorator(Product product) : base(product.Id, product.Name, product.Price)
    {
        _product = product;
    }

    public override double Price 
    { 
        get => _product.Price; 
        set => _product.Price = value; 
    }

    public override void Display(int depth = 0)
    {
        _product.Display(depth);
    }
}
