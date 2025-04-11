import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

export default function FinanceDeliveryAddress({ financeDetails, handleInputs }) {
  FinanceDeliveryAddress.propTypes = {
    financeDetails: PropTypes.object,
    handleInputs: PropTypes.func,
  };
  return (
    <Form>
      <FormGroup>
        <Row>
          <Col md="3">
            <FormGroup>
              <Label> Company Name </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={financeDetails && financeDetails.cust_company_name}
                name="cust_company_name"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label> Address 1 </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={financeDetails && financeDetails.cust_address1}
                name="cust_address1"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label> Address 2 </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={financeDetails && financeDetails.cust_address2}
                name="cust_address2"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>State</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={financeDetails && financeDetails.cust_address_state}
                name="cust_address_state"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label> Country </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={financeDetails && financeDetails.cust_address_country}
                name="cust_address_country"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label> Postal Code </Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={financeDetails && financeDetails.cust_address_po_code}
                name="cust_address_po_code"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <Label>Gst No</Label>
              <Input
                type="text"
                onChange={handleInputs}
                value={financeDetails && financeDetails.cust_gst_no}
                name="cust_gst_no"
              />
            </FormGroup>
          </Col>
        </Row>
      </FormGroup>
    </Form>
  );
}
