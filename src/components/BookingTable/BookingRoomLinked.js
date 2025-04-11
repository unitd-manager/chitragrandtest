import React, { useState, useEffect } from 'react';
import {
  Row,
  Form,
  ModalFooter,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Label,
  Input,
  Col,
  FormGroup,
  Button,
  CardBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as Icon from 'react-feather';
import api from '../../constants/api';

export default function BookingRoomLinked({
  setContactData,
  setEditContactEditModal,
  setEditContactViewModal,
  // deleteRecord,
  contactsDetails,
  addContactToggle,
  addContactModal,
  handleAddNewContact,
  newContactData,
  AddNewContact,
  roomStatus,
  bookingHistory,
  bookingDetails,
  orderId,
  editOrderItemUpdate,
  RoomVacate,
  id,
  getOrdersById,
  contactAddress,
  CheckOutRoomwise,
  statusCheck,
}) {
  BookingRoomLinked.propTypes = {
    setContactData: PropTypes.func,
    setEditContactEditModal: PropTypes.func,
    setEditContactViewModal: PropTypes.func,
    // deleteRecord: PropTypes.func,
    contactsDetails: PropTypes.any,
    addContactToggle: PropTypes.func,
    addContactModal: PropTypes.bool,
    handleAddNewContact: PropTypes.func,
    newContactData: PropTypes.object,
    AddNewContact: PropTypes.func,
    roomStatus: PropTypes.func,
    bookingHistory: PropTypes.object,
    bookingDetails: PropTypes.object,
    orderId: PropTypes.any,
    editOrderItemUpdate: PropTypes.any,
    RoomVacate: PropTypes.any,
    id: PropTypes.any,
    getOrdersById: PropTypes.func,
    contactAddress: PropTypes.object,
    CheckOutRoomwise: PropTypes.func,
    statusCheck: PropTypes.func,
  };

  const [isLoading, setIsLoading] = useState(false);

  //  Table Contact
  const columns = [
    {
      name: 'id',
      selector: 'booking_service_id',
      grow: 0,
      wrap: true,
      width: '4%',
    },
    {
      name: 'Edit',
      selector: 'edit',
      cell: () => <Icon.Edit2 />,
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    // {
    //   name: 'Del',
    //   selector: 'delete',
    //   cell: () => <Icon.Trash />,
    //   grow: 0,
    //   width: 'auto',
    //   wrap: true,
    // },
    {
      name: 'Room Type',
      selector: 'room_type',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Room Number',
      selector: 'room_number',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Days',
    },
    {
      name: 'Room Amount',
    },
    {
      name: 'Total Amount',
    },
    {
      name: 'Check In Date',
    },
    {
      name: 'Check In Time',
    },
    {
      name: 'Check Out Date',
    },
    {
      name: 'Check Out Time',
    },
    {
      name: '',
    },
    {
      name: 'Action',
    },
  ];

  const [bookingServicename, setBookingServiceName] = useState();

  const getServiceLinked = () => {
    api
      .post('/booking/getBookingHisrtoryById', { booking_id: id })
      .then((res) => {
        setBookingServiceName(res.data.data);
      })
      .catch(() => {});
  };

  console.log('contactAddress', contactAddress);
  //Insert order for finance module
  const insertOrder = () => {
    const OrdersDetails = {
      booking_id: id,
      order_date: new Date().toLocaleDateString(),
      shipping_address1: contactAddress.address_flat,
      shipping_address_country: contactAddress.address_country,
      shipping_address2: contactAddress.address_street,
      shipping_address_state: contactAddress.address_state,
      shipping_address_po_code: contactAddress.address_po_code,
      cust_address1: contactAddress.address_flat,
      cust_address2: contactAddress.address_street,
      cust_address_state: contactAddress.address_state,
      cust_address_po_code: contactAddress.address_po_code,
      cust_address_country: contactAddress.address_country,
      order_status: 'Booking Confirm',
      shipping_first_name: contactAddress.first_name,
      cust_company_name: contactAddress.first_name,
      cust_gst_no: contactAddress.gst_no,
    };
    setIsLoading(true);

    api
      .post('/finance/insertOrder', OrdersDetails)
      .then((res) => {
        const insertedId = res.data.data.insertId;

        // Create an array of promises for order items
        const orderItemPromises = bookingServicename.map((item) => {
          const orderItem = {
            contact_id: item.contact_id,
            order_id: insertedId,
            unit_price: item.amount,
            cost_price: item.amount * item.qty,
            item_title: item.room_type,
            qty: item.qty,
            booking_id: item.booking_id,
            booking_service_id: item.booking_service_id,
          };

          console.log('Order item:', orderItem);

          return api.post('/finance/insertorder_item', orderItem);
        });

        // Execute all order item inserts, then update booking status
        return Promise.all(orderItemPromises);
        // .then(() => {
        //   const bookingStatus = { status: "Completed" ,booking_id:id};
        //   return api.post("/booking/edit-Booking_status", bookingStatus);
        // });
      })
      .then(() => {
        getOrdersById(); // Fetch updated order data after completion
        setIsLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error inserting order:', error);
      });
  };

  const editBookingData = async (roomNumber, serviceId) => {
    try {
      const res = await api.post('/booking/BookingHistoryRoomNumber', { room_number: roomNumber });

      if (!res.data.data || res.data.data.length === 0) {
        console.error('No room history data found');
        alert('No room history data found');
        return;
      }

      const statusInsert = {
        room_history_id: res.data.data[0].room_history_id,
        is_available: 'No',
      };

      await api.post('/booking/edit-Rooms-History-Edit', statusInsert);

      const serviceInsert = {
        booking_service_id: serviceId,
        is_available: 'No',
      };

      await api.post('/booking/edit-Booking-History_edit', serviceInsert);

      alert('Room Booked');
      window.location.reload();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking.');
    }
  };

  const editBookingCancel = async (roomNumber, serviceId) => {
    try {
      const res = await api.post('/booking/BookingHistoryRoomNumber', { room_number: roomNumber });

      if (!res.data.data || res.data.data.length === 0) {
        console.error('No room history data found');
        alert('No room history data found');
        return;
      }

      const statusInsert = {
        room_history_id: res.data.data[0].room_history_id,
        is_available: 'Yes',
      };

      await api.post('/booking/edit-Rooms-History-Edit', statusInsert);

      const serviceInsert = {
        booking_service_id: serviceId,
        is_available: 'Yes',
      };

      await api.post('/booking/edit-Booking-History_edit', serviceInsert);

      alert('Room Canceled');
      window.location.reload();
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Failed to cancel booking.');
    }
  };

  useEffect(() => {
    getServiceLinked();
  }, []);

  return (
    <Form>
      {isLoading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <p>Processing Check in...</p>
        </div>
      )}
      <Row>
        {!orderId && (
          <Col md="3">
            <FormGroup>
              <Button
                color="primary"
                className="shadow-none"
                style={{ backgroundColor: 'green' }}
                onClick={addContactToggle.bind(null)}
              >
                Add New{' '}
              </Button>
              <Modal size="lg" isOpen={addContactModal} toggle={addContactToggle.bind(null)}>
                <ModalHeader toggle={addContactToggle.bind(null)}>New Booking</ModalHeader>
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
                                  value={newContactData && newContactData.room_type}
                                  onChange={handleAddNewContact}
                                  type="select"
                                >
                                  <option defaultValue="selected">Please Select</option>
                                  {roomStatus &&
                                    roomStatus.map((ele) => {
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
                                  value={newContactData && newContactData.room_number}
                                  onChange={handleAddNewContact}
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
                                  onChange={handleAddNewContact}
                                  value={newContactData && newContactData.capacity}
                                  name="capacity"
                                />
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <Label>Check In Time</Label>
                                <Input
                                  type="time"
                                  value={newContactData?.check_in_time || ''}
                                  onChange={handleAddNewContact}
                                  name="check_in_time"
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
                      AddNewContact();
                      //addContactModal(false);
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    color="secondary"
                    className="shadow-none"
                    onClick={addContactToggle.bind(null)}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </FormGroup>
          </Col>
        )}

        {!orderId && (
          <Col md="3">
            {' '}
            <Button
              color="primary"
              className="shadow-none"
              onClick={() => {
                insertOrder();
              }}
            >
              Check In
            </Button>
          </Col>
        )}

        {!orderId ||
          (bookingDetails?.status !== 'Completed' && (
            <Col md="3">
              <Button
                color="danger"
                className="shadow-none"
                onClick={editOrderItemUpdate}
                style={{ marginBottom: 10 }} // Direct function reference
              >
                Update Booking
              </Button>
            </Col>
          ))}

        {!orderId ||
          (bookingDetails?.status !== 'Completed' && (
            <Col md="3">
              <Button
                color="danger"
                className="shadow-none"
                onClick={RoomVacate}
                style={{ marginBottom: 10 }} // Direct function reference
              >
                Check Out All Room
              </Button>
            </Col>
          ))}
      </Row>
      <Row>
        <Table id="example" className="display border border-secondary rounded">
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {contactsDetails &&
              contactsDetails.map((element, i) => {
                return (
                  <tr key={element.booking_service_id}>
                    <td>{i + 1}</td>
                    {element?.status === 'Check In' ? (
                      <td>
                        <div className="anchor">
                          <span
                            onClick={() => {
                              setContactData(element);
                              setEditContactEditModal(true);
                            }}
                          >
                            <Icon.Edit2 />
                          </span>
                        </div>
                      </td>
                    ) : (
                      <td>
                        <div className="anchor">
                          <span
                            onClick={() => {
                              setContactData(element);
                              setEditContactViewModal(true);
                            }}
                          >
                            View details
                          </span>
                        </div>
                      </td>
                    )}
                    {/* <td>
            <div color="primary" className="anchor">
              <span onClick={() => deleteRecord(element.booking_service_id)}>
                <Icon.Trash2 />
              </span>
            </div>
          </td> */}
                    <td>{element.room_type}</td>
                    <td>{element.room_number}</td>
                    <td>{element.qty}</td>
                    <td>{element.amount}</td>
                    <td>{element.qty * element.amount}</td>
                    <td>{element.check_in_date ? moment(element.check_in_date).format('DD-MM-YYYY'):''}</td>
                    <td>{element.check_in_time}</td>
                    <td>{element.check_out_date? moment(element.check_out_date).format('DD-MM-YYYY'):''}</td>
                    <td>{element.check_out_time}</td>
                    <td>
                      {/* {!orderId ||
          (bookingDetails?.status !== 'Completed' && ( */}

{orderId ? (
  element?.status === 'Check In' ? (
    <Button
      color="danger"
      className="shadow-none"
      onClick={() => {
        CheckOutRoomwise([element.room_number], element.booking_service_id, element.booking_id);
        statusCheck(element.booking_id);
      }}
    >
      Check Out Room
    </Button>
  ) : (
    <td>
      <span>Check Out Completed</span>
    </td>
  )
) : null}
                      {/* {element?.status === 'Check In' ? (
                        <Button
                          color="danger"
                          className="shadow-none"
                          // onClick={() =>
                          //   CheckOutRoomwise([element.room_number], element.booking_service_id)
                          // } // Wrapped room_number in array

                          onClick={() =>{
                            CheckOutRoomwise([element.room_number], element.booking_service_id,element.booking_id);
                            statusCheck(element.booking_id)
                           } }
                        >
                          Check Out Room
                        </Button>
                      ) : (
                        <td>
                          <span>Check Out Completed</span>
                        </td>
                      )} */}

                      {/* ))} */}
                    </td>

                    {orderId ? (
                      <td>
                        <text></text>
                      </td>
                    ) : element && String(element.is_available).toLowerCase() === 'yes' ? (
                      <td>
                        <Button
                          onClick={() => {
                            editBookingData(element.room_number, element.booking_service_id);
                            console.log('element', element);
                          }}
                        >
                          Confirm Room
                        </Button>
                      </td>
                    ) : (
                      <td>
                        <Button
                          onClick={() => {
                            editBookingCancel(element.room_number, element.booking_service_id);
                            console.log('element', element);
                          }}
                          style={{ backgroundColor: '#f54e5f' }}
                        >
                          Cancel Room
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Row>
    </Form>
  );
}
