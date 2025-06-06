import React, { useState, useEffect } from 'react';
import { Row, Col, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Deductions({
  payroll,
  handleInputs,
  handleDeductions,
  setLoanPaymentHistoryModal,
  totalMonthPay,
}) {
  // Initialize totalDeductions with the default value

  Deductions.propTypes = {
    payroll: PropTypes.object,
    handleDeductions: PropTypes.func,
    handleInputs: PropTypes.func,
    totalMonthPay: PropTypes.any,
    setLoanPaymentHistoryModal: PropTypes.func,
  };

  
  // Function to calculate the total deduction based on default values
  const [totalDeductionsAmount, setTotalDeductionsAmount] = useState(0);


  // Use useEffect to update totalDeductions whenever relevant fields change
  useEffect(() => {
    const cpfEmployee = parseFloat(payroll.cpf_employee || 0) ;
    const incomeTaxAmount = parseFloat(payroll.income_tax_amount || 0) ;
    const loanAmount = parseFloat(payroll.loan_amount || 0) ;
    const deduction1 = parseFloat(payroll.deduction1 || 0) ;
    const deduction2 = parseFloat(payroll.deduction2 || 0) ;
    const deduction3 = parseFloat(payroll.deduction3 || 0) ;
    const deduction4 = parseFloat(payroll.deduction4 || 0) ;
    const sdl = parseFloat(payroll.sdl || 0) ;
    const payEucf = parseFloat(payroll.pay_eucf || 0) ;
    const payCdac = parseFloat(payroll.pay_cdac || 0) ;
    const payMbmf = parseFloat(payroll.pay_mbmf || 0) ;
    const paySinda = parseFloat(payroll.pay_sinda || 0);

    const newGrossPay =
    cpfEmployee +
    incomeTaxAmount +
    loanAmount +
    deduction1 +
    deduction2 +
    deduction3 +
    deduction4 +
    sdl +
    payEucf +
    payCdac+
    payMbmf +
    paySinda;

    setTotalDeductionsAmount(newGrossPay);
  }, [
    payroll.cpf_employee,
    payroll.income_tax_amount,
    payroll.loan_amount,
    payroll.deduction1,
    payroll.deduction2,
    payroll.deduction3,
    payroll.deduction4,
    payroll.sdl,
    payroll.pay_eucf,
    payroll.pay_cdac,
    payroll.pay_mbmf,
    payroll.pay_sinda,
  ]);


  const [totalDedAmount, setTotalDedAmount] = useState(0);

  useEffect(() => {
    const totalMonthPayss = parseFloat(totalMonthPay || (payroll && payroll.total_basic_pay_for_month)) || 0;
    const totalDeductionsss = parseFloat(totalDeductionsAmount || 0) ;
    const reimbursement = parseFloat(payroll.reimbursement || 0) ;
    const directorFee = parseFloat(payroll.director_fee || 0) ;

    
    const newNetTotalPay =
    totalMonthPayss -
    totalDeductionsss +
    reimbursement +
    directorFee;

    setTotalDedAmount(newNetTotalPay);
  }, [totalMonthPay || (payroll && payroll.total_basic_pay_for_month),totalDeductionsAmount,payroll.reimbursement,payroll.director_fee]);

  return (
    <div>
        <Row>
                <Col md="9">CPF-Employee</Col>
                <Col md="3">
                  <Input
                    disabled
                    name="cpf_employee"
                    type="text"
                    value={payroll && payroll.cpf_employee}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9"> SDL</Col>
                <Col md="3">
                  <Input
                    name="sdl"
                    type="text"
                    value={payroll && payroll.sdl}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.cpf_employee,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">
                  Advance / Loan{' '}
                  <Link to=""
                    onClick={() => {
                      setLoanPaymentHistoryModal(true);
                    }}
                  >
                    View loan breakup
                  </Link>
                </Col>
                <Col md="3">
                  <Input
                    name="loan_amount"
                    type="text"
                    value={payroll && payroll.loan_amount}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.cpf_employee,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Income Tax</Col>
                <Col md="3">
                  <Input
                    name="income_tax_amount"
                    type="text"
                    value={payroll && payroll.income_tax_amount}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.cpf_employee,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Housing</Col>
                <Col md="3">
                  <Input
                    name="deduction1"
                    type="text"
                    value={payroll && payroll.deduction1}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.cpf_employee,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Transportation</Col>
                <Col md="3">
                  <Input
                    name="deduction2"
                    type="text"
                    value={payroll && payroll.deduction2}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.cpf_employee,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Others</Col>
                <Col md="3">
                  <Input
                    name="deduction3"
                    type="text"
                    value={payroll && payroll.deduction3}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.cpf_employee,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">Food</Col>
                <Col md="3">
                  <Input
                    name="deduction4"
                    type="text"
                    value={payroll && payroll.deduction4}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.cpf_employee,
                        payroll.sdl,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9">
                  <br></br>
                </Col>
                <Col md="3"></Col>
              </Row>
              {payroll && payroll.govt_donation ==='pay_eucf' && <Row>
                <Col md="9">Pay EUCF</Col>
                <Col md="3">
                  <Input
                    name="pay_eucf"
                    type="text"
                    value={payroll && payroll.pay_eucf}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.cpf_employee,
                        payroll.pay_cdac,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>}
              {payroll && payroll.govt_donation ==='pay_sinda' && <Row>
                <Col md="9">Pay SINDA</Col>
                <Col md="3">
                  <Input
                    name="pay_sinda"
                    type="text"
                    value={payroll && payroll.pay_sinda}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.cpf_employee,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_mbmf
                        
                      );
                    }}
                  />
                </Col>
              </Row>}
              {payroll && payroll.govt_donation ==='pay_cdac' && <Row>
                <Col md="9">Pay CDAC</Col>
                <Col md="3">
                  <Input
                    name="pay_cdac"
                    type="text"
                    value={payroll && payroll.pay_cdac}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.cpf_employee,
                        payroll.pay_eucf,
                        payroll.pay_mbmf,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>}
              {payroll && payroll.govt_donation ==='pay_mbmf' && <Row>
                <Col md="9">Pay MBMF</Col>
                <Col md="3">
                  <Input
                    name="pay_mbmf"
                    type="text"
                    value={payroll && payroll.pay_mbmf}
                    onChange={(e) => {
                      handleInputs(e);
                      handleDeductions(
                        e.target.value,
                        payroll.income_tax_amount,
                        payroll.loan_amount,
                        payroll.deduction1,
                        payroll.deduction2,
                        payroll.deduction3,
                        payroll.deduction4,
                        payroll.sdl,
                        payroll.cpf_employee,
                        payroll.pay_eucf,
                        payroll.pay_cdac,
                        payroll.pay_sinda
                      );
                    }}
                  />
                </Col>
              </Row>}
              <Row>
                <Col md="9">
                  <b>Total Deductions</b>
                </Col>
                <Col md="3">
                  <Input
                    disabled
                    name="total_deductions"
                    type="text"
                    value={totalDeductionsAmount}
                    onChange={handleInputs}
                  />
                </Col>
              </Row>
              <Row>
                <Col md="9"></Col>
                <Col md="3"></Col>
              </Row>
              <Row>
                <Col md="9"></Col>
                <Col md="3">
                  <Input name="" type="text" onChange={handleInputs} />
                </Col>
              </Row>
              <Row>
                <Col md="9"></Col>
                <Col md="3">
                  <Input name="" type="text" onChange={handleInputs} />
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <Input value={totalDedAmount} disabled />
                </Col>
                <Col md="3"></Col>
              </Row>
    </div>
  )
}

export default Deductions