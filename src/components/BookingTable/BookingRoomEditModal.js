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
}) => {
  ContactEditModal.propTypes = {
    contactData: PropTypes.object,
    editContactEditModal: PropTypes.bool,
    setEditContactEditModal: PropTypes.func,
    roomStatus: PropTypes.array,
  };

  const [contactinsert, setContactInsert] = useState(null);

  const handleInputs = (e) => {
    setContactInsert({ ...contactinsert, [e.target.name]: e.target.value });
  };

  // Function to parse numeric values safely
  const parseValue = (value) => (value ? parseFloat(value) || 0 : 0);

  // Effect to set initial data
  useEffect(() => {
    setContactInsert(contactData);
  }, [contactData]);

  // Effect to update grand_total dynamically
  useEffect(() => {
    if (contactinsert) {
      const TotalAmount = parseValue(contactinsert.qty) * parseValue(contactinsert.amount);
      const ExtraAmount = parseValue(contactinsert.extra_person) * parseValue(contactinsert.extra_person_amount);
      const WaterAmount = parseValue(contactinsert.water_qty) * parseValue(contactinsert.water_amount);
      const RestaurantAmount = parseValue(contactinsert.restaurant_service_amount);

      // Compute the Grand Total
      const GrandTotal = TotalAmount + ExtraAmount + WaterAmount + RestaurantAmount;

      // Update only the grand_total field in the state
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
  ]);

  // Function to edit data in the database
  const editContactsData = () => {
    api
      .post('/booking/edit-Booking-History', contactinsert)
      .then(() => {
        message('Record edited successfully', 'success');
        setEditContactEditModal(false);
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  return (
    <>
      <Modal size="lg" isOpen={editContactEditModal}>
        <ModalHeader>
          Rooms Details
          <Button
            color="secondary"
            onClick={() => {
              setEditContactEditModal(false);
            }}
          >
            X
          </Button>
        </ModalHeader>

        <ModalBody>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label>
                  Room Type<span className="required"> *</span>
                </Label>
                <Input
                  name="room_type"
                  value={contactinsert?.room_type || ''}
                  onChange={handleInputs}
                  type="select"
                  disabled
                >
                  <option defaultValue="selected">Please Select</option>
                  {roomStatus &&
                    roomStatus.map((ele) => (
                      <option key={ele.room_id} value={ele.room_type}>
                        {ele.room_type}
                      </option>
                    ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label>Room Number</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert?.room_number || ''}
                  name="room_number"
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Days</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert?.qty || ''}
                  name="qty"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Room Price</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert?.amount || ''}
                  name="amount"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Room Amount</Label>
                <Input type="text" value={parseValue(contactinsert?.qty) * parseValue(contactinsert?.amount)} disabled />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Extra Person</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert?.extra_person || ''}
                  name="extra_person"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Per Person Price</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert?.extra_person_amount || ''}
                  name="extra_person_amount"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Extra Person Amount</Label>
                <Input type="text" value={parseValue(contactinsert?.extra_person) * parseValue(contactinsert?.extra_person_amount)} disabled />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Water Qty</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert?.water_qty || ''}
                  name="water_qty"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Per Water</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert?.water_amount || ''}
                  name="water_amount"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Water Amount</Label>
                <Input type="text" value={parseValue(contactinsert?.water_qty) * parseValue(contactinsert?.water_amount)} disabled />
              </FormGroup>
            </Col>
            <Col md="4">
            <FormGroup>
                <Label>Total Person</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert && contactinsert.capacity}
                  name="capacity"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Food Service Amount</Label>
                <Input
                  type="text"
                  onChange={handleInputs}
                  value={contactinsert?.restaurant_service_amount || ''}
                  name="restaurant_service_amount"
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Grand Total</Label>
                <Input
                  type="text"
                  value={contactinsert?.grand_total || 0}
                  name="grand_total"
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={editContactsData}>
            Submit
          </Button>
          <Button color="secondary" onClick={() => setEditContactEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ContactEditModal;
