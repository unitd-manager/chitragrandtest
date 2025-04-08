import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaBed } from "react-icons/fa";
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, Button,TabContent, TabPane } from "reactstrap";
import classnames from 'classnames';
import api from "../../../constants/api";
import HotelDashboard3 from "./Hotel5"; // Import the HotelDashboard3 component here


const HotelDashboard2 = ({ sessionId, actionType, bookingCartId,getRoomDetails, }) => {
  const [roomData, setRoomData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]); // Store selected room IDs
  // const [isRoomUpdated, setIsRoomUpdated] = useState(false); // Flag to check if rooms are updated
  const [isLoading, setIsLoading] = useState(false);

  const [roomDetails, setRoomDetails] = useState([]);
  console.log('roomDetails', roomDetails);
  const getcartHistory = () => {
    api
    .post('/booking/getCartHistoryById', { booking_cart_id: bookingCartId })
    .then((res) => {
        setRoomDetails(res.data.data)
    })
    .catch((err) => {
      console.error('Error fetching room details:', err);
    });

  }
  useEffect(() => {
    getcartHistory();
}, [bookingCartId]);

  const [activeTab, setActiveTab] = useState('1');
  // Fetch available & booked rooms

  const getRoomsByUpdate = () => {
    api.get("/booking/getRoomsByAvailability")
      .then((res) => {
        console.log("API Response:", res.data);

        const formattedData = {};
        res.data.data.forEach((room) => {
          const {
            room_id: roomId,
            room_type: roomType,
            room_number: roomNumber,
            amount: Amount,
            status,
            bed_type: bedType,
            floor_number: floorNumber,
            room_size: roomSize,
            room_history_id:roomhistoryId
          } = room;

          if (!formattedData[roomType]) {
            formattedData[roomType] = { available: [], booked: [] };
          }

          formattedData[roomType][status].push({
            roomId,
            roomNumber,
            roomType,
            bedType,
            Amount,
            floorNumber,
            roomSize,
            roomhistoryId
          });
        });

        console.log("Formatted Data:", formattedData);
        setRoomData(formattedData);
        setSelectedCategory(Object.keys(formattedData)[0] || null);
      })
      .catch((err) => console.error("Error fetching room data:", err));
  }
  useEffect(() => {
    getRoomsByUpdate()
  }, []);

  // ✅ Handle room selection toggle
  const toggleRoomSelection = (room) => {
    setSelectedRooms((prevSelectedRooms) =>
      prevSelectedRooms.some((r) => r.roomNumber === room.roomNumber)
        ? prevSelectedRooms.filter((r) => r.roomNumber !== room.roomNumber) // Remove if already selected
        : [...prevSelectedRooms, room] // Add if not selected
    );
  };


  // const deleteRecord = (staffId) => {
  //   Swal.fire({
  //     title: `Are you sure? `,
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       api
  //         .post('/booking/deleteBookingHistory', { booking_service_id: staffId })
  //         .then(() => {
  //           Swal.fire('Deleted!', 'Room has been deleted.', 'success');
  //           message('Record deleted successfully', 'success');
  //           window.location.reload();
  //         })
  //         .catch(() => {
  //           message('Unable to delete record.', 'error');
  //         });
  //     }
  //   });
  // };
  const getRoomCartHistory = async () => {
    try {

      await api.post('/bookingcart/deleteCartHistory', { booking_cart_id: bookingCartId });
      // const res = await api.post('/bookingcart/get-room-details', { booking_cart_id: bookingCartId });
      // const existingRooms = res.data?.data;
  

      console.log('selectedRooms',selectedRooms)

  
      const requestData = {
        sessionId,
        actionType,
        bookingCartId,
        rooms: selectedRooms.map((room) => ({
          room_type: room.roomType,
          room_number: room.roomNumber,
          amount: room.Amount,
        })),
      };
  
      const insertRes = await api.post('/bookingcart/InsertBookingCart', requestData);
  
      if (insertRes) {
        console.log('✅ Booking Cart Updated Successfully:', insertRes.data);
        getcartHistory(); // Refresh the cart list or UI
      }
    } catch (err) {
      console.error('🚨 Error in getRoomCartHistory:', err.response?.data || err.message);
    }
  };
  
  


  const updateRoomSelection = () => {
    if (!sessionId || !actionType || !bookingCartId) {
      alert('Missing session ID, action type, or booking cart ID.');
      return;
    }

    if (!selectedRooms || selectedRooms.length === 0) {
      alert('No rooms selected.');
      return;
    }

    setIsLoading(true);
    const requestData = {
      sessionId,
      actionType,
      bookingCartId,
      rooms: selectedRooms.map(({ roomhistoryId }) => ({
        roomhistoryId,
        isAvailable: 'No',
      })),
    };

    console.log('📌 Sending API Request:', JSON.stringify(requestData, null, 2));

    api
      .post('/bookingcart/update-room-booking-cart', requestData)
      .then((res) => {
        console.log('API Response:', res.data); // Log the response
        getRoomCartHistory()
        // Check if res.data is an array
        if (Array.isArray(res.data)) {
          res.data.forEach((item) => {
            console.log(item); // Process each item
          });
        } else if (res.data && res.data.rooms && Array.isArray(res.data.rooms)) {
          // If res.data has rooms and it's an array, loop through it
          res.data.rooms.forEach((room) => {
            console.log(room); // Process each room
          });
        } else if (res.data && typeof res.data === 'object') {
          // If res.data is an object but not an array, use Object.keys(), Object.values(), or Object.entries()
          // Example using Object.keys():
          Object.keys(res.data).forEach((key) => {
            console.log(key, res.data[key]); // Iterate over each key-value pair
          });

          // Or Example using Object.values():
          Object.values(res.data).forEach((value) => {
            console.log(value); // Iterate over each value
          });

          // Or Example using Object.entries():
          Object.entries(res.data).forEach(([key, value]) => {
            console.log(key, value); // Iterate over each key-value pair
          });
        } else {
          console.error('Data is not iterable:', res.data);
        }

        // Handling success or failure
        if (res.data.success) {

          setIsLoading(false);
          alert('✅ Rooms updated successfully!');
          // setSelectedRooms([]); // Clear selection
          // Set the flag to true
        } else {
          throw new Error(res.data.message || 'Unknown error');
        }
      })
      .catch((err) => {
        console.error('🚨 API Error:', err.response?.data || err.message);
        alert('⚠ Failed to update rooms. Please try again.');
      });
  };
  
  // if (isRoomUpdated) {
  //   // Once rooms are updated, show HotelDashboard3
  //   return <HotelDashboard3 bookingCartId={bookingCartId} getRoomDetails={getRoomDetails} activeComponent={activeComponent} selectedRooms={selectedRooms}setSelectedRooms={setSelectedRooms}sessionId={sessionId}actionType={actionType} />;
  // }
  
  return (
    <Container className="mt-4">
   
   <h2 
  className="mb-4 text-center fw-bold text-uppercase p-3 bg-primary text-white rounded shadow-sm"
>
  <i className="fas fa-door-open me-2"></i> Room Availability
</h2>
      <Row className="justify-content-center">
        <Col md="12">
        <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => setActiveTab('1')}
          >
           Hotel Room Availability
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => setActiveTab('2')}
          >
            Check In Details
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
     
        <TabPane tabId="1">
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
        <Row className="justify-content-center">
        {selectedCategory && roomData[selectedCategory] ? (
          <>
            {roomData[selectedCategory].available.map((room) => (
              <Col key={room.roomNumber} xs={12} sm={6} md={3} className="mb-3">
                <Card
                  onClick={() => toggleRoomSelection(room)}
                  style={{
                    backgroundColor: selectedRooms.some((r) => r.roomNumber === room.roomNumber) ? "#ffc107" : "#28a745",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                   <CardBody className="text-center p-3">
        <FaBed size={20} className="mb-1" /> {/* Room Icon */}
        <br />
        {room.roomNumber} {/* Room Number */}
      </CardBody>
                </Card>
              </Col>
            ))}

            {roomData[selectedCategory].booked.map((room) => (
             <Col key={room.roomNumber} xs={12} sm={6} md={3} className="mb-3">
                <Card style={{ backgroundColor: "#dc3545", color: "#fff" }}>
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
      <Button 
  className="btn btn-primary" 
  onClick={() => {
    updateRoomSelection();
    // setIsRoomUpdated(true);
  }}
>
{isLoading ? (
      <>
        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
        Confirm Rooms Saving...
      </>
    ) : (
      ' Confirm Rooms'
    )}
 
</Button>
</div>
        </TabPane>
        <TabPane tabId="2">
          <HotelDashboard3
            bookingCartId={bookingCartId}
            sessionId={sessionId}
            selectedRooms={selectedRooms}
            actionType={actionType}
            getRoomDetails={getRoomDetails}
            getRoomsByUpdate={getRoomsByUpdate}
            roomDetails={roomDetails}
            getcartHistory={getcartHistory}
          />
        </TabPane>
      </TabContent>
         
        </Col>
      </Row>

      {/* <Row className="justify-content-center">
        {selectedCategory && roomData[selectedCategory] ? (
          <>
            {roomData[selectedCategory].available.map((room) => (
              <Col key={room.roomNumber} xs="4" sm="3" md="2" className="mb-3">
                <Card
                  onClick={() => toggleRoomSelection(room)}
                  style={{
                    backgroundColor: selectedRooms.some((r) => r.roomNumber === room.roomNumber) ? "#ffc107" : "#28a745",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <CardBody className="text-center p-3">{room.roomNumber}</CardBody>
                </Card>
              </Col>
            ))}

            {roomData[selectedCategory].booked.map((room) => (
              <Col key={room.roomNumber} xs="4" sm="3" md="2" className="mb-3">
                <Card style={{ backgroundColor: "#dc3545", color: "#fff" }}>
                  <CardBody className="text-center p-3">{room.roomNumber}</CardBody>
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

      <Row className="justify-content-center mt-3">
      <Button 
  className="btn btn-primary" 
  onClick={() => {
    updateRoomSelection();
    setIsRoomUpdated(true);
  }}
>
  Confirm Booking
</Button>




      </Row> */}
     
    </Container>
  );
};

HotelDashboard2.propTypes = {
  sessionId: PropTypes.string.isRequired,
  actionType: PropTypes.string.isRequired,
  bookingCartId: PropTypes.number.isRequired,
  getRoomDetails: PropTypes.number.isRequired,
 
};

export default HotelDashboard2;
