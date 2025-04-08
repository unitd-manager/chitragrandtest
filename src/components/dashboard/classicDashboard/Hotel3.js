import React, { useEffect, useState } from "react";
import { Button, Table, Container, Row, Col, Card, CardBody } from "reactstrap";
import { v4 as uuidv4 } from "uuid";
import api from "../../../constants/api";
import Hotel4 from "./Hotel4";
import CheckOut from "./CheckOut";
import Cleaning from "./Cleaning";
import Reservation from "./Reservation";
import Update from "./Update";

const HotelDashboard = () => {
  const [roomData, setRoomData] = useState([]);
  const [activeComponent, setActiveComponent] = useState(
    localStorage.getItem("activeComponent") || null
  );
  const [selectedButton, setSelectedButton] = useState(
    localStorage.getItem("activeComponent") || null
  );
  const [sessionId, setSessionId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [bookingCartId, setBookingCartId] = useState(null);
  const getRoomDetails = () => {
    api
    .get("/booking/getRoomDetails")
    .then((res) => {
      setRoomData(res.data.data);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    });
  }

  useEffect(() => {
    getRoomDetails()
  }, []);

  // Function to handle Check-In
  const handleCheckIn = () => {
    const newSessionId = uuidv4();
    console.log('newSessionId',newSessionId)

    const bookingData = {
      sessionId: newSessionId,
      actionType: "Check-In",
    };

    api
      .post("/bookingcart/addToCart1", bookingData)
      .then((res) => {
        if (res.data.success) {
          // alert(`Check-In Successful! Booking Cart ID: ${res.data.booking_cart_id}`);

          setSessionId(newSessionId);
          setActionType("Check-In");
          setBookingCartId(res.data.booking_cart_id);

          localStorage.setItem("activeComponent", "Hotel4");
          setActiveComponent("Hotel4");
          setSelectedButton("Hotel4");
        } else {
          alert("Failed to Check-In");
        }
      })
      .catch((err) => {
        console.error("Error adding to booking cart:", err);
        alert("Failed to Check-In");
      });
  };

  // Function to handle button clicks
  const handleComponentChange = (componentName) => {
    localStorage.setItem("activeComponent", componentName);
    setActiveComponent(componentName);
    setSelectedButton(componentName);
  };

  return (
    <Container className="mt-4">
      {/* Room Details Table */}
      <Card className="shadow-lg border-0 rounded-4 bg-dark text-white p-4">
  <CardBody className="text-center">
    <h1 className="mb-3 fw-bold text-uppercase" style={{ fontFamily: "Georgia, serif", letterSpacing: "2px" }}>
      ✨ Welcome To <span style={{ color: "#FFD700" }}>Chitra Grand Hotel</span> ✨
    </h1>
  </CardBody>
</Card>
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

<Card>
   <CardBody>
      {/* Buttons */}
      <Row className="mt-4 text-center justify-content-center">
        <Col md="2" className="mb-2">
          <Button
            color={selectedButton === "Hotel4" ? "success" : "info"}
            size="lg"
            className="w-100 text-center"
            onClick={handleCheckIn}
          >
            Check In
          </Button>
        </Col>
        <Col md="2" className="mb-2">
          <Button
            color={selectedButton === "CheckOut" ? "success" : "info"}
            size="lg"
            className="w-100 text-center"
            onClick={() => handleComponentChange("CheckOut")}
          >
            Check Out
          </Button>
        </Col>
        <Col md="2" className="mb-2">
          <Button
            color={selectedButton === "Cleaning" ? "success" : "info"}
            size="lg"
            className="w-100 text-center"
            onClick={() => handleComponentChange("Cleaning")}
          >
            Cleaning
          </Button>
        </Col>
        <Col md="2" className="mb-2">
          <Button
            color={selectedButton === "Reservation" ? "success" : "info"}
            size="lg"
            className="w-100 text-center"
            onClick={() => handleComponentChange("Reservation")}
          >
            Reservation
          </Button>
        </Col>
        <Col md="2" className="mb-2">
          <Button
            color={selectedButton === "Update" ? "success" : "info"}
            size="lg"
            className="w-100 text-center"
            onClick={() => handleComponentChange("Update")}
          >
            Update
          </Button>
        </Col>
      </Row>
      </CardBody>
      </Card>
      {/* Display Active Component After Reload */}
      {activeComponent === "Hotel4" && sessionId && bookingCartId && (
        <Hotel4 sessionId={sessionId} actionType={actionType} bookingCartId={bookingCartId}getRoomDetails={getRoomDetails} activeComponent={activeComponent}/>
      )}
      {activeComponent === "CheckOut" && <CheckOut roomData={roomData} getRoomDetails={getRoomDetails} />}
      {activeComponent === "Cleaning" && <Cleaning getRoomDetails={getRoomDetails} /> }
      {activeComponent === "Reservation" && <Reservation roomData={roomData} />}
      {activeComponent === "Update" && <Update roomData={roomData} getRoomDetails={getRoomDetails}/>}
    </Container>
  );
};

export default HotelDashboard;
