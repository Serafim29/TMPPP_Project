public class CustomPC : Product
{
    public string CPU { get; set; }
    public string RAM { get; set; }
    public string GPU { get; set; }

    public CustomPC(int id, string name, double price) : base(id, name, price)
    {
    }

    public override string ToString()
    {
        return $"[Custom PC] {Name} (CPU: {CPU}, RAM: {RAM}, GPU: {GPU}) - Lei {Price}";
    }
}
