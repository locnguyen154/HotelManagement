﻿using HotelManagement.Entities.Model;
using System.Collections.Generic;

namespace HotelManagement.Services.Interfaces
{
    public interface IClientService
    {
        IList<Client> GetAll();

        IList<Client> Get(string roomName);

        Client Get(int id);

        void Update(Client client);
    }
}
