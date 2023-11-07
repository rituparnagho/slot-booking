import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SlotBooking.css";
import Swal from "sweetalert2";

const SlotBooking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
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

  const handleStartTimeChange = (time) => {
    const selectedDateTime = new Date(selectedDate + "T" + time);
    const currentDateTime = new Date();

    if (selectedDate === today && selectedDateTime <= currentDateTime) {
      setSelectedStartTime(null);
      Swal.fire("Please select a time that is not in the past");
      // alert('Please select a time that is not in the past.');
    } else {
      setSelectedStartTime(time);
    }
  };

  const handleEndTimeChange = (time) => {
    const startDateTime = new Date(selectedDate + "T" + selectedStartTime);
    const endDateTime = new Date(selectedDate + "T" + time);

    const timeDifferenceInMinutes = (endDateTime - startDateTime) / (1000 * 60);

    if (timeDifferenceInMinutes >= 120) {
      // 120 minutes = 2 hours
      setSelectedEndTime(time);
    } else {
      Swal.fire(
        "The minimum time difference between start and end time is 2 hours"
      );
    }
  };

  const handleBookSlot = () => {
    if (selectedDate && selectedStartTime && selectedEndTime) {
      const slot = {
        date: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        user: loggedInUser,
      };

      const isSlotAlreadyBooked = bookedSlots.some(
        (existingSlot) =>
          existingSlot.date === selectedDate &&
          existingSlot.startTime === selectedStartTime &&
          existingSlot.endTime === selectedEndTime
      );

      if (isSlotAlreadyBooked) {
        Swal.fire("This slot is already booked");
      } else {
        setBookedSlots([...bookedSlots, slot]);
        localStorage.setItem(
          "bookedSlotsAll",
          JSON.stringify([...bookedSlots, slot])
        );
        setSelectedDate(null);
        setSelectedStartTime(null);
        setSelectedEndTime(null);
        Swal.fire("Slot booked successfully");
      }
    } else {
      Swal.fire("Please select a date, start time, and end time");
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
              <label>Select Start Time:</label>
              <input
                type="time"
                value={selectedStartTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                min={selectedDate === today ? currentTime : null}
              />
            </div>
          )}
          {selectedDate && selectedStartTime && (
            <div className="input-group">
              <label>Select End Time:</label>
              <input
                type="time"
                value={selectedEndTime}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                min={selectedDate === today ? selectedStartTime : null}
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
                    <strong>Date:</strong> {slot.date},{" "}
                    <strong>Start Time:</strong> {slot.startTime},{" "}
                    <strong>End Time:</strong> {slot.endTime},{" "}
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
