import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import moment from 'moment';
import { FaEdit, FaSignOutAlt,FaBook } from 'react-icons/fa';
// import * as Icon from 'react-feather';
import api from '../../../constants/api';
import BookingRoomViewModal from '../../BookingTable/BookingRoomViewModal';
import BookingRoomEditModal from '../../BookingTable/BookingRoomEditModal';

const CheckInList = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [roomDetails, setRoomDetails] = useState([]);
  const [LogHistory, setLogHistoryDetails] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // Store selected room
  const [loading, setLoading] = useState(true);
  const [editContactViewModal, setEditContactViewModal] = useState(false);
  const [roomType, setRoomType] = useState([]);
  const [BookingroomStatus, setBookingroomStatus] = useState([]);
  const [editContactEditModal, setEditContactEditModal] = useState(false);
  // const [isLoadingout, setIsLoadingout] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLogHistoryModal, setShowLogHistoryModal] = useState(false);
  console.log('LogHistory',LogHistory)

  // Fetch Check-in List
  useEffect(() => {
    api
      .get('/booking/getBookingCompleted')
      .then((res) => {
        setCheckIns(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching check-in list:', err);
        setLoading(false);
      });
  }, []);

  // Fetch rooms under selected booking
  const fetchRoomDetails = (bookingId) => {
    setLoading(true);
    api
      .post('/booking/getBookingServiceById', { booking_id: bookingId })
      .then((res) => {
        setRoomDetails(res.data.data);
        setSelectedBooking(bookingId);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching room details:', err);
        setLoading(false);
      });
  };

  const fetchLogHistory = (bookingId) => {
 
    api
      .post('/booking/getLogHistory', { booking_id: bookingId })
      .then((res) => {
        setLogHistoryDetails(res.data.data);
       
      })
      .catch((err) => {
        console.error('Error fetching room details:', err);
      
      });
  };
  // useEffect(() => {
  //   fetchLogHistory();
  // })
  // Fetch Room Types and Status List
  useEffect(() => {
    api
      .get('/booking/getRoom')
      .then((res) => setRoomType(res.data.data))
      .catch(() => {});

    api
      .get('/booking/get-ValueListRoomStatus')
      .then((res) => setBookingroomStatus(res.data.data))
      .catch(() => {});
  }, []);

  const statusCheck = async (bookingId) => {
    try {
      // Fetch all booking services for this booking_id
      const response = await api.post('/booking/getBookingServiceStatus', {
        booking_id: bookingId,
      });
  
      // Extract the status list
      const roomHistoryStatus = response?.data?.data || [];

      console.log("Room history status:", roomHistoryStatus);
      roomHistoryStatus.forEach((room, index) => {
        console.log(`Room ${index + 1}: ${room.status}`);
      });
  
      // Check if all statuses are "Check out"
      const allCheckedOut = roomHistoryStatus.every(room => room.status === "Check out");


      console.log("Room history status:", roomHistoryStatus);
console.log("All checked out:", allCheckedOut);
  
      if (allCheckedOut) {
        // Update the booking table if all services are checked out
        await api.post("/booking/edit-Booking_status", { 
          status: "Completed", 
          booking_id: bookingId 
        });
  
        console.log(`Booking ID ${bookingId} marked as Completed.`);
      }
    } catch (error) {
      console.error(`Error checking status for booking ${bookingId}:`, error);
    }
  };
  

  useEffect(() => {
    statusCheck()
  }, []);

  const CheckOutRoomwise = async (roomNumbers, serviceId,bookingId) => {
    try {
      // Ensure roomNumbers is an array
      if (!Array.isArray(roomNumbers)) {
        roomNumbers = [roomNumbers]; // Convert single room number to array
      }

      // Confirm Check-Out Action
      const isConfirmed = window.confirm('Are you sure you want to Check Out?');
      if (!isConfirmed) return;

      setLoading(true);

      // Check if roomNumbers is empty
      if (!roomNumbers || roomNumbers.length === 0) {
        alert('No rooms selected for check-out.');
        return;
      }

      // Fetch room history for each room number
      const roomHistoryPromises = roomNumbers.map(async (roomNumber) => {
        try {
          const res1 = await api.post('/booking/BookingHistoryRoomNumber', {
            room_number: roomNumber,
          });

          if (!res1.data || !res1.data.data || res1.data.data.length === 0) {
            console.warn(`No room history found for room number: ${roomNumber}`);
            return null;
          }

          return {
            room_history_id: res1.data.data[0].room_history_id, // Use first result
            is_available: 'No',
            cleaning: 'No',
          };
        } catch (error) {
          console.error(`Error fetching room history for room number ${roomNumber}:`, error);
          return null;
        }
      });

      // Resolve all room history fetch requests
      const roomHistories = await Promise.all(roomHistoryPromises);

      // Filter out null values (in case no history was found)
      const validRoomUpdates = roomHistories.filter(Boolean);

      if (validRoomUpdates.length === 0) {
        alert('No valid room history data found.');
        return;
      }

      // Update room availability in parallel
      const roomUpdatePromises = validRoomUpdates.map((statusInsert) =>
        api.post('/booking/edit-Rooms-History-Edit', statusInsert),
      );

      await Promise.all(roomUpdatePromises);

      // Get current date and time
      const currentDate = moment().format('YYYY-MM-DD');
      const currentTime = moment().format('HH:mm:ss');

      // Update booking status to "Completed"
      await api.post('/booking/edit-checkOut', {
        status: 'Check out',
        check_out_date: currentDate,
        check_out_time: currentTime,
        booking_service_id: serviceId,
      });

      console.log("Check-out API response received. Fetching status again...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Short delay before checking status
      await statusCheck(bookingId);

      alert('Check Out Successfully!')   
  
      window.location.reload();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking.');
    } finally {
      setLoading(false); // Hide loader after API call (success or failure)
    }
  };

  return (
    <Container className="mt-4">

     
      <Row>
        {/* Check-in List */}
        <h2 
  className="mb-4 text-center fw-bold text-uppercase p-3 bg-primary text-white rounded shadow-sm"
>
<i className="fas fa-sign-out-alt me-2"></i> Check out
</h2> 
        <Col md="12">
          <Card className="p-3 shadow-lg">
            <h4 className="text-center mb-3">🏨 Check-in List</h4>
            {loading ? (
              <div className="text-center my-3">
                <Spinner color="primary" />
              </div>
            ) : (
              <Table bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Grand Amount</th>
                    <th>Advance Amount</th>
                    <th>Balance Amount</th>
                    <th>Total Rooms</th>
                    <th>Check In Date</th>
                    <th>Check In Time</th>
                    <th></th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {checkIns?.map((checkIn, index) => (
                    <tr key={checkIn.booking_id}>
                      <td>{index + 1}</td>
                      <td>{checkIn.first_name}</td>
                      <td>{checkIn.phone_direct}</td>
                      <td>{checkIn.grand_total}</td>
                      <td>{checkIn.amount }</td>
                      <td>
  {(!checkIn.amount || checkIn.amount === 0)
    ? checkIn.grand_total
    : `${checkIn.total}`}
</td>
                      <td>{checkIn.booking_service_count}</td>
                      <td>{checkIn.booking_date}</td>
                      <td>{checkIn.assign_time}</td>
                      <td>
                        <Button
                          color="primary"
                          onClick={() => {
                            fetchLogHistory(checkIn.booking_id); // Fetch rooms before opening modal
                            // setSelectedBooking(checkIn.booking_id);
                            setShowLogHistoryModal(true);
                          }}
                        >
                        <FaBook className="me-1" /> Logs
                        </Button>
                      </td>
                      <td>
                        <Button
                          color="primary"
                          onClick={() => {
                            fetchRoomDetails(checkIn.booking_id); // Fetch rooms before opening modal
                            setSelectedBooking(checkIn.booking_id);
                            setShowBookingModal(true);
                          }}
                        >
                          <FaEdit /> Room Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>

        {/* Room Details for Selected Booking */}
        <Modal isOpen={showLogHistoryModal} toggle={() => setShowLogHistoryModal(false)} size="xl">
            <ModalHeader toggle={() => setShowLogHistoryModal(false)}>
              Log Details
            </ModalHeader>
            <ModalBody>
              <Col md="12">
                <Card className="p-3 shadow-lg">
                  <h4 className="text-center mb-3">Log History</h4>
                  {loading ? (
                    <div className="text-center my-3">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <Table bordered hover responsive>
                      <thead className="table-primary">
                        <tr>
                           <th>S.No</th>
                          <th>Booking id</th>
                          <th>Action Type</th>
                          <th>Description</th>
                          <th>Customer Name</th>
                          <th>Creation Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {LogHistory?.map((room,index) => (
                          <tr key={room.log_history_id}>
                             <td>{index+1}</td>
                            <td>{room.booking_id}</td>
                            <td>{room.action_type}</td>
                            <td>{room.description}</td>
                            <td>{room.first_name}</td>
                            <td>{moment(room.creation_date).format('DD-MM-YYYY hh:mm A')}</td>

                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card>
              </Col>
            </ModalBody>
          </Modal>

        {showBookingModal && selectedBooking && roomDetails.length > 0 && (
          <Modal isOpen={showBookingModal} toggle={() => setShowBookingModal(false)} size="xl">
            <ModalHeader toggle={() => setShowBookingModal(false)}>
              Booking Details - {selectedBooking}
            </ModalHeader>
            <ModalBody>
              <Col md="12">
                <Card className="p-3 shadow-lg">
                  <h4 className="text-center mb-3">🛏️ Rooms in Booking {selectedBooking}</h4>
                  {loading ? (
                    <div className="text-center my-3">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <Table bordered hover responsive>
                      <thead className="table-primary">
                        <tr>
                          <th>Room Number</th>
                          <th>Details</th>
                          <th>Room Type</th>
                          <th>Room Price</th>
                          <th>Total Amount</th>
                          <th>Grand Total</th>
                          <th>Check In Date</th>
                          <th>Check In Time</th>
                          <th>Check Out Date</th>
                          <th>Check Out Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomDetails.map((room) => (
                          <tr key={room.room_id}>
                            <td>{room.room_number}</td>
                            {room?.status === 'Check In' ? (
                              <td>
                                  <Button
                          color="primary">
                                  <span
                                    onClick={() => {
                                      setSelectedRoom(room);
                                      setEditContactEditModal(true);
                                    }}
                                  >
                                   <FaEdit />Edit
                                  </span>
                                  </Button>
                              </td>
                            ) : (
                              <td>
                                <span
                                  className="text-primary cursor-pointer"
                                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                  onClick={() => {
                                    setSelectedRoom(room);
                                    setEditContactViewModal(true);
                                  }}
                                >
                                  View
                                </span>
                              </td>
                            )}
                            <td>{room.room_type}</td>
                            <td>{room.amount}</td>
                            <td>{room.qty * room.amount}</td>
                            <td>{room.grand_total}</td>
                            <td>{moment(room.check_in_date).format('DD-MM-YYYY')}</td>
                            <td>{room.check_in_time}</td>
                            <td>
                              {room.check_out_date
                                ? moment(room.check_out_date).format('DD-MM-YYYY')
                                : ''}
                            </td>
                            <td>{room.check_out_time}</td>
                            <td>
                              {room?.status === 'Check In' ? (
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() =>{
                                    CheckOutRoomwise([room.room_number], room.booking_service_id,room.booking_id);
                                    statusCheck(room.booking_id)
                                    fetchRoomDetails(room.booking_id)
                                   } }
                                >
                                  <FaSignOutAlt /> Check Out
                                </Button>
                              ) : (
                                <span>Check Out Completed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card>
              </Col>
            </ModalBody>
          </Modal>
        )}
      </Row>

      {/* Booking Room View Modal */}
      <BookingRoomEditModal
        editContactEditModal={editContactEditModal}
        setEditContactEditModal={setEditContactEditModal}
        contactData={selectedRoom}
        roomStatus={roomType}
        fetchRoomDetails={fetchRoomDetails}
        BookingroomStatus={BookingroomStatus}
      />

      {/* Booking Room View Modal */}
      <BookingRoomViewModal
        editContactViewModal={editContactViewModal}
        setEditContactViewModal={setEditContactViewModal}
        contactData={selectedRoom} // Pass selected room only
        roomStatus={roomType}
        BookingroomStatus={BookingroomStatus}
      />
    </Container>
  );
};

export default CheckInList;
