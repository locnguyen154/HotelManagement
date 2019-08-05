﻿using System.Collections.Generic;
using HotelManagement.Entities.Model;
using HotelManagement.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.Web.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IGenericService<Service> _service;


        public ServiceController(IGenericService<Service> service)
        {
            _service = service;
        }

        [HttpGet]
        public IList<Service> Get()
        {
            return _service.GetAll();
        }
    }
}