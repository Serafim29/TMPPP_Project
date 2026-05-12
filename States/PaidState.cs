namespace ECommerceApp.States
{
    public class PaidState : IOrderState
    {
        public void Pay(OrderContext context)
        {
            System.Console.WriteLine("Comanda este deja platita.");
        }

        public void Ship(OrderContext context)
        {
            System.Console.WriteLine("Comanda a fost expediata catre client.");
            context.SetState(new ShippedState());
        }

        public void Cancel(OrderContext context)
        {
            System.Console.WriteLine("Comanda a fost anulata. Se initiaza rambursarea...");
        }

        public string GetStatus() => "Platita";
    }
}
