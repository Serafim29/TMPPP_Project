namespace ECommerceApp.Mediators
{
    public interface IChatMediator
    {
        void SendMessage(string message, ChatUser user);
        void RegisterUser(ChatUser user);
    }
}
