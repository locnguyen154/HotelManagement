﻿using System;
using System.Collections.Generic;

namespace HotelManagement.Repository.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        IList<T> GetAll();

        T Get(int id);

        void Add(T obj);

        void Update(T obj);

        void Delete(int id);

        void Save();

        int GetMaxId(Func<T, int> columnSelector);
    }
}
