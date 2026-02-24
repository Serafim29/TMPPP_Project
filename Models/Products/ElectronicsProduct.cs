public class ElectronicsProduct : Product
{
    public int WarrantyPeriod { get; private set; }

    public ElectronicsProduct(int id, string name, double price, int warrantyPeriod)
        : base(id, name, price)
    {
        WarrantyPeriod = warrantyPeriod;
    }

    public override string ToString()
    {
        return $"[Electronics] {Name} (Warranty: {WarrantyPeriod} months) - Lei {Price}";
    }
}
