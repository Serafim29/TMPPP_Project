namespace ECommerceApp.ChainOfResponsibility
{
    public class Level1Support : SupportHandler
    {
        public override string HandleRequest(string issueType, string description)
        {
            if (issueType == "Basic" || issueType == "Password Reset")
            {
                System.Console.WriteLine($"[Level 1 Support] a rezolvat problema: {description}");
                return "Level 1 Support";
            }
            else if (_nextHandler != null)
            {
                System.Console.WriteLine($"[Level 1 Support] paseaza problema '{description}' la nivelul urmator.");
                return _nextHandler.HandleRequest(issueType, description);
            }
            return "Unresolved";
        }
    }
}
