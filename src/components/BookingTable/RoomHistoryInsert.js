import React from 'react';
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
import * as Icon from 'react-feather';

export default function RoomHistoryInsert({
  setContactData,
  setEditContactEditModal,
  deleteRecord,
  contactsDetails,
  addContactToggle,
  addContactModal,
  handleAddNewContact,
  newContactData,
  AddNewContact,
  roomStatus,
}) {
  RoomHistoryInsert.propTypes = {
    setContactData: PropTypes.func,
    setEditContactEditModal: PropTypes.func,
    deleteRecord: PropTypes.func,
    contactsDetails: PropTypes.any,
    addContactToggle: PropTypes.func,
    addContactModal: PropTypes.bool,
    handleAddNewContact: PropTypes.func,
    newContactData: PropTypes.object,
    AddNewContact: PropTypes.func,
    roomStatus: PropTypes.func,
  };
  //  Table Contact
  const columns = [
    {
      name: 'id',
      selector: 'room_history_id',
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
    {
      name: 'Del',
      selector: 'delete',
      cell: () => <Icon.Trash />,
      grow: 0,
      width: 'auto',
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
      name: 'Floor Number',
      selector: 'floor_number',
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: 'Room Status',
      selector: 'room_status',
      sortable: true,
      grow: 0,
    },
    {
      name: 'Available',
      selector: 'is_available',
      sortable: true,
      width: 'auto',
      grow: 3,
    },
  ];
  return (
    <Form>
      <Row>
        <Col md="3">
          <FormGroup>
            <Button color="primary" className="shadow-none" style={{backgroundColor:'green'}} onClick={addContactToggle.bind(null)}>
              Add New{' '}
            </Button>
            <Modal size="lg" isOpen={addContactModal} toggle={addContactToggle.bind(null)}>
              <ModalHeader toggle={addContactToggle.bind(null)}>New Contact</ModalHeader>
              <ModalBody>
                <Row>
                  <Col md="12">
                    <CardBody>
                      <Form>
                        <Row>
                          <Col md="6">
                            <FormGroup>
                              <Label>Room Number</Label>
                              <Input
                                type="text"
                                onChange={handleAddNewContact}
                                value={newContactData && newContactData.room_number}
                                name="room_number"
                              />
                            </FormGroup>
                          </Col>

                          <Col md="6">
                            <FormGroup>
                              <Label>Floor Number</Label>
                              <Input
                                type="text"
                                onChange={handleAddNewContact}
                                value={newContactData && newContactData.floor_number}
                                name="floor_number"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label>
                                Room Status <span className="required"> *</span>
                              </Label>
                              <Input
                                name="room_status"
                                value={newContactData && newContactData.room_status}
                                onChange={handleAddNewContact}
                                type="select"
                              >
                                <option defaultValue="selected">Please Select</option>
                                {roomStatus &&
                                  roomStatus.map((ele) => {
                                    return (
                                      <option key={ele.valuelist_id} value={ele.value}>
                                        {ele.value}
                                      </option>
                                    );
                                  })}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label>Available</Label>
                              <br></br>
                              <Label>Yes</Label>
                              <Input
                                name="is_available"
                                value="Yes"
                                type="radio"
                                defaultChecked={
                                  newContactData && newContactData.is_available === 'yes' && true
                                }
                                onChange={handleAddNewContact}
                              />

                              <Label>No</Label>
                              <Input
                                name="is_available"
                                value="No"
                                type="radio"
                                defaultChecked={
                                  newContactData && newContactData.is_available === 'No' && true
                                }
                                onChange={handleAddNewContact}
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
                  <tr key={element.room_history_id}>
                    <td>{i + 1}</td>
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
                    <td>
                      <div color="primary" className="anchor">
                        <span onClick={() => deleteRecord(element.room_history_id)}>
                          <Icon.Trash2 />
                        </span>
                      </div>
                    </td>
                    <td>{element.room_number}</td>
                    <td>{element.floor_number}</td>
                    <td>{element.room_status}</td>
                    <td>{element.is_available}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Row>
    </Form>
  );
}
