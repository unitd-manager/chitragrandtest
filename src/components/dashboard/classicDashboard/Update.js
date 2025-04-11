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
  ModalFooter,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  CardBody,
} from 'reactstrap';
import moment from 'moment';
import { FaEdit,FaBook } from 'react-icons/fa';
import * as Icon from 'react-feather';
import message from '../../Message';
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
  const [addContactModal, setAddContactModal] = useState(false);
  const [addContactModalNew, setAddContactModalNew] = useState(false);
  const [bookingHistory, setBookingHistory] = useState();
  const [newContactData, setNewContactData] = useState({
    room_type: '',
    room_number: '',
  });
  const [newContactDataNew, setNewContactDataNew] = useState({
    room_type: '',
    room_number: '',
  });
  const [showLogHistoryModal, setShowLogHistoryModal] = useState(false);
  const addContactToggle = () => {
    setAddContactModal(!addContactModal);
  };
  const addContactToggleNew = () => {
    setAddContactModalNew(!addContactModalNew);
  };

  const handleAddNewContact = (e) => {
    setNewContactData({ ...newContactData, [e.target.name]: e.target.value });
  };

  const handleAddNewContactNew = (e) => {
    setNewContactDataNew({ ...newContactDataNew, [e.target.name]: e.target.value });
  };

  const BookingHistory = (roomTyp) => {
    api
      .post('/booking/BookingHistoryById', { room_type: roomTyp })
      .then((res) => {
        setBookingHistory(res.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    BookingHistory(newContactData && newContactData.room_type);
  }, [newContactData && newContactData.room_type]);
  useEffect(() => {
    BookingHistory(newContactDataNew && newContactDataNew.room_type);
  }, [newContactDataNew && newContactDataNew.room_type]);

  const getCompleted = () => {
    setLoading(true);
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
  };

  // Fetch Check-in List
  useEffect(() => {
    getCompleted();
  }, []);

  // Fetch rooms under selected booking
  const fetchRoomDetails = (bookingId) => {
    setLoading(true);
    api
      .post('/booking/getBookingServiceByIdUpdate', { booking_id: bookingId })
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

  const AddNewContactNew = () => {
    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm:ss');

    const newContactWithCompanyId = {
      ...newContactDataNew,
    };

    if (newContactWithCompanyId.room_type !== '') {
      api
        .post('/booking/BookingHistoryRoomNumber', {
          room_number: newContactDataNew?.room_number,
        })
        .then((res1) => {
          newContactWithCompanyId.amount = res1.data.data[0].amount;
          newContactWithCompanyId.qty = 1;
          console.log('Selected Room before insert:', selectedRoom);
          newContactWithCompanyId.grand_total = res1.data.data[0].amount;
          newContactWithCompanyId.booking_id = checkIns[0]?.booking_id;
          newContactWithCompanyId.is_available = 'No';
          newContactWithCompanyId.check_in_date = currentDate;
          newContactWithCompanyId.check_in_time = currentTime;
          newContactWithCompanyId.status = 'Check In';
          newContactWithCompanyId.room_change_status = 'Active';

          console.log('Final object sent to insertBookingHistory:', newContactWithCompanyId);

          api
            .post('/booking/insertBookingHistoryNew', newContactWithCompanyId)
            .then((res7) => {
              message('Room inserted successfully.', 'success');
              const insertedId = res7.data.data.insertId;

              api
                .post('/booking/BookingHistoryRoomNumber', {
                  room_number: newContactDataNew?.room_number,
                })
                .then((res) => {
                  const statusinsert = {
                    room_history_id: res.data.data[0].room_history_id,
                    is_available: 'No',
                  };

                  api.post('/booking/edit-Rooms-History-Edit', statusinsert).then(() => {
                    message('Record edited successfully', 'success');
                    const LogHistory1 = {
                      booking_id:checkIns[0]?.booking_id ,
                      action_type: 'New Room',
                      contact_id: checkIns[0]?.contact_id,
                      description:newContactDataNew?.room_number,
                    };

                    api.post('/booking/insertLogHistory', LogHistory1)

                    api.post('/booking/getBookingServiceOrderId', {booking_id : checkIns[0]?.booking_id}).then((res5) => {

                      console.log('orderid',res5.data.data[0].order_id)
                    
                      const OrderIdinsert = {
                        order_id: res5.data.data[0].order_id,
                        contact_id: checkIns[0]?.contact_id, 
                        unit_price: res1.data.data[0].amount,
                        cost_price: res1.data.data[0].amount* '1',
                        item_title: newContactDataNew?.room_type,
                        qty:  '1',
                        booking_id: checkIns[0]?.booking_id,
                        booking_service_id:insertedId,
                      };

                      api.post('/finance/insertorder_item', OrderIdinsert).then(() => {
                        message('Record edited successfully', 'success');
                        fetchRoomDetails(checkIns[0]?.booking_id);
                        getCompleted();
                      addContactToggleNew();
                    });
                    });
                  });
                });
            })
            .catch(() => {
              message('Network connection error.', 'error');
            });
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  const AddNewContact = async () => {
    try {
      console.log('Selected room:', selectedRoom);
  
      const newContactWithOld = {
        room_type: newContactData?.room_type,
        room_number: newContactData?.room_number,
        booking_id: selectedRoom?.booking_id,
        amount: selectedRoom?.amount,
        check_in_date: selectedRoom?.check_in_date,
        check_in_time: selectedRoom?.check_in_time,
        extra_person: selectedRoom?.extra_person,
        extra_person_amount: selectedRoom?.extra_person_amount,
        grand_total: selectedRoom?.grand_total,
        is_available: selectedRoom?.is_available,
        qty: selectedRoom?.qty,
        restaurant_service_amount: selectedRoom?.restaurant_service_amount,
        status: selectedRoom?.status,
        total_amount: selectedRoom?.total_amount,
        water_amount: selectedRoom?.water_amount,
        water_qty: selectedRoom?.water_qty,
        room_change_status: 'Active',
      };
  
      // Step 1: Mark new room as unavailable
      const newRoomRes = await api.post('/booking/BookingHistoryRoomNumber', {
        room_number: newContactData?.room_number,
      });
  
      const insertedRoomHistory = newRoomRes.data.data[0];
  
      const insertRes = await api.post('/booking/insertBookingHistoryRoomChange', newContactWithOld);
      message('Room inserted successfully.', 'success');

      const LogHistory2 = {
        booking_id: checkIns[0]?.booking_id,
        action_type: 'Roon Change',
        contact_id: checkIns[0]?.contact_id,
        description: `${selectedRoom?.room_number} TO ${newContactData?.room_number}`,
      };
      

      api.post('/booking/insertLogHistory', LogHistory2)
      const insertedId = insertRes.data.data.insertId;
  
      const serviceOrderRes = await api.post('/booking/getBookingServiceOrderId', {
        booking_id: checkIns[0]?.booking_id,
      });
  
      const orderId = serviceOrderRes.data.data[0]?.order_id;
  
      const OrderIdinsert = {
        order_id: orderId,
        contact_id: checkIns[0]?.contact_id,
        unit_price: selectedRoom?.amount,
        cost_price: selectedRoom?.amount * 1,
        item_title: newContactData?.room_type,
        qty: '1',
        booking_id: checkIns[0]?.booking_id,
        booking_service_id: insertedId,
      };
  
      await api.post('/finance/insertorder_item', OrderIdinsert);
      message('Record edited successfully', 'success');
  
      // Mark old booking service as cancelled
      const statusCancel = {
        booking_service_id: selectedRoom?.booking_service_id,
        room_change_status: 'Cancel',
        room_change_from: selectedRoom?.room_number,
        room_change_to: newContactData?.room_number,
        modification_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      await api.post('/booking/edit-room-cancel', statusCancel);
      message('Old booking marked as canceled', 'success');
  
      // Mark new room as unavailable
      const statusInsertNew = {
        room_history_id: insertedRoomHistory?.room_history_id,
        is_available: 'No',
      };
      await api.post('/booking/edit-Rooms-History-Edit', statusInsertNew);
      message('New room marked unavailable', 'success');
  
      // Step 2: Mark old room as available
      const oldRoomRes = await api.post('/booking/BookingHistoryRoomNumber', {
        room_number: selectedRoom?.room_number,
      });
  
      const statusInsertOld = {
        room_history_id: oldRoomRes.data.data[0]?.room_history_id,
        is_available: 'Yes',
      };
      await api.post('/booking/edit-Rooms-History-Edit', statusInsertOld);
      message('Old room marked available', 'success');
  
      // Update order item status
      const orderStatusEdit = {
        booking_service_id: selectedRoom?.booking_service_id,
        item_status: 'Cancel',
      };
      await api.post('/finance/editorderItemStatus', orderStatusEdit);
  
      // ✅ Wait for data to refresh before closing modal
      await getCompleted();
      fetchRoomDetails(checkIns[0]?.booking_id);
      addContactToggle();
  
    } catch (err) {
      console.error('Error in AddNewContact:', err);
      message('Something went wrong during room change.', 'error');
    }
  };
  

  // const AddNewContact = () => {
  //   console.log('Selected room:', selectedRoom);

  //   const newContactWithOld = {};
  //   newContactWithOld.room_type = newContactData?.room_type;
  //   newContactWithOld.room_number = newContactData?.room_number;
  //   newContactWithOld.booking_id = selectedRoom?.booking_id;
  //   newContactWithOld.amount = selectedRoom?.amount;
  //   newContactWithOld.check_in_date = selectedRoom?.check_in_date;
  //   newContactWithOld.check_in_time = selectedRoom?.check_in_time;
  //   newContactWithOld.extra_person = selectedRoom?.extra_person;
  //   newContactWithOld.extra_person_amount = selectedRoom?.extra_person_amount;
  //   newContactWithOld.grand_total = selectedRoom?.grand_total;
  //   newContactWithOld.is_available = selectedRoom?.is_available;
  //   newContactWithOld.qty = selectedRoom?.qty;
  //   newContactWithOld.restaurant_service_amount = selectedRoom?.restaurant_service_amount;
  //   newContactWithOld.status = selectedRoom?.status;
  //   newContactWithOld.total_amount = selectedRoom?.total_amount;
  //   newContactWithOld.water_amount = selectedRoom?.water_amount;
  //   newContactWithOld.water_qty = selectedRoom?.water_qty;
  //   newContactWithOld.room_change_status = 'Active';

  //   // Step 1: Mark new room as unavailable
  //   api
  //     .post('/booking/BookingHistoryRoomNumber', { room_number: newContactData?.room_number })
  //     .then((res) => {
  //       console.log('New Room History:', res.data.data);

  //       // Insert new booking history
  //       api.post('/booking/insertBookingHistoryRoomChange', newContactWithOld).then((res7) => {
  //         message('Room inserted successfully.', 'success');
  //         const insertedId = res7.data.data.insertId;
  //         api.post('/booking/getBookingServiceOrderId', {booking_id : checkIns[0]?.booking_id}).then((res5) => {

  //           console.log('orderid',res5.data.data[0].order_id)
          
  //           const OrderIdinsert = {
  //             order_id: res5.data.data[0].order_id,
  //             contact_id: checkIns[0]?.contact_id, 
  //             unit_price: selectedRoom?.amount,
  //             cost_price: selectedRoom?.amount* '1',
  //             item_title: newContactData?.room_type,
  //             qty:  '1',
  //             booking_id: checkIns[0]?.booking_id,
  //             booking_service_id:insertedId,
  //           };

  //           api.post('/finance/insertorder_item', OrderIdinsert).then(() => {
  //             message('Record edited successfully', 'success');
         
  //         });
  //         });
  //       });
  //       const statusCancel = {
  //         booking_service_id: selectedRoom?.booking_service_id,
  //         room_change_status: 'Cancel',
  //       };
  //       api.post('/booking/edit-room-cancel', statusCancel).then(() => {
  //         message('Cancel', 'success');
  //       });
  //       // Mark new room as not available
  //       const statusinsert = {
  //         room_history_id: res.data.data[0].room_history_id,
  //         is_available: 'No',
  //       };
  //       api.post('/booking/edit-Rooms-History-Edit', statusinsert).then(() => {
  //         message('New room marked unavailable', 'success');
  //       });
  //     });

  //   // Step 2: Mark old room as available
  //   api
  //     .post('/booking/BookingHistoryRoomNumber', { room_number: selectedRoom?.room_number })
  //     .then((res) => {
  //       console.log('Old Room History:', res.data.data);
  //       const statusinsert = {
  //         room_history_id: res.data.data[0].room_history_id,
  //         is_available: 'Yes',
  //       };
  //       api.post('/booking/edit-Rooms-History-Edit', statusinsert).then(() => {
  //         message('Old room marked available', 'success');

  //         const orderstatusEdit = {
  //           booking_service_id: selectedRoom?.booking_service_id,
  //           item_status: 'Cancel',
  //         };

  //         api.post('/finance/editorderItemStatus', orderstatusEdit).then(() => {
  //           getCompleted();
  //           addContactToggle();
  //         });
  //       });
  //     })
  //     .catch((err) => {
  //       console.error('Error updating old room:', err);
  //     });
  // };

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

  return (
    <Container className="mt-4">
      <Row>
        {/* Check-in List */}
        <h2 className="mb-4 text-center fw-bold text-uppercase p-3 bg-primary text-white rounded shadow-sm">
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
                      <td>{checkIn.amount}</td>
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
                  <Col md="3">
                    <FormGroup>
                      <Button
                        color="primary"
                        className="shadow-none"
                        style={{ backgroundColor: 'green' }}
                        onClick={() => {
                          addContactToggleNew();
                        }}
                      >
                        Add New Room{' '}
                      </Button>
                      <Modal
                        size="lg"
                        isOpen={addContactModalNew}
                        toggle={addContactToggleNew.bind(null)}
                      >
                        <ModalHeader toggle={addContactToggleNew.bind(null)}>
                          New Booking
                        </ModalHeader>
                        <ModalBody>
                          <Row>
                            <Col md="12">
                              <CardBody>
                                <Form>
                                  <Row>
                                    <Col md="6">
                                      <FormGroup>
                                        <Label>
                                          Room Type<span className="required"> *</span>
                                        </Label>
                                        <Input
                                          name="room_type"
                                          value={newContactDataNew && newContactDataNew.room_type}
                                          onChange={handleAddNewContactNew}
                                          type="select"
                                        >
                                          <option defaultValue="selected">Please Select</option>
                                          {roomType &&
                                            roomType.map((ele) => {
                                              return (
                                                <option key={ele.room_id} value={ele.room_type}>
                                                  {ele.room_type}
                                                </option>
                                              );
                                            })}
                                        </Input>
                                      </FormGroup>
                                    </Col>
                                    <Col md="6">
                                      <FormGroup>
                                        <Label>
                                          Room Number<span className="required"> *</span>
                                        </Label>
                                        <Input
                                          name="room_number"
                                          value={newContactDataNew && newContactDataNew.room_number}
                                          onChange={handleAddNewContactNew}
                                          type="select"
                                        >
                                          <option defaultValue="selected">Please Select</option>
                                          {bookingHistory &&
                                            bookingHistory.map((ele) => {
                                              return (
                                                <option key={ele.room_id} value={ele.roomNumber}>
                                                  {ele.roomNumber}
                                                </option>
                                              );
                                            })}
                                        </Input>
                                      </FormGroup>
                                    </Col>
                                    <Col md="6">
                                      <FormGroup>
                                        <Label>No of Person</Label>
                                        <Input
                                          type="text"
                                          onChange={handleAddNewContactNew}
                                          value={newContactDataNew && newContactDataNew.capacity}
                                          name="capacity"
                                        />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </Form>
                              </CardBody>
                            </Col>
                          </Row>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            className="shadow-none"
                            color="primary"
                            onClick={() => {
                              AddNewContactNew();
                              addContactToggleNew();
                            }}
                          >
                            Submit
                          </Button>
                          <Button
                            color="secondary"
                            className="shadow-none"
                            onClick={addContactToggleNew.bind(null)}
                          >
                            Cancel
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </FormGroup>
                  </Col>

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
                          <th>Room Change</th>
                          <th>Room Type</th>
                          <th>Room Price</th>
                          <th>Total Amount</th>
                          <th>Grant Total</th>
                          <th>Check In Date</th>
                          <th>Check In Time</th>
                          <th>Room Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomDetails.map((room) => (
                          <tr key={room.room_id}>
                            <td>{room.room_number}</td>
                            {room?.room_change_status !== 'Cancel' ? (
                              room?.status === 'Check In' ? (
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
                              )
                            ) : (
                              <td>Room Changed</td>
                            )}

                            {room?.room_change_status !== 'Cancel' ? (
                              room?.status === 'Check In' ? (
                                <td>
                                  <div className="anchor">
                                    <span
                                      onClick={() => {
                                        setSelectedRoom(room);
                                        addContactToggle();
                                      }}
                                    >
                                      Room Change
                                    </span>
                                  </div>
                                  <Modal
                                    size="lg"
                                    isOpen={addContactModal}
                                    toggle={addContactToggle}
                                  >
                                    <ModalHeader toggle={addContactToggle}>
                                      Changing Room
                                    </ModalHeader>
                                    <ModalBody>
                                      {loading ? (
                                        <div className="text-center my-3">
                                          <Spinner color="primary" />
                                        </div>
                                      ) : (
                                        <Row>
                                          <Col md="12">
                                            <CardBody>
                                              <Form>
                                                <Row>
                                                  <Col md="6">
                                                    <FormGroup>
                                                      <Label>
                                                        Room Type
                                                        <span className="required"> *</span>
                                                      </Label>
                                                      <Input
                                                        name="room_type"
                                                        value={newContactData?.room_type || ''}
                                                        onChange={handleAddNewContact}
                                                        type="select"
                                                      >
                                                        <option value="">Please Select</option>
                                                        {roomType?.map((ele) => (
                                                          <option
                                                            key={ele.room_id}
                                                            value={ele.room_type}
                                                          >
                                                            {ele.room_type}
                                                          </option>
                                                        ))}
                                                      </Input>
                                                    </FormGroup>
                                                  </Col>
                                                  <Col md="6">
                                                    <FormGroup>
                                                      <Label>
                                                        Room Number
                                                        <span className="required"> *</span>
                                                      </Label>
                                                      <Input
                                                        name="room_number"
                                                        value={newContactData?.room_number || ''}
                                                        onChange={handleAddNewContact}
                                                        type="select"
                                                      >
                                                        <option value="">Please Select</option>
                                                        {bookingHistory?.map((ele) => (
                                                          <option
                                                            key={ele.room_id}
                                                            value={ele.roomNumber}
                                                          >
                                                            {ele.roomNumber}
                                                          </option>
                                                        ))}
                                                      </Input>
                                                    </FormGroup>
                                                  </Col>
                                                </Row>
                                              </Form>
                                            </CardBody>
                                          </Col>
                                        </Row>
                                      )}
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        className="shadow-none"
                                        color="primary"
                                        onClick={() => AddNewContact(selectedRoom)}
                                      >
                                        Submit
                                      </Button>
                                      <Button
                                        color="secondary"
                                        className="shadow-none"
                                        onClick={addContactToggle}
                                      >
                                        Cancel
                                      </Button>
                                    </ModalFooter>
                                  </Modal>
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
                              )
                            ) : (
                              <td>{room.room_change_from} to {room.room_change_to}</td>
                            )}

                            <td>{room.room_type}</td>
                            <td>{room.amount}</td>
                            <td>{room.qty * room.amount}</td>
                            <td>{room.grand_total}</td>
                            <td>{moment(room.check_in_date).format('DD-MM-YYYY')}</td>
                            <td>{room.check_in_time}</td>
                            <td>{room.room_change_status}</td>
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
