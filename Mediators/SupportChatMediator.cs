using System.Collections.Generic;

namespace ECommerceApp.Mediators
{
    public class SupportChatMediator : IChatMediator
    {
        private readonly List<ChatUser> _users = new List<ChatUser>();

        public void RegisterUser(ChatUser user)
        {
            if (!_users.Contains(user))
            {
                _users.Add(user);
            }
        }

        public void SendMessage(string message, ChatUser user)
        {
            foreach (var u in _users)
            {
                
                if (u != user)
                {
                    u.Receive(message);
                }
            }
        }
    }
}
