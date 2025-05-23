import React, { useState, useEffect } from 'react';
import { Row, Col, Input } from 'reactstrap';
import PropTypes from 'prop-types';

function Earnings({
    payroll,
  handleInputs,
  handleEarnings,
  handleOtAmount,
  otAmount
}) {
    Earnings.propTypes = {
    payroll: PropTypes.object,
    handleEarnings: PropTypes.func,
    handleInputs: PropTypes.func,
    handleOtAmount: PropTypes.func,
    otAmount: PropTypes.any,
  };

  const [grossPay, setGrossPay] = useState(0);

  // Calculate and update Gross Pay whenever relevant fields change
  useEffect(() => {
    const basicPay = parseFloat(payroll.basic_pay) || 0;
    const allowance1 = parseFloat(payroll.allowance1) || 0;
    const allowance2 = parseFloat(payroll.allowance2) || 0;
    const allowance3 = parseFloat(payroll.allowance3) || 0;
    const allowance4 = parseFloat(payroll.allowance4) || 0;
    const allowance5 = parseFloat(payroll.allowance5) || 0;
    const otAmountValue = parseFloat(otAmount || (payroll && payroll.ot_amount)) || 0;

    const newGrossPay =
      basicPay +
      allowance1 +
      allowance2 +
      allowance3 +
      allowance4 +
      allowance5 +
      otAmountValue;

    setGrossPay(newGrossPay);
  }, [payroll.basic_pay, payroll.allowance1, payroll.allowance2, payroll.allowance3, payroll.allowance4, payroll.allowance5, otAmount || (payroll && payroll.ot_amount)]);


  return (
    <div>
        <Row>
                <Col md="9">Gross Pay</Col>{' '}
                <Col md="3">
                  <Input
                    disabled
                    name="basic_pay"
                    type="text"
                    value={payroll && payroll.basic_pay}
                    onChange={(e) => {
                      handleInputs(e);
                      handleEarnings(
                        e.target.value,
                        payroll.ot_amount,
                        payroll.allowance1,
                        payroll.allowance2,
                        payroll.allowance3,
                        payroll.allowance4,
                        payroll.allowance5,
                        payroll.total_basic_pay_for_month,
                      );
                    }}
                  />
                </Col>{' '}
              </Row>
              <Row>
                <Col md="9">Overtime Pay Rate/ Hour</Col>
                <Col md="3">
                  <Input
                    name="overtime_pay_rate"
                    type="text"
                    value={payroll && payroll.overtime_pay_rate}
                    disabled
                    onChange={handleInputs}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">OT Hrs</Col>
                <Col md="3">
                  <Input
                    name="ot_hours"
                    type="text"
                    value={payroll && payroll.ot_hours}
                    onChange={(e) => {
                      handleInputs(e);
                      handleOtAmount(e.target.value, payroll.overtime_pay_rate);
                      
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Overtime Amount</Col>
                <Col md="3">
                  <Input
                    name="ot_amount"
                    type="text"
                    value={otAmount || (payroll && payroll.ot_amount)}
                    onChange={(e) => {
                      handleInputs(e);
                      handleEarnings(
                        e.target.value,
                        payroll.basic_pay,
                        payroll.allowance1,
                        payroll.allowance2,
                        payroll.allowance3,
                        payroll.allowance4,
                        payroll.allowance5,
                        payroll.total_basic_pay_for_month,
                      );
                    }}
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Transport</Col>
                <Col md="3">
                  <Input
                    name="allowance1"
                    type="text"
                    value={payroll && payroll.allowance1}
                    onChange={(e) => {
                      handleInputs(e);
                      handleEarnings(
                        e.target.value,
                        payroll.basic_pay,
                        payroll.ot_amount,
                        payroll.allowance2,
                        payroll.allowance3,
                        payroll.allowance4,
                        payroll.allowance5,
                        payroll.total_basic_pay_for_month,
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Entertainment</Col>
                <Col md="3">
                  <Input
                    name="allowance2"
                    type="text"
                    value={payroll && payroll.allowance2}
                    onChange={(e) => {
                      handleInputs(e);
                      handleEarnings(
                        e.target.value,
                        payroll.basic_pay,
                        payroll.allowance1,
                        payroll.ot_amount,
                        payroll.allowance3,
                        payroll.allowance4,
                        payroll.allowance5,
                        payroll.total_basic_pay_for_month,
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Food</Col>
                <Col md="3">
                  <Input
                    name="allowance3"
                    type="text"
                    value={payroll && payroll.allowance3}
                    onChange={(e) => {
                      handleInputs(e);
                      handleEarnings(
                        e.target.value,
                        payroll.basic_pay,
                        payroll.allowance1,
                        payroll.allowance2,
                        payroll.ot_amount,
                        payroll.allowance4,
                        payroll.allowance5,
                        payroll.total_basic_pay_for_month,
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Shift Allowance</Col>
                <Col md="3">
                  <Input
                    name="allowance4"
                    type="text"
                    value={payroll && payroll.allowance4}
                    onChange={(e) => {
                      handleInputs(e);
                      handleEarnings(
                        e.target.value,
                        payroll.basic_pay,
                        payroll.allowance1,
                        payroll.allowance2,
                        payroll.allowance3,
                        payroll.ot_amount,
                        payroll.allowance5,
                        payroll.total_basic_pay_for_month,
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Others</Col>
                <Col md="3">
                  <Input
                    name="allowance5"
                    type="text"
                    value={payroll && payroll.allowance5}
                    onChange={(e) => {
                      handleInputs(e);
                      handleEarnings(
                        e.target.value,
                        payroll.basic_pay,
                        payroll.allowance1,
                        payroll.allowance2,
                        payroll.allowance3,
                        payroll.allowance4,
                        payroll.ot_amount,
                        payroll.total_basic_pay_for_month,
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">
                  <b>Gross Pay</b>
                </Col>
                <Col md="3">
                  <Input
                    name="total_basic_pay_for_month"
                    type="text"
                    value={grossPay} // Use the calculated grossPay value here
            onChange={(e) => {
              // Update the basic_pay when needed
              handleInputs(e);
         
            }}
          
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">
                  <b>Other Additional Payment</b>
                </Col>
                <Col md="3"></Col>
              </Row>
              <Row>
                <Col md="9">Reimbursement</Col>
                <Col md="3">
                  <Input
                    name="reimbursement"
                    type="text"
                    value={payroll && payroll.reimbursement}
                    onChange={handleInputs}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Director Fees</Col>
                <Col md="3">
                  <Input
                    name="director_fee"
                    type="text"
                    value={payroll && payroll.director_fee}
                    onChange={handleInputs}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">
                  <b>NET PAY</b>
                </Col>
                <Col md="3"></Col>
              </Row>
    </div>
  )
}

export default Earnings