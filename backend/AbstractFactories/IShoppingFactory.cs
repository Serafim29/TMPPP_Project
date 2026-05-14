public interface IShoppingFactory
{
    Order CreateOrder();
    IPaymentMethod CreatePaymentMethod();
}
