import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaBed } from "react-icons/fa";
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, Button } from "reactstrap";
import api from "../../../constants/api";
// import HotelDashboard3 from "./Hotel5"; // Import the HotelDashboard3 component here


const Cleaning = ({getRoomDetails}) => {
  const [roomData, setRoomData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]); // Store selected room IDs
  // const [isRoomUpdated, setIsRoomUpdated] = useState(false); // Flag to check if rooms are updated


  // Fetch available & booked rooms


  const getRoomsByCleaning = () => {
    api.get("/booking/getRoomsByAvailability")
    .then((res) => {
      console.log("API Response:", res.data);

      const formattedData = {};
      res.data.data.forEach((room) => {
        const {
          room_id: roomId,
          room_type: roomType,
          room_number: roomNumber,
          status,
          bed_type: bedType,
          floor_number: floorNumber,
          room_size: roomSize,
          room_history_id:roomhistoryId,
          cleaning:CleaningStatus
        } = room;

        if (!formattedData[roomType]) {
          formattedData[roomType] = { available: [], booked: [] };
        }

        formattedData[roomType][status].push({
          roomId,
          roomNumber,
          roomType,
          bedType,
          floorNumber,
          roomSize,
          roomhistoryId,
          CleaningStatus,
        });
      });

      console.log("Formatted Data:", formattedData);
      setRoomData(formattedData);
      setSelectedCategory(Object.keys(formattedData)[0] || null);
    })
    .catch((err) => console.error("Error fetching room data:", err));
  }

  useEffect(() => {
    getRoomsByCleaning();
  }, []);

  // ✅ Handle room selection toggle
  const toggleRoomSelection = (room) => {
    setSelectedRooms((prevSelectedRooms) =>
      prevSelectedRooms.some((r) => r.roomNumber === room.roomNumber)
        ? prevSelectedRooms.filter((r) => r.roomNumber !== room.roomNumber) // Remove if already selected
        : [...prevSelectedRooms, room] // Add if not selected
    );
  };

  const updateRoomSelection = () => {
  
  
    if (!selectedRooms || selectedRooms.length === 0) {
      alert("No rooms selected.");
      return;
    }
  
    const requestData = {
      rooms: selectedRooms.map(({ roomhistoryId }) => ({
        roomhistoryId,
        cleaning: "Yes",
        is_available: "Yes",
      })),
    };
  
    console.log("📌 Sending API Request:", JSON.stringify(requestData, null, 2));
  
    api
    .post("/bookingcart/update-room-selection-cleaning", requestData)
    .then((res) => {
      console.log("API Response:", res.data); // Log the response

      getRoomsByCleaning()
      getRoomDetails()
  
      // Check if res.data is an array
      if (Array.isArray(res.data)) {
        res.data.forEach(item => {
          console.log(item); // Process each item
        });
      } else if (res.data && res.data.rooms && Array.isArray(res.data.rooms)) {
        // If res.data has rooms and it's an array, loop through it
        res.data.rooms.forEach(room => {
          console.log(room); // Process each room
        });
      } else if (res.data && typeof res.data === 'object') {
        // If res.data is an object but not an array, use Object.keys(), Object.values(), or Object.entries()
        // Example using Object.keys():
        Object.keys(res.data).forEach(key => {
          console.log(key, res.data[key]); // Iterate over each key-value pair
        });
  
        // Or Example using Object.values():
        Object.values(res.data).forEach(value => {
          console.log(value); // Iterate over each value
        });
  
        // Or Example using Object.entries():
        Object.entries(res.data).forEach(([key, value]) => {
          console.log(key, value); // Iterate over each key-value pair
        });
      } else {
        console.error("Data is not iterable:", res.data);
      }
  
      // Handling success or failure
      if (res.data.success) {
        alert("✅ Rooms updated successfully!");
        setSelectedRooms([]); // Clear selection
        // setIsRoomUpdated(true); // Set the flag to true
      } else {
        throw new Error(res.data.message || "Unknown error");
      }
    })
    .catch((err) => {
      console.error("🚨 API Error:", err.response?.data || err.message);
      alert("⚠ Failed to update rooms. Please try again.");
    });
  
  
  };
  
  // Ensure function is defined before calling it
  if (typeof updateRoomSelection !== "function") {
    console.error("updateRoomSelection is not defined.");
  }
  
  // if (isRoomUpdated) {
  //   // Once rooms are updated, show HotelDashboard3
  //   return <HotelDashboard3 bookingCartId={bookingCartId} />;
  // }

  // Helper function to decide style based on cleaning + selection
  const getRoomStyle = (room) => {
    const isSelected = selectedRooms.some((r) => r.roomNumber === room.roomNumber);
    
    if (room.CleaningStatus === "No") {
      return {
        backgroundColor: isSelected ? "#ffc107" : "#808080",
        color: "#fff",
        cursor: "pointer",
      };
    }
  
    if (room.CleaningStatus === "Yes") {
      return {
        backgroundColor: "red",
        color: "#fff",
      };
    }
  
    // Default fallback
    return {
      backgroundColor: "red",
      color: "#fff",
   
    };
  };
  


  return (
    <Container className="mt-4">
<h2 
  className="mb-4 text-center fw-bold text-uppercase p-3 bg-primary text-white rounded shadow-sm"
>
<i className="fas fa-broom me-2"></i> Cleaning
</h2>

      <Row className="justify-content-center">
        <Col md="8">
          <Nav tabs className="d-flex justify-content-center mb-3">
            {Object.keys(roomData).length > 0 ? (
              Object.keys(roomData).map((category) => (
                <NavItem key={category}>
                  <NavLink
                    className={selectedCategory === category ? "active" : ""}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      cursor: "pointer",
                      padding: "12px 20px",
                      fontWeight: "bold",
                    }}
                  >
                    {category}
                  </NavLink>
                </NavItem>
              ))
            ) : (
              <p>No room types available</p>
            )}
          </Nav>
        </Col>
      </Row>

      <Row className="justify-content-center">
        {selectedCategory && roomData[selectedCategory] ? (
          <>
            {roomData[selectedCategory].booked.map((room) => (
              <Col key={room.roomNumber} xs={12} sm={6} md={3} className="mb-3">
                <Card
                  onClick={() => toggleRoomSelection(room)}
                  style={getRoomStyle(room)}
                >
                   <CardBody className="text-center p-3">
        <FaBed size={20} className="mb-1" /> {/* Room Icon */}
        <br />
        {room.roomNumber} {/* Room Number */}
      </CardBody>
                </Card>
              </Col>
            ))}

            {roomData[selectedCategory].available.map((room) => (
             <Col key={room.roomNumber} xs={12} sm={6} md={3} className="mb-3">
                <Card style={{ backgroundColor: "#28a745", color: "#fff" }}>
                <CardBody className="text-center p-3">
        <FaBed size={20} className="mb-1" /> {/* Room Icon */}
        <br />
        {room.roomNumber} {/* Room Number */}
      </CardBody>
                </Card>
              </Col>
            ))}
          </>
        ) : (
          <Col className="text-center">
            <p>No rooms available for this category.</p>
          </Col>
        )}
      </Row>

     
      <div className="text-center mt-3">
  <Button className="btn btn-primary" onClick={updateRoomSelection}>
    Confirm Cleaning
  </Button>
</div>
      
    </Container>
  );
};

Cleaning.propTypes = {
  getRoomDetails: PropTypes.func.isRequired,
  // actionType: PropTypes.string.isRequired,
  // bookingCartId: PropTypes.number.isRequired,
};

export default Cleaning;
