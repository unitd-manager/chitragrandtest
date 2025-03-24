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
import { FaEdit} from 'react-icons/fa';
import * as Icon from 'react-feather';
import api from '../../../constants/api';
import BookingRoomViewModal from '../../BookingTable/BookingRoomViewModal';
import BookingRoomEditModal from '../../BookingTable/BookingRoomEditModal';

const CheckInList = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [roomDetails, setRoomDetails] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // Store selected room
  const [loading, setLoading] = useState(true);
  const [editContactViewModal, setEditContactViewModal] = useState(false);
  const [roomType, setRoomType] = useState([]);
  const [BookingroomStatus, setBookingroomStatus] = useState([]);
  const [editContactEditModal, setEditContactEditModal] = useState(false);
  // const [isLoadingout, setIsLoadingout] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

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


  // const editOrderItemUpdate = async (bookingId) => {
  //   try {
  //     const isConfirmed = window.confirm("Are you sure you want to update this Booking?");
  
  //     if (!isConfirmed) {
  //       return; // Stop execution if the user cancels
  //     }
  //     setIsLoadingout(true);
  //     const res = await api.post('/booking/getBookingServiceById', { booking_id: bookingId });
  
  //     if (!res.data.data || res.data.data.length === 0) {
  //       console.error("No room order data found");
  //       alert("No room order data found");
  //       return;
  //     }
  
  //     // Create an array of promises
  //     const orderItemPromises = res.data.data.map((item) => {
  //       const orderItem = {
  //         booking_service_id: item.booking_service_id,
  //         order_id: item.order_id, 
  //         unit_price: item.amount,
  //         cost_price: item.amount * item.qty,
  //         item_title: item.room_type,
  //         qty: item.qty,
         
  //       };
  
  //       console.log("Updating order item:", orderItem);
  
  //       return api.post('/finance/editorderItem', orderItem);
  //     });
  
  //     // Wait for all API calls to complete
  //     await Promise.all(orderItemPromises);
  
  //     alert("Order has been updated successfully.");
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error updating booking:", error);
  //     alert("Failed to update booking.");
  //   }
  //   finally {
  //     setIsLoadingout(false); // Hide loader after API call (success or failure)
  //   }
  // };

  // const CheckOutRoomwise = async (roomNumbers, serviceId) => {
  //   try {
  //     // Ensure roomNumbers is an array
  //     if (!Array.isArray(roomNumbers)) {
  //       roomNumbers = [roomNumbers]; // Convert single room number to array
  //     }

  //     // Confirm Check-Out Action
  //     const isConfirmed = window.confirm('Are you sure you want to Check Out?');
  //     if (!isConfirmed) return;

  //     setIsLoadingout(true);

  //     // Check if roomNumbers is empty
  //     if (!roomNumbers || roomNumbers.length === 0) {
  //       alert('No rooms selected for check-out.');
  //       return;
  //     }

  //     // Fetch room history for each room number
  //     const roomHistoryPromises = roomNumbers.map(async (roomNumber) => {
  //       try {
  //         const res1 = await api.post('/booking/BookingHistoryRoomNumber', {
  //           room_number: roomNumber,
  //         });

  //         if (!res1.data || !res1.data.data || res1.data.data.length === 0) {
  //           console.warn(`No room history found for room number: ${roomNumber}`);
  //           return null;
  //         }

  //         return {
  //           room_history_id: res1.data.data[0].room_history_id, // Use first result
  //           is_available: 'yes',
  //         };
  //       } catch (error) {
  //         console.error(`Error fetching room history for room number ${roomNumber}:`, error);
  //         return null;
  //       }
  //     });

  //     // Resolve all room history fetch requests
  //     const roomHistories = await Promise.all(roomHistoryPromises);

  //     // Filter out null values (in case no history was found)
  //     const validRoomUpdates = roomHistories.filter(Boolean);

  //     if (validRoomUpdates.length === 0) {
  //       alert('No valid room history data found.');
  //       return;
  //     }

  //     // Update room availability in parallel
  //     const roomUpdatePromises = validRoomUpdates.map((statusInsert) =>
  //       api.post('/booking/edit-Rooms-History-Edit', statusInsert),
  //     );

  //     await Promise.all(roomUpdatePromises);

  //     // Get current date and time
  //     const currentDate = moment().format('YYYY-MM-DD');
  //     const currentTime = moment().format('HH:mm:ss');

  //     // Update booking status to "Completed"
  //     await api.post('/booking/edit-checkOut', {
  //       status: 'Check out',
  //       check_out_date: currentDate,
  //       check_out_time: currentTime,
  //       booking_service_id: serviceId,
  //     });

  //     alert('Check Out Successfully!');
  //     window.location.reload();
  //   } catch (error) {
  //     console.error('Error updating booking:', error);
  //     alert('Failed to update booking.');
  //   } finally {
  //     setIsLoadingout(false); // Hide loader after API call (success or failure)
  //   }
  // };

  return (
    <Container className="mt-4">
     
      <Row>
        {/* Check-in List */}
        <h2 
  className="mb-4 text-center fw-bold text-uppercase p-3 bg-primary text-white rounded shadow-sm"
>
<i className="fas fa-sync-alt me-2"></i> Update
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
                    <th>Check In Date</th>
                    <th>Check In Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {checkIns?.map((checkIn, index) => (
                    <tr key={checkIn.booking_id}>
                      <td>{index + 1}</td>
                      <td>{checkIn.first_name}</td>
                      <td>{checkIn.mobile}</td>
                      <td>{checkIn.booking_date}</td>
                      <td>{checkIn.assign_time}</td>
                      <td>
                        <Button
                          color="primary"
                          onClick={() => {
                            fetchRoomDetails(checkIn.booking_id); // Fetch rooms before opening modal
                            setSelectedBooking(checkIn.booking_id);
                            setShowBookingModal(true);
                          }}
                        >
                          <FaEdit /> Edit
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

        {showBookingModal && selectedBooking && roomDetails.length > 0 && (
          <Modal isOpen={showBookingModal} toggle={() => setShowBookingModal(false)} size="xl">
            <ModalHeader toggle={() => setShowBookingModal(false)}>
              Booking Details - {selectedBooking}
            </ModalHeader>
            <ModalBody>
            {/* {isLoadingout && (
        <div className="text-center my-3">
          <Spinner color="primary" />
        </div>
      )} */}
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
                          <th>Grant Total</th>
                          <th>Check In Date</th>
                          <th>Check In Time</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {roomDetails.map((room) => (
                          <tr key={room.room_id}>
                            <td>{room.room_number}</td>
                            {room?.status === 'Check In' ? (
                              <td>
                                <div className="anchor">
                                  <span
                                    onClick={() => {
                                      setSelectedRoom(room);
                                      setEditContactEditModal(true);
                                    }}
                                  >
                                    <Icon.Edit2 />
                                  </span>
                                </div>
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
                            {/* <td>
                              {room?.status === 'Check In' ? (
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() =>
                                    editOrderItemUpdate(room.booking_id)
                                  }
                                >
                                  <FaSignOutAlt /> Update
                                </Button>
                              ) : (
                                <span>Check Out Completed</span>
                              )}
                            </td> */}
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
