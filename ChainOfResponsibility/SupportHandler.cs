namespace ECommerceApp.ChainOfResponsibility
{
    public abstract class SupportHandler
    {
        protected SupportHandler _nextHandler;

        public SupportHandler SetNext(SupportHandler handler)
        {
            _nextHandler = handler;
            return handler; 
        }

        public abstract void HandleRequest(string issueType, string description);
    }
}
