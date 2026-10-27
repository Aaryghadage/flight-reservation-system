import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Flights from './pages/Flights';
import FlightDetails from './pages/FlightDetails';
import PassengerDetails from './pages/PassengerDetails';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import storageService from './services/storageService';
import ScrollToTop from './components/ScrollToTop';

/* ScrollToTop component scrolls to top on route change */

function App() {
  useEffect(() => {
    storageService.seedData();
  }, []);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flight-details/:id" element={<FlightDetails />} />
        <Route path="/passenger-details" element={<PassengerDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/booking-details/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
