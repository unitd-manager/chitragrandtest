import { Row, Col } from 'reactstrap';
import Booking from '../smartconTables/Booking';


const Classic = () => {
  return (
    <>
      {/*********************Sales Overview ************************/}
      <Row>
        <Col lg="12">
          <Booking></Booking>
       </Col>
       </Row>
           </>
  );
};

export default Classic;
