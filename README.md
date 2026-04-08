# 🍨 Food Delivery App 

A modern, full-stack food ordering and delivery platform built with a focus on performance, scalability, and seamless user experience.

This project is implemented as a **Monorepo**, containing both the frontend and backend services in a single repository for easier development and deployment.

---

<div style="display: flex; flex-wrap: wrap; gap: 15px;">

  <img src="/apps/web/public/cart.jpg" width="30%" height="150px" alt="Screen 1"/>
  <img src="/apps/web/public/deli.jpg" width="30%" height="150px" alt="Screen2"/>
  <img src="/apps/web/public/history.jpg" width="30%" height="150px" alt="Scree 3"/>
  <img src="/apps/web/public/swager.jpg" width="30%" height="150px" alt="Screen4"/>

</div>


## Key Features

&#8900; **Infinite Scroll & Pagination:** Optimized product loading in batches to ensure high performance and smooth UI.
&#8900; **Monorepo Architecture:** Clear separation of concerns between Client and Server.
&#8900; **Dynamic Product Filtering:** Filter items by category (Main Dishes, Desserts, Drinks) and shop rating.
&#8900; **Real-time Order History:** Search orders by email and phone with the ability to **Reorder** previous items.
&#8900; **Responsive Design:** Fully adapted for Desktop, Tablet, and Mobile devices.
&#8900; **Database Seeding:** Automated generation of 250+ realistic products and reviews using Faker/loremflickr.
&#8900; **Swager Documentation:** Implement automatic generation of API documentation to simplify and streamline testing.

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