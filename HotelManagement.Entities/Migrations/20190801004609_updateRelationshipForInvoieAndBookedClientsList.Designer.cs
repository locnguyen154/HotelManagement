﻿// <auto-generated />
using System;
using HotelManagement.Entities.DataContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace HotelManagement.Entities.Migrations
{
    [DbContext(typeof(EnlabHotelContext))]
    [Migration("20190801004609_updateRelationshipForInvoieAndBookedClientsList")]
    partial class updateRelationshipForInvoieAndBookedClientsList
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.11-servicing-32099")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("HotelManagement.Entities.Model.BookedClientsList", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("BookType");

                    b.Property<DateTime>("CheckinTime");

                    b.Property<DateTime>("CheckoutTime");

                    b.Property<int>("Code");

                    b.Property<DateTime>("CreatedTime");

                    b.Property<double>("Discount");

                    b.Property<string>("Notes");

                    b.Property<double>("Prepay");

                    b.Property<string>("Status");

                    b.HasKey("Id");

                    b.ToTable("BookedClientsList");
                });

            modelBuilder.Entity("HotelManagement.Entities.Model.Client", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Address");

                    b.Property<int>("BookedClientsListId");

                    b.Property<string>("Email");

                    b.Property<string>("IdentityOrPassport");

                    b.Property<int?>("InvoiceId");

                    b.Property<string>("Name");

                    b.Property<string>("Nationality");

                    b.Property<string>("Notes");

                    b.Property<string>("RoomName");

                    b.HasKey("Id");

                    b.HasIndex("BookedClientsListId")
                        .IsUnique();

                    b.HasIndex("InvoiceId");

                    b.HasIndex("RoomName");

                    b.ToTable("Client");
                });

            modelBuilder.Entity("HotelManagement.Entities.Model.Invoice", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CheckinTime");

                    b.Property<DateTime>("CheckoutTime");

                    b.Property<double>("Discount");

                    b.Property<string>("Notes");

                    b.Property<double>("Prepay");

                    b.Property<int>("RentTime");

                    b.Property<string>("Status");

                    b.Property<double>("TotalPayment");

                    b.Property<double>("TotalRoomMoney");

                    b.Property<double>("TotalServiceMoney");

                    b.HasKey("Id");

                    b.ToTable("Invoice");
                });

            modelBuilder.Entity("HotelManagement.Entities.Model.Room", b =>
                {
                    b.Property<string>("Name")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CheckinTime");

                    b.Property<string>("CheckoutTime");

                    b.Property<string>("Floor");

                    b.Property<double>("Price");

                    b.Property<string>("Status");

                    b.Property<string>("Type");

                    b.HasKey("Name");

                    b.ToTable("Room");
                });

            modelBuilder.Entity("HotelManagement.Entities.Model.Service", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("InvoiceId");

                    b.Property<string>("Name");

                    b.Property<double>("Price");

                    b.Property<int>("Quantity");

                    b.Property<int>("ServiceTypeId");

                    b.Property<double>("TotalMoney");

                    b.HasKey("Id");

                    b.HasIndex("InvoiceId");

                    b.HasIndex("ServiceTypeId");

                    b.ToTable("Service");
                });

            modelBuilder.Entity("HotelManagement.Entities.Model.ServiceType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("ServiceType");
                });

            modelBuilder.Entity("HotelManagement.Entities.Model.Client", b =>
                {
                    b.HasOne("HotelManagement.Entities.Model.BookedClientsList", "BookedClientsList")
                        .WithOne("Client")
                        .HasForeignKey("HotelManagement.Entities.Model.Client", "BookedClientsListId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HotelManagement.Entities.Model.Invoice")
                        .WithMany("Clients")
                        .HasForeignKey("InvoiceId");

                    b.HasOne("HotelManagement.Entities.Model.Room", "Room")
                        .WithMany("Clients")
                        .HasForeignKey("RoomName");
                });

            modelBuilder.Entity("HotelManagement.Entities.Model.Service", b =>
                {
                    b.HasOne("HotelManagement.Entities.Model.Invoice")
                        .WithMany("Services")
                        .HasForeignKey("InvoiceId");

                    b.HasOne("HotelManagement.Entities.Model.ServiceType", "ServiceType")
                        .WithMany()
                        .HasForeignKey("ServiceTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
