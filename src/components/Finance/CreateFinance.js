import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Form,
} from 'reactstrap';
import PropTypes from 'prop-types';
import api from '../../constants/api';
import message from '../Message';

const CreateFinance = ({ financeModal, setFinanceModal, bookingId,getOrdersById }) => {
  CreateFinance.propTypes = {
    financeModal: PropTypes.bool,
    setFinanceModal: PropTypes.func,
    bookingId: PropTypes.any,
    getOrdersById:PropTypes.func,
  };

  const [OrdersDetails, setCreateOrder] = useState();
  const [bookingServicename, setBookingServiceName] = useState();

  const handleInserts = (e) => {
    setCreateOrder({ ...OrdersDetails, [e.target.name]: e.target.value });
  };

  const getCompanyById = () => {
    api
      .post('/booking/getBookingById', { booking_id: bookingId })
      .then((res) => {
        setCreateOrder(res.data.data);
      })
      .catch(() => {
       // message('Costing Summary not found', 'info');
      });
  };

  const getServiceLinked = () => {
    api
      .post('/booking/getBookingHisrtoryById', { booking_id: bookingId })
      .then((res) => {
        setBookingServiceName(res.data.data);
      })
      .catch(() => {
        // message('service linked not found', 'info');
      });
  };

console.log('bookingServicename',bookingServicename)
  //Insert order for finance module
  const insertOrder = () => {
    OrdersDetails.booking_id = bookingId;
  
    api
      .post("/finance/insertOrder", OrdersDetails)
      .then((res) => {
        const insertedId = res.data.data.insertId;
  
        // Create an array of promises for order items
        const orderItemPromises = bookingServicename.map((item) => {
          const orderItem = {
            contact_id: item.contact_id, 
            order_id: insertedId,
            unit_price: item.amount,
            cost_price: item.amount* item.qty,
            item_title: item.room_type,
            qty: item.qty,
            booking_id: item.booking_id,
            booking_service_id: item.booking_service_id,
          };
  
          console.log("Order item:", orderItem);
  
          return api.post("/finance/insertorder_item", orderItem);
        });
  
        // Execute all order item inserts, then update booking status
        return Promise.all(orderItemPromises)
          // .then(() => {
          //   const bookingStatus = { status: "Completed" ,booking_id:bookingId};
          //   return api.post("/booking/edit-Booking_status", bookingStatus);
          // });
      })
      .then(() => {
        getOrdersById(); // Fetch updated order data after completion
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error inserting order:", error);
        message("Network connection error.");
      });
  };
  
  useEffect(() => {
    getCompanyById();
    getServiceLinked()
  }, []);
  return (
    <>
      <Modal size="lg" isOpen={financeModal}>
        <ModalHeader> Create Order </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Form>
              <FormGroup>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Company name</Label>
                      <Input
                        type="text"
                        onChange={handleInserts}
                        value={OrdersDetails && OrdersDetails.cust_company_name}
                        name="cust_company_name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Address 1</Label>
                      <Input
                        type="text"
                        onChange={handleInserts}
                        value={OrdersDetails && OrdersDetails.cust_address1}
                        name="cust_address1"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Address 2</Label>
                      <Input
                        type="text"
                        onChange={handleInserts}
                        value={OrdersDetails && OrdersDetails.cust_address2}
                        name="cust_address2"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Country</Label>
                      <Input
                        type="text"
                        onChange={handleInserts}
                        value={OrdersDetails && OrdersDetails.cust_address_country}
                        name="cust_address_country"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Postal Code</Label>
                      <Input
                        type="text"
                        onChange={handleInserts}
                        value={OrdersDetails && OrdersDetails.cust_address_po_code}
                        name="cust_address_po_code"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Order Date</Label>
                      <Input
                        type="date"
                        onChange={handleInserts}
                        value={OrdersDetails && OrdersDetails.order_date}
                        name="order_date"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Project</Label>
                      <Input
                        type="select"
                        name="record_type"
                        onChange={handleInserts}
                        value={OrdersDetails && OrdersDetails.record_type}
                      >
                        <option value="">Select</option>
                        <option value="New">Project</option>
                        <option value="Quoted">Tenancy Project</option>
                        <option value="Awarded">Tenancy Work</option>
                        <option value="Awarded">Maintenance</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Status </Label>
                      <Input
                        type="select"
                        name="order_status"
                        defaultValue={OrdersDetails && OrdersDetails.status}
                        onChange={handleInserts}
                      >
                        <option value="">Please Select</option>
                        <option defaultValue="selected" value="WIP">
                          WIP
                        </option>
                        <option value="Billable">Billable</option>
                        <option value="Billed">Billed</option>
                        <option value="Complete">Complete</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Latest">Latest</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      type="button"
                      color="primary"
                      className="btn shadow-none mr-2"
                      onClick={() => {
                        setFinanceModal(false);
                        insertOrder();
                      }}
                    >
                      Save & Continue
                    </Button>
                    <Button
                      className="shadow-none"
                      color="secondary"
                      onClick={() => {
                        setFinanceModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </FormGroup>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateFinance;
