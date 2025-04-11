import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  ModalBody,
  ModalFooter,
  Modal,
  ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import message from '../Message';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../views/form-editor/editor.scss';

import api from '../../constants/api';

const ContactEditModal = ({
  contactData,
  editContactEditModal,
  setEditContactEditModal,
  roomStatus,
  fetchRoomDetails,
}) => {
  ContactEditModal.propTypes = {
    contactData: PropTypes.object,
    editContactEditModal: PropTypes.bool,
    setEditContactEditModal: PropTypes.func,
    roomStatus: PropTypes.array,
    fetchRoomDetails: PropTypes.func,
  };

  const [contactinsert, setContactInsert] = useState(null);

  const handleInputs = (e) => {
    setContactInsert({ ...contactinsert, [e.target.name]: e.target.value });
  };

  const parseValue = (value) => (value ? parseFloat(value) || 0 : 0);

  useEffect(() => {
    setContactInsert(contactData);
  }, [contactData]);

  useEffect(() => {
    if (contactinsert) {
      const TotalAmount = parseValue(contactinsert.qty) * parseValue(contactinsert.amount);
      const ExtraAmount = parseValue(contactinsert.extra_person) * parseValue(contactinsert.extra_person_amount);
      const WaterAmount = parseValue(contactinsert.water_qty) * parseValue(contactinsert.water_amount);
      const RestaurantAmount = parseValue(contactinsert.restaurant_service_amount);
      const Discount = parseValue(contactinsert.discount);
      const GrandTotal = TotalAmount + ExtraAmount + WaterAmount + RestaurantAmount - Discount;
      setContactInsert((prevState) => ({
        ...prevState,
        grand_total: GrandTotal,
      }));
    }
  }, [
    contactinsert?.qty,
    contactinsert?.amount,
    contactinsert?.extra_person,
    contactinsert?.extra_person_amount,
    contactinsert?.water_qty,
    contactinsert?.water_amount,
    contactinsert?.restaurant_service_amount,
    contactinsert?.discount,
  ]);

  const editOrderItemUpdate = async () => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to update this Booking?");
      if (!isConfirmed) return;

      const orderItem = {
        booking_service_id: contactinsert.booking_service_id,
        order_id: contactinsert.order_id,
        unit_price: contactinsert.amount,
        cost_price: contactinsert.amount * (contactinsert.qty || 1),
        item_title: contactinsert.room_type,
        qty: contactinsert.qty || 1,
        grand_total: contactinsert.grand_total,
      };

      const response = await api.post('/finance/editorderItem', orderItem);

      if (response.status === 200) {
        alert("Order has been updated successfully.");
        fetchRoomDetails(contactinsert.booking_id);
      } else {
        alert("Failed to update order item.");
      }
    } catch (error) {
      console.error("Error updating order item:", error);
      alert("Failed to update order item.");
    }
  };

  const editContactsData = () => {
    api
      .post('/booking/edit-Booking-History', contactinsert)
      .then(() => {
        message('Record edited successfully', 'success');
        fetchRoomDetails(contactinsert.booking_id);
        const LogHistory = {
          booking_id: contactinsert.booking_id,
          action_type: 'Water qty',
          contact_id: contactData.contact_id,
          description: `${contactinsert?.room_number} Total Water Bottles ${contactinsert?.water_qty}`,
        };
        
  
        api.post('/booking/insertLogHistory', LogHistory)
        editOrderItemUpdate();
        setEditContactEditModal(false);
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  return (
    <Modal size="lg" isOpen={editContactEditModal}>
      <ModalHeader>
        Rooms Details
        <Button
          color="secondary"
          onClick={() => setEditContactEditModal(false)}
        >
          X
        </Button>
      </ModalHeader>

      <ModalBody>
        <Row>
          <Col md="12" className="mb-3">
            <h5 className="border-bottom pb-1">Room Details</h5>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label>Room Type</Label>
              <Input name="room_type" value={contactinsert?.room_type || ''} onChange={handleInputs} type="select" disabled>
                <option>Please Select</option>
                {roomStatus?.map((ele) => (
                  <option key={ele.room_id} value={ele.room_type}>{ele.room_type}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>

          <Col md="6">
            <FormGroup>
              <Label>Room Number</Label>
              <Input type="text" value={contactinsert?.room_number || ''} name="room_number" disabled />
            </FormGroup>
          </Col>

          <Col md="12" className="mb-3">
            <h5 className="border-bottom pb-1 mt-3">Billing Details</h5>
          </Col>

          {[
            ['Days', 'qty'],
            ['Room Price', 'amount'],
            ['Extra Person', 'extra_person'],
            ['Per Person Price', 'extra_person_amount'],
            ['Water Qty', 'water_qty'],
            ['Per Water', 'water_amount'],
            ['Total Person', 'capacity'],
            ['Food Service Amount', 'restaurant_service_amount'],
            ['Discount', 'discount'],
          ].map(([label, name]) => (
            <Col md="6" >
              <FormGroup>
                <Label>{label}</Label>
                <Input
                  type="number"
                  onChange={handleInputs}
                  value={contactinsert?.[name] || ''}
                  name={name}
                  className="text-end"
                />
              </FormGroup>
            </Col>
          ))}
            {/* <Col md="6">
  <FormGroup>
    <Label>Water Qty</Label>
    <div className="d-flex align-items-center">
      <Button
        color="secondary"
        size="sm"
        onClick={() =>
          setContactInsert((prevState) => ({
            ...prevState,
            water_qty: Math.max(parseValue(prevState?.water_qty) - 1, 0),
          }))
        }
      >
        -
      </Button>
      <Input
        type="number"
        name="water_qty"
        value={contactinsert?.water_qty || 0}
        onChange={handleInputs}
        className="mx-2 text-end"
        style={{ width: '80px' }}
        min="0"
      />
      <Button
        color="secondary"
        size="sm"
        onClick={() =>
          setContactInsert((prevState) => ({
            ...prevState,
            water_qty: parseValue(prevState?.water_qty) + 1,
          }))
        }
      >
        +
      </Button>
    </div>
  </FormGroup>
</Col>

            <Col md="6">
              <FormGroup>
                <Label>Per Water</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert?.water_amount || ''}
                  name="water_amount"
                />
              </FormGroup>
            </Col> */}

          <Col md="12" className="mt-4">
            <div className="p-3 border rounded bg-light">
              <h5 className="mb-3">Billing Summary</h5>
              <Row>
                <Col md="6">Room Amount:</Col>
                <Col md="6" className="text-end">₹{parseValue(contactinsert?.qty) * parseValue(contactinsert?.amount)}</Col>

                <Col md="6">Extra Person Charges:</Col>
                <Col md="6" className="text-end">₹{parseValue(contactinsert?.extra_person) * parseValue(contactinsert?.extra_person_amount)}</Col>

                <Col md="6">Water Charges:</Col>
                <Col md="6" className="text-end">₹{parseValue(contactinsert?.water_qty) * parseValue(contactinsert?.water_amount)}</Col>

                <Col md="6">Food Service Amount:</Col>
                <Col md="6" className="text-end">₹{parseValue(contactinsert?.restaurant_service_amount)}</Col>

                <Col md="6">Discount:</Col>
                <Col md="6" className="text-end">₹{parseValue(contactinsert?.discount)}</Col>

                <Col md="12"><hr /></Col>

                <Col md="6"><strong>Grand Total:</strong></Col>
                <Col md="6" className="text-end fw-bold">₹{contactinsert?.grand_total || 0}</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={editContactsData}>Submit</Button>
        <Button color="secondary" onClick={() => setEditContactEditModal(false)}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ContactEditModal;
