public class Admin : User       
{
    public Admin(string name, string email) : base(name, email) { }

    public override void DisplayRole()
    {
        Console.WriteLine("Rol: Administrator");
    }
}
