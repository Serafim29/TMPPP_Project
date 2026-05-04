public class AddToCartCommand : ICommand
{
    private readonly ShoppingCart cart;
    private readonly Product product;

    public AddToCartCommand(ShoppingCart cart, Product product)
    {
        this.cart = cart;
        this.product = product;
    }

    public void Execute()
    {
        cart.Add(product);
    }

    public void Undo()
    {
        cart.Remove(product);
    }
}
