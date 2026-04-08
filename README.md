# 🍨 Food Delivery App 

A modern, full-stack food ordering and delivery platform built with a focus on performance, scalability, and seamless user experience.

This project is implemented as a **Monorepo**, containing both the frontend and backend services in a single repository for easier development and deployment.

---

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
  <img src="/apps/web/public/cart.jpg" width="100%" height="200px" alt="Screen 1"/>
  <img src="/apps/web/public/deli.jpg" width="100%" height="200px" alt="Screen2"/>
  <img src="/apps/web/public/history.jpg" width="100%" height="200px" alt="Scree 3"/>
  <img src="/apps/web/public/swager.jpg" width="100%" height="200px" alt="Screen4"/>

</div>


## Key Features

- **Infinite Scroll & Pagination:** Optimized product loading in batches to ensure high performance and smooth UI.
- **Monorepo Architecture:** Clear separation of concerns between Client and Server.
- **Dynamic Product Filtering:** Filter items by category (Main Dishes, Desserts, Drinks) and shop rating.
- **Real-time Order History:** Search orders by email and phone with the ability to **Reorder** previous items.
- **Responsive Design:** Fully adapted for Desktop, Tablet, and Mobile devices.
- **Database Seeding:** Automated generation of 250+ realistic products and reviews using Faker/loremflickr.
- **Swager Documentation:** Implement automatic generation of API documentation to simplify and streamline testing.

---

##  Technology Stack

### Frontend (Client)

* **React 19** & **Vite** : Fast UI rendering and modern build tool.
* **Redux Toolkit & RTK Query** : Advanced state management and efficient API data fetching/caching.
* **Material UI (MUI)** : Component library for a polished, professional look.
* **React Hook Form & Yup** : Robust form handling and client-side validation.
* **TypeScript** : For type-safe and reliable code.

### Backend (Server)

* **NestJS** : Progressive Node.js framework for scalable server-side applications.
* **PostgreSQL** : Powerful relational database for reliable data storage.
* **Prisma ORM** : Type-safe database client and migration tool.
* **Swagger API** : Automated API documentation.
* **Faker.js** : For generating high-quality seed data.

---

##  Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd delivery-app

# Install server dependencies
cd apps/server
npm install

# Install web dependencies
cd ../web
npm install