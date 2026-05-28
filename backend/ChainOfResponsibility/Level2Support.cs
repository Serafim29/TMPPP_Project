namespace ECommerceApp.ChainOfResponsibility
{
    public class Level2Support : SupportHandler
    {
        public override string HandleRequest(string issueType, string description)
        {
            if (issueType == "Technical" || issueType == "Payment Issue")
            {
                System.Console.WriteLine($"[Level 2 Support] a rezolvat problema tehnica: {description}");
                return "Level 2 Support";
            }
            else if (_nextHandler != null)
            {
                System.Console.WriteLine($"[Level 2 Support] paseaza problema '{description}' la nivelul urmator.");
                return _nextHandler.HandleRequest(issueType, description);
            }
            return "Unresolved";
        }
    }
}
