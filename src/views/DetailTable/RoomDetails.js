import React, { useState,useEffect } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';

const RoomsDetails = () => {
  //Navigation and Parameter Constants
  const navigate = useNavigate();

  //Logic for adding category in db
  const [roomsForms, setRoomsForms] = useState({
    room_type: '',
  });

  //setting data in roomsForms
  const handleRoomsForms = (e) => {
    setRoomsForms({ ...roomsForms, [e.target.name]: e.target.value });
  };

  //Api for insertRoom
  const insertRoom = () => {
    if (roomsForms.room_type !== '') {
      roomsForms.creation_date = creationdatetime;
      api
        .post('/booking/insertRooms', roomsForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Room Type inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/RoomEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all Room Type field', 'warning');
    }
  };

  const [roomType, setroomType] = useState();

  const getValuelist = () => {
    api
      .get('/booking/get-ValueListRoom')
      .then((res) => {
        setroomType(res.data.data);
      })
      .catch(() => {
        message('valuelist not found', 'info');
      });
  };

  useEffect(() => {
    getValuelist();
  }, []);

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <Row>
        <Col md="6">
          <ComponentCard title="Key Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label>
                        Room Type <span className="required"> *</span>
                      </Label>
                      <Input
                        name="room_type"
                        value={roomsForms && roomsForms.room_type}
                        onChange={handleRoomsForms}
                        type="select"
                      >
                        <option defaultValue="selected">Please Select</option>
                        {roomType &&
                          roomType.map((ele) => {
                            return (
                              <option key={ele.valuelist_id} value={ele.value}>
                                {ele.value}
                              </option>
                            );
                          })}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        insertRoom();
                      }}
                      type="button"
                      className="btn mr-2 shadow-none"
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => {
                        navigate(-1);
                      }}
                      type="button"
                      className="btn btn-dark shadow-none"
                    >
                      Go to List
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};
export default RoomsDetails;
