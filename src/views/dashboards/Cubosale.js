import { Row, Col } from 'reactstrap';
// import Booking from '../smartconTables/Booking';
import Hotel3 from "../../components/dashboard/classicDashboard/Hotel3"; 
// import Hotel4 from "../../components/dashboard/classicDashboard/Hotel4"; 
// import Hotel5 from "../../components/dashboard/classicDashboard/Hotel5"; 




const Classic = () => {
  return (
    <>
      {/*********************Sales Overview ************************/}
      <Row>
        <Col lg="12">
          <Hotel3></Hotel3>
          {/* <Hotel4></Hotel4> */}
          {/* <Hotel5></Hotel5> */}

       </Col>
       </Row>
           </>
  );
};

export default Classic;
