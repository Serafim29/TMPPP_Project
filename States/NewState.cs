namespace ECommerceApp.States
{
    public class NewState : IOrderState
    {
        public void Pay(OrderContext context)
        {
            System.Console.WriteLine("Plata a fost procesata cu succes.");
            context.SetState(new PaidState());
        }

        public void Ship(OrderContext context)
        {
            System.Console.WriteLine("Eroare: Nu puteti expedia o comanda neplatita.");
        }

        public void Cancel(OrderContext context)
        {
            System.Console.WriteLine("Comanda a fost anulata.");
        }

        public string GetStatus() => "Noua (In Asteptare)";
    }
}
