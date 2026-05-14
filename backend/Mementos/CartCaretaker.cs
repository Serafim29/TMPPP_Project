using System.Collections.Generic;

public class CartCaretaker
{
    private readonly Stack<CartMemento> history = new Stack<CartMemento>();
    private readonly ShoppingCart cart;

    public CartCaretaker(ShoppingCart cart)
    {
        this.cart = cart;
    }

    public void Backup()
    {
        history.Push(cart.Save());
    }

    public void Undo()
    {
        if (history.Count == 0)
        {
            return;
        }

        CartMemento memento = history.Pop();
        cart.Restore(memento);
    }
}
