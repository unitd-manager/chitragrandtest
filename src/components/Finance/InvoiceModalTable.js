import React from 'react';
import { Col, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

const CreateReceipt = ({ invoiceData, handleInputs }) => {
  CreateReceipt.propTypes = {
    invoiceData: PropTypes.object,
    handleInputs: PropTypes.func,
  };
  return (
    <>
     <Col md="4">
                      <FormGroup>
                        <Label>Invoice Code</Label>
                        <Input
                          type="text"
                          value={invoiceData && invoiceData.invoice_code}
                          onChange={handleInputs}
                          name="invoice_code"
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    {/* <Col md="4">
                      <FormGroup>
                        <Label>Discount</Label>
                        <Input
                          type="text"
                          value={invoiceData && invoiceData.discount}
                          onChange={handleInputs}
                          name="discount"
                        />
                      </FormGroup>
                    </Col> */}
                  
                    <Col md="4">
                      <FormGroup>
                        <Label>Invoice date</Label>
                        <Input
                          type="date"
                          value={moment(invoiceData && invoiceData.invoice_date).format(
                            'YYYY-MM-DD',
                          )}
                          onChange={handleInputs}
                          name="invoice_date"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="8">
                      <FormGroup>
                        <Label>Invoice Terms</Label>
                        <Input
                          type="textarea"
                          value={invoiceData && invoiceData.invoice_terms}
                          onChange={handleInputs}
                          name="invoice_terms"
                        />
                      </FormGroup>
                    </Col>
    </>
  );
};

export default CreateReceipt;
