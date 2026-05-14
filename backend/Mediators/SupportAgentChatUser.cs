namespace ECommerceApp.Mediators
{
    public class SupportAgentChatUser : ChatUser
    {
        public SupportAgentChatUser(IChatMediator mediator, string name) : base(mediator, name) { }

        public override void Send(string message)
        {
            System.Console.WriteLine($"[Agent Support {Name}] trimite: {message}");
            _mediator.SendMessage(message, this);
        }

        public override void Receive(string message)
        {
            System.Console.WriteLine($"[Agent Support {Name}] a primit mesajul: {message}");
        }
    }
}
