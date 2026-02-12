public abstract class User
{
    public string Name { get; protected set; }
    public string Email { get; protected set; }

    protected User(string name, string email)
    {
        Name = name; 
        Email = email;
    }

    public abstract void DisplayRole();
    
}
