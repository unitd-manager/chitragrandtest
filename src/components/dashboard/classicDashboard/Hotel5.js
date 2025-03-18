import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Container, Row, Col, Card, Table, Input } from "reactstrap";
import api from "../../../constants/api";

const HotelDashboard3 = ({ bookingCartId }) => {
  const [roomDetails, setRoomDetails] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    address_country: "",
    checkInTime: "",
    confirmed: false,
  });

  // Fetch room details based on bookingCartId
  useEffect(() => {
    if (bookingCartId) {
      api
        .post("/bookingcart/get-room-details", { booking_cart_id: bookingCartId })
        .then((res) => {
          if (Array.isArray(res.data.data)) {
            setRoomDetails(res.data.data);
          } else if (res.data.data) {
            setRoomDetails([res.data.data]);
          } else {
            setRoomDetails([]);
            console.error("Unexpected response format:", res.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching room details:", err);
          setRoomDetails([]);
        });
    }
  }, [bookingCartId]);

  // Handle input change
  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // Confirm Check-in
  const confirmCheckin = () => {
    if (!bookingCartId || !customer.name || !customer.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    api
      .post("/bookingcart/confirm-checkin", {
        booking_cart_id: bookingCartId,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        email: customer.email,
        city: customer.city,
        address_country: customer.address_country,
        check_in_time: customer.checkInTime,
      })
      .then((res) => {
        console.log("Check-in Response:", res.data);
        if (res.data.booking_id) {
          setBookingId(res.data.booking_id);
          setCustomer((prev) => ({ ...prev, confirmed: true }));
        }
      })
      .catch((err) => {
        console.error("Error confirming check-in:", err);
      });
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md="6">
          <Card className="shadow p-3 h-100">
            <h5 className="mb-3 text-center">Room Availability</h5>
            <Table bordered className="text-center">
              <thead style={{ backgroundColor: "#87CEFA", color: "red" }}>
                <tr>
                  <th>Room Type</th>
                  <th>Room Numbers</th>
                </tr>
              </thead>
              <tbody>
                {roomDetails.map((room) => (
                  <tr key={room.booking_cart_id}>
                    <td className="fw-bold">{room.room_type}</td>
                    <td>{room.room_number}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {customer.confirmed && (
            <Card className="shadow p-3 mt-3 text-center">
              <h5 className="text-success fw-bold">✅ Check-in Confirmed!</h5>
              <p>Booking ID: {bookingId}</p>
            </Card>
          )}
        </Col>

        <Col md="6">
          <Card className="shadow p-3 h-100">
            <h5 className="mb-3 text-center">Customer Details</h5>

            <Input type="text" name="name" placeholder="Full Name" className="mb-2" value={customer.name} onChange={handleInputChange} />
            <Input type="text" name="address" placeholder="Address" className="mb-2" value={customer.address} onChange={handleInputChange} />

            <Row>
              <Col md="6">
                <Input type="text" name="phone" placeholder="Phone Number" className="mb-2" value={customer.phone} onChange={handleInputChange} />
              </Col>
              <Col md="6">
                <Input type="email" name="email" placeholder="Email" className="mb-2" value={customer.email} onChange={handleInputChange} />
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <Input type="text" name="address_country" placeholder="Country" className="mb-2" value={customer.address_country} onChange={handleInputChange} />
              </Col>
              <Col md="6">
                <Input type="text" name="city" placeholder="City" className="mb-2" value={customer.city} onChange={handleInputChange} />
              </Col>
            </Row>

            <Input type="time" name="checkInTime" className="mb-3" value={customer.checkInTime} onChange={handleInputChange} />

            <Button
              style={{ backgroundColor: "#87CEFA", borderColor: "#87CEFA", color: "red" }}
              className="w-100"
              onClick={confirmCheckin}
            >
              Confirm Check-in
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

HotelDashboard3.propTypes = {
  bookingCartId: PropTypes.string.isRequired,
};

export default HotelDashboard3;
