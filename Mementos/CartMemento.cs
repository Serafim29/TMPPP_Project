using System.Collections.Generic;

public class CartMemento
{
    public List<Product> Products { get; }

    public CartMemento(List<Product> products)
    {
        // Creăm o copie a listei pentru a păstra starea intactă
        Products = new List<Product>(products);
    }
}
