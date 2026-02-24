public class ClothingProduct : Product
{
    public string Size { get; private set; }
    public string Material { get; private set; }

    public ClothingProduct(int id, string name, double price, string size, string material)
        : base(id, name, price)
    {
        Size = size;
        Material = material;
    }

    public override string ToString()
    {
        return $"[Clothing] {Name} (Size: {Size}, Material: {Material}) - Lei {Price}";
    }
}
