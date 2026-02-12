public class Customer : User        
{
    public Customer(string name, string email) : base(name, email) { }

    public override void DisplayRole()
    {
        Console.WriteLine("Rol: Client");
    }
}
