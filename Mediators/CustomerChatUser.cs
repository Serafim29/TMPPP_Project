namespace ECommerceApp.Mediators
{
    public class CustomerChatUser : ChatUser
    {
        public CustomerChatUser(IChatMediator mediator, string name) : base(mediator, name) { }

        public override void Send(string message)
        {
            System.Console.WriteLine($"[Client {Name}] trimite: {message}");
            _mediator.SendMessage(message, this);
        }

        public override void Receive(string message)
        {
            System.Console.WriteLine($"[Client {Name}] a primit mesajul: {message}");
        }
    }
}
