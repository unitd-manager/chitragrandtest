import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';

export default function RoomDetailComp({ roomDetails, handleInputs, roomType }) {
  RoomDetailComp.propTypes = {
    roomDetails: PropTypes.object,
    handleInputs: PropTypes.func,
    roomType: PropTypes.object,
  };
  return (
    <>
      <Form>
        <FormGroup>
          <ComponentCard title="Room Details" creationModificationDate={roomDetails}>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>
                    Room Type <span className="required"> *</span>
                  </Label>
                  <Input
                    name="room_type"
                    value={roomDetails && roomDetails.room_type}
                    onChange={handleInputs}
                    type="select"
                    disabled
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
              <Col md="3">
                <FormGroup>
                  <Label>No of Member</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={roomDetails && roomDetails.capacity}
                    name="capacity"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Price</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={roomDetails && roomDetails.price_per_night}
                    name="price_per_night"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={roomDetails && roomDetails.description}
                    name="description"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>Max Extra Beds</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={roomDetails && roomDetails.max_extra_beds}
                    name="max_extra_beds"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Extra Bed Price</Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={roomDetails && roomDetails.extra_bed_price}
                    name="extra_bed_price"
                  />
                </FormGroup>
              </Col>
              {/* <Col md="3">
                <FormGroup>
                  <Label>Has Balcony</Label>
                  <br></br>
                  <Label>Yes</Label>
                  <Input
                    name="has_balcony"
                    value="1"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_balcony === 1 && true}
                    onChange={handleInputs}
                  />

                  <Label>No</Label>
                  <Input
                    name="has_balcony"
                    value="0"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_balcony === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Air Conditioning</Label>
                  <br></br>
                  <Label>Yes</Label>
                  <Input
                    name="has_air_conditioning"
                    value="1"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_air_conditioning === 1 && true}
                    onChange={handleInputs}
                  />
                  <br></br>
                  <Label>No</Label>
                  <Input
                    name="has_air_conditioning"
                    value="0"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_air_conditioning === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Wifi</Label>
                  <br></br>
                  <Label>Yes</Label>
                  <Input
                    name="has_wifi"
                    value="1"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_wifi === 1 && true}
                    onChange={handleInputs}
                  />

                  <Label>No</Label>
                  <Input
                    name="has_wifi"
                    value="0"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_wifi === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Tv</Label>
                  <br></br>
                  <Label>Yes</Label>
                  <Input
                    name="has_tv"
                    value="1"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_tv === 1 && true}
                    onChange={handleInputs}
                  />

                  <Label>No</Label>
                  <Input
                    name="has_tv"
                    value="0"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_tv === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Mini Fridge</Label>
                  <br></br>
                  <Label>Yes</Label>
                  <Input
                    name="has_mini_fridge"
                    value="1"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_mini_fridge === 1 && true}
                    onChange={handleInputs}
                  />

                  <Label>No</Label>
                  <Input
                    name="has_mini_fridge"
                    value="0"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_mini_fridge === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Safety Box</Label>
                  <br></br>
                  <Label>Yes</Label>
                  <Input
                    name="has_safety_box"
                    value="1"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_safety_box === 1 && true}
                    onChange={handleInputs}
                  />

                  <Label>No</Label>
                  <Input
                    name="has_safety_box"
                    value="0"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_safety_box === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Bath Tub</Label>
                  <br></br>
                  <Label>Yes</Label>
                  <Input
                    name="has_bath_tub"
                    value="1"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_bath_tub === 1 && true}
                    onChange={handleInputs}
                  />

                  <Label>No</Label>
                  <Input
                    name="has_bath_tub"
                    value="0"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_bath_tub === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Kitchenette</Label>
                  <br></br>
                  <Label>Yes</Label>
                  <Input
                    name="has_kitchenette"
                    value="1"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_kitchenette === 1 && true}
                    onChange={handleInputs}
                  />

                  <Label>No</Label>
                  <Input
                    name="has_kitchenette"
                    value="0"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_kitchenette === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Smoking Allowed</Label>
                  <br></br>
                  <Label>Yes</Label>
                  <Input
                    name="has_smoking_allowed"
                    value="1"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_smoking_allowed === 1 && true}
                    onChange={handleInputs}
                  />

                  <Label>No</Label>
                  <Input
                    name="has_smoking_allowed"
                    value="0"
                    type="radio"
                    defaultChecked={roomDetails && roomDetails.has_smoking_allowed === 0 && true}
                    onChange={handleInputs}
                  />
                </FormGroup>
              </Col> */}
            </Row>
          </ComponentCard>
        </FormGroup>
      </Form>
    </>
  );
}
