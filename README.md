# Room Booking System

A modern, fast, and clean solution for managing room reservations with ease. Built using **Next.js**, **Tailwind CSS**, and **NextUI**, this system provides an efficient and streamlined platform for room booking and management.

---

## Features

### User-Focused Functionality
- **Room Booking**: Users can book rooms easily using a simple and intuitive interface.
- **Room Status Screens**:
- Interactive screens outside each room display their current status (Busy/Free).
- Show real-time availability and the duration of bookings.
- Allow users to book the room directly from the screen.
- Can be displayed on any device by accessing the URL `/display/[room_number]` (e.g., `localhost:3000/display/4516`).

### Admin Dashboard
- **Room Management**:
- Add, edit, or delete room configurations.
- Monitor bookings and adjust schedules in real-time.
- **Streamlined User Experience**: The dashboard is designed to be clean, organized, and intuitive.

---

## Tech Stack
- **[Next.js](https://nextjs.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[NextUI](https://nextui.org/)**

---

## Installation

1. Clone the repository:
 ```bash
 git clone https://github.com/JakeDucati/room-booking-system.git
 ```
2. Install dependencies:
 ```bash
 npm i
 ```
3. Run the development server:
 ```bash
 npm run dev
 ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser for testing.

---

## Customization

To configure the system for your needs:
1. **Room Configuration**: Use the admin dashboard to add or modify room details.
2. **Environment Variables**: Update any required variables in the `.env.local` file.

---

## License

This project is licensed under the [MIT License](LICENSE).
