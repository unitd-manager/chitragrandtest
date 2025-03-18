import React, { useEffect, useState } from "react";
import { Button, Table, Container, Row, Col, Card, CardBody } from "reactstrap";
import { v4 as uuidv4 } from "uuid";
import api from "../../../constants/api";
import Hotel4 from "./Hotel4"; // Renamed from Hotel4 for clarity

const HotelDashboard = () => {
  const [roomData, setRoomData] = useState([]);
  const [showDashboard2, setShowDashboard2] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [bookingCartId, setBookingCartId] = useState(null);

  useEffect(() => {
    api
      .get("/booking/getRoomDetails")
      .then((res) => {
        setRoomData(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  // Function to handle Check-In
  const handleCheckIn = () => {
    const newSessionId = uuidv4();

    const bookingData = {
      sessionId: newSessionId,
      actionType: "Check-In",
    };

    api
      .post("/bookingcart/addToCart", bookingData)
      .then((res) => {
        if (res.data.success) {
          alert(`Check-In Successful! Booking Cart ID: ${res.data.booking_cart_id}`);

          // Set session details
          setSessionId(newSessionId);
          setActionType("Check-In");
          setBookingCartId(res.data.booking_cart_id);

          setShowDashboard2(true); // Show Hotel4
        } else {
          alert("Failed to Check-In");
        }
      })
      .catch((err) => {
        console.error("Error adding to booking cart:", err);
        alert("Failed to Check-In");
      });
  };

  return (
    <Container className="mt-4">
      {/* Room Details Table */}
      <Card>
        <CardBody>
          <Table bordered responsive>
            <thead className="bg-light">
              <tr>
                <th className="text-center">Room Type</th>
                <th className="text-center">Available</th>
                <th className="text-center">Booked</th>
              </tr>
            </thead>
            <tbody>
              {roomData.length > 0 ? (
                roomData.map((room) => (
                  <tr key={room.roomType}>
                    <td className="text-center">
                      <Button color="danger" size="lg" className="w-100 text-center">
                        {room.room_type}
                      </Button>
                    </td>
                    <td className="text-center align-middle">{room.available_count}</td>
                    <td className="text-center align-middle">{room.booked_count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Buttons */}
      <Row className="mt-4 text-center justify-content-center">
        <Col md="2" className="mb-2">
          <Button color="info" size="lg" className="w-100 text-center" onClick={handleCheckIn}>
            Check In
          </Button>
        </Col>
        {["Check Out", "Reservation", "Cleaning", "Update"].map((btn) => (
          <Col key={btn} md="2" className="mb-2">
            <Button color="info" size="lg" className="w-100 text-center">
              {btn}
            </Button>
          </Col>
        ))}
      </Row>

      {/* Show Hotel4 After Check-In */}
      {showDashboard2 && sessionId && bookingCartId && (
        <Hotel4 sessionId={sessionId} actionType={actionType} bookingCartId={bookingCartId} />
      )}
    </Container>
  );
};

export default HotelDashboard;
