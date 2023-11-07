import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SlotBooking.css";
import Swal from "sweetalert2";

const SlotBooking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("name")
  );

  const today = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toLocaleTimeString("en-US").slice(0, 5);

  useEffect(() => {
    const savedBookedSlots = JSON.parse(localStorage.getItem("bookedSlotsAll"));
    if (savedBookedSlots) {
      setBookedSlots(savedBookedSlots);
    }
  }, []);

  const handleDateChange = (date) => {
    if (date >= today) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (time) => {
    const selectedDateTime = new Date(selectedDate + "T" + time);
    const currentDateTime = new Date();

    if (selectedDate === today && selectedDateTime <= currentDateTime) {
      setSelectedTime(null);
      Swal.fire("Please select a time that is not in the past");
      // alert('Please select a time that is not in the past.');
    } else {
      setSelectedTime(time);
    }
  };

  const handleBookSlot = () => {
    if (selectedDate && selectedTime) {
      const slot = {
        date: selectedDate,
        time: selectedTime,
        user: loggedInUser,
      };

      const isSlotAlreadyBooked = bookedSlots.some(
        (existingSlot) =>
          existingSlot.date === selectedDate &&
          existingSlot.time === selectedTime
      );

      if (isSlotAlreadyBooked) {
        Swal.fire("This slot is already booked");
      } else {
        setBookedSlots([...bookedSlots, slot]);
        localStorage.setItem(
          "bookedSlotsAll",
          JSON.stringify([...bookedSlots, slot])
        );
        console.log("Before reset:", selectedDate, selectedTime);
        setSelectedDate(null);
        setSelectedTime(null);
        console.log("After reset:", selectedDate, selectedTime);
        
        Swal.fire("Slot booked successfully");
      }
    } else {
      Swal.fire("Please select a date and time");
    }
  };

  const handleCancelBooking = (index) => {
    const updatedBookedSlots = [...bookedSlots];
    const cancelledSlot = updatedBookedSlots[index];

    // Remove from component state
    updatedBookedSlots.splice(index, 1);
    setBookedSlots(updatedBookedSlots);

    // Remove from local storage
    const savedBookedSlots =
      JSON.parse(localStorage.getItem("bookedSlotsAll")) || [];
    const updatedSavedSlots = savedBookedSlots.filter(
      (slot) =>
        !(slot.date === cancelledSlot.date && slot.time === cancelledSlot.time)
    );
    localStorage.setItem("bookedSlotsAll", JSON.stringify(updatedSavedSlots));
  };

  const handleLogout = () => {
    localStorage.removeItem("name");
    setLoggedInUser(null);
    Swal.fire("Logged Out Successfully");
    navigate("/");
  };

  return (
    <div className="container">
      {loggedInUser ? (
        <div className="main">
          <div className="navbar">
            <h1 style={{ color: "#0056b3" }}>Welcome, {loggedInUser}!</h1>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="input-group">
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={today}
              required
            />
          </div>
          {selectedDate && (
            <div className="input-group">
              <label>Select Time:</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                min={selectedDate === today ? currentTime : null}
              />
            </div>
          )}
          <button className="book-button" onClick={handleBookSlot}>
            Book Slot
          </button>
          <div className="booked-slots">
            {bookedSlots.length > 0 && (
              <h2 style={{ color: "#0056b3" }}>Booked Slots</h2>
            )}
          </div>

          <ul className="slot-list">
            {bookedSlots.map((slot, index) => (
              <li key={index}>
                <div className="slot-info">
                  <div className="date-time-info">
                    <strong>Date:</strong> {slot.date}, <strong>Time:</strong>{" "}
                    {slot.time}
                  </div>
                  <div className="slot-actions">
                    {slot.user === loggedInUser && (
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelBooking(index)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <h1>
          Please log in to use the Slot Booking App <Link to="/">Login</Link>
        </h1>
      )}
    </div>
  );
};

export default SlotBooking;
