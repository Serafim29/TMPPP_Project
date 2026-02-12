public class CashPayment : Payment 
{
    public override void Pay(double amount)
    {
        Console.WriteLine($"Plata cu cash efectuata: {amount} lei");
    }
}
