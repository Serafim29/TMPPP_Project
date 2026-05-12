namespace ECommerceApp.Mediators
{
    public abstract class ChatUser
    {
        protected IChatMediator _mediator;
        public string Name { get; protected set; }

        public ChatUser(IChatMediator mediator, string name)
        {
            _mediator = mediator;
            Name = name;
        }

        public abstract void Send(string message);
        public abstract void Receive(string message);
    }
}
