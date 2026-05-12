namespace ECommerceApp.States
{
    public class OrderContext
    {
        private IOrderState _state;

        public OrderContext()
        {
            _state = new NewState(); // Initial state
        }

        public void SetState(IOrderState state)
        {
            _state = state;
            System.Console.WriteLine($"[State] Starea comenzii a fost schimbata in: {_state.GetStatus()}");
        }

        public void Pay()
        {
            _state.Pay(this);
        }

        public void Ship()
        {
            _state.Ship(this);
        }

        public void Cancel()
        {
            _state.Cancel(this);
        }

        public string CurrentStatus => _state.GetStatus();
    }
}
