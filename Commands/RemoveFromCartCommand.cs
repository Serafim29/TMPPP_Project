public class RemoveFromCartCommand : ICommand
{
    private readonly ShoppingCart cart;
    private readonly Product product;

    public RemoveFromCartCommand(ShoppingCart cart, Product product)
    {
        this.cart = cart;
        this.product = product;
    }

    public void Execute()
    {
        cart.Remove(product);
    }

    public void Undo()
    {
        cart.Add(product);
    }
}
