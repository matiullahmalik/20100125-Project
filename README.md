# Bicycle Rental and Management System

## 1. Introduction

Green Wheels is a small local business that rents bicycles to customers. This
project replaces their old paper record books with an electronic information
system, so staff can manage the bicycle fleet digitally instead of by hand.

This repository contains a **proof-of-concept** implementation of one module
from the complete system: **Bike Management**. It allows staff to add,
view, update, and delete bikes, search and sort the fleet, track who
currently has each bike, and see a quick summary report — all through a
web page that talks to a backend API and never needs to reload.

## 2. The Complete Information System (Description)

A full Green Wheels system would eventually include these modules:

- **Bike Management** — track every bike, its details and its status.
- **Customer Management** — store customer details and rental history.
- **Rental Management** — record bikes being rented out and returned,
  calculate rental cost based on daily/weekly rate and duration.
- **Maintenance Management** — log services/repairs and automatically
  update a bike's status to "Maintenance".
- **Staff Management** — manage staff accounts and permissions.
- **Reports** — business-wide reports (revenue, most-rented bikes,
  customer activity, maintenance costs, etc.).

Only **Bike Management** is implemented in this proof-of-concept, as required
by the assignment brief.


**🔗 Live Demo:** http://34.51.222.210:8080/


## 3. Features

- **Add a new bike** with its number, type, brand, colour, daily rate,
  weekly rate, status and the person currently holding it (if any)
- **View all bikes** as a card grid, with a color-coded status badge
  (green = Available, blue = Rented, orange = Maintenance)
- **Click any bike card** to open a detail popup showing that bike's
  complete information
- **Edit a bike's** details at any time
- **Delete a retired bike**
- **Search** the fleet by bike number, brand, type, status, or person's name
- **Sort** the fleet by type, brand, daily rate, weekly rate, or status
- **Validation** on every field (e.g. bike number must be unique, rates
  must be greater than zero), with clear error messages
- **Fleet Summary report** showing total bikes, available, rented, and
  under-maintenance counts
- Every backend response is **pure JSON** — never HTML — and the page
  **never reloads**, since all communication uses the Fetch API

## 4. Technologies Used

| Layer     | Technology
| Frontend  | HTML, CSS, Vanilla JavaScript (Fetch API) 
| Backend   | Node.js, Express.js                  
| Database  | MongoDB with Mongoose                
| Testing   | Jest, Supertest                      

## 5. Database Schema (Bike)

| Field           | Type   | Rules                                             
| bikeNumber      | String | Required, unique                                   
| bikeType        | String | Required                                            
| brand           | String | Required                                            
| colour          | String | Optional (defaults to "Not specified")              
| dailyRate       | Number | Required, must be greater than 0 (in euros)         
| weeklyRate      | Number | Required, must be greater than 0 (in euros)         
| status          | String | Required, one of: Available, Rented, Maintenance    
| personName      | String | Optional. The renter's name, or who dropped it off for maintenance 
| lastServiceDate | Date   | Optional (defaults to the current date)             

## 6. API Documentation

Base URL: `http://localhost:5000/api/bikes`


| Method | Endpoint                 | Description                              |
| GET    | /api/bikes               | Get all bikes (supports `?search=` and `?sortBy=`) 
| GET    | /api/bikes/:id           | Get a single bike by its id               
| POST   | /api/bikes               | Create a new bike                         
| PUT    | /api/bikes/:id           | Update an existing bike                   
| DELETE | /api/bikes/:id           | Delete a bike                             
| GET    | /api/bikes/report/summary   Get total/available/rented/maintenance counts 


## 7. Resources Used

This project was built with a mix of self-learning and outside help,
listed here for transparency:

- **Frontend (HTML, CSS, JavaScript):** I learned the fundamentals from
  [W3Schools](https://www.w3schools.com/), then built the entire frontend
  for this project myself from scratch using what I learned there.
- **Backend (Node.js, Express, MongoDB, Mongoose):** I first followed a
  tutorial on YouTube(https://www.youtube.com/watch?v=p0dCi5D6gDI&list=PLbtI3_MArDOkXRLxdMt1NOMtCS-84ibHH&index=23) to understand how a Node.js/Express/MongoDB backend
  is structured, and then got help from a friend of mine, who is a backend
  developer, while writing the backend code for this project.
- **MongoDB installation issue:** while installing MongoDB on my computer,
  I ran into a connection error. I got help resolving it from ChatGPT —
  the full conversation can be viewed here:
  https://chatgpt.com/c/6a550f15-5b0c-83eb-9f43-83d6f7531bc1

