public class CardPayment : Payment     
{
    public override void Pay(double amount)
    {
        Console.WriteLine($"Plata cu cardul efectuata: {amount} lei");
    }
}
