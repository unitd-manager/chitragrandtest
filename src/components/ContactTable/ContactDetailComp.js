import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import ComponentCard from '../ComponentCard';

export default function ContactDetailComp({ contactDetails, handleInputs }) {
  ContactDetailComp.propTypes = {
    contactDetails: PropTypes.object,
    handleInputs: PropTypes.func,
  };
  return (
    <>
      <Form>
        <FormGroup>
          <ComponentCard title="Contact Details" creationModificationDate={contactDetails}>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>
                    Customer Name <span className="required"> *</span>
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.first_name}
                    name="first_name"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
                    Email
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.email}
                    name="email"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
                    Phone
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.phone}
                    name="phone"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label>
                    Mobile
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.mobile}
                    name="mobile"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
                    Address
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.address_area}
                    name="address_area"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
                   Address2
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.address_flat}
                    name="address_flat"
                   
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
                   Address State
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.address_state}
                    name="address_state"
                   
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
                   Address Street
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.address_street}
                    name="address_street"
                   
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
                  Postal Code
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.address_po_code}
                    name="address_po_code"
                   
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
                 Country
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.address_country}
                    name="address_country"
                   
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
               GST NO
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactDetails && contactDetails.gst_no}
                    name="gst_no"
                   
                  />
                </FormGroup>
              </Col>
            </Row>
          </ComponentCard>
         
        </FormGroup>
      </Form>
    </>
  );
}
