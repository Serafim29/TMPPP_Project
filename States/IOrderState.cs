namespace ECommerceApp.States
{
    public interface IOrderState
    {
        void Pay(OrderContext context);
        void Ship(OrderContext context);
        void Cancel(OrderContext context);
        string GetStatus();
    }
}
