import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons/js/buttons.print';
import api from '../../constants/api';

const BookingHistory = ({location}) => {
  BookingHistory.propTypes = {
    location: PropTypes.object,
  };
  //const { pathname } = location;
  //state variable
  const [success,setSuccess] = useState(false);
  const [error,setError] = useState(false);
console.log('setSuccess',setSuccess);
console.log(setError)
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location?.search);
    const query = urlSearchParams.get("token")? urlSearchParams.get("token"):null;
    const q = query!==null ?query:'';
  console.log('urlSearchParams',urlSearchParams)
  console.log('query',query)
    const token=q.replaceAll('"', '');
    console.log('token',token)
    api
        .post("commonApi/resetVerification", {  resetToken: token })
        .then(() => {
          setSuccess(true)

        })
        .catch((err) => {
          setError(true)
          console.log(err);
        });
  }, []);
 
 
  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
        
         {success && 
        
        <div>
             <i className="checkmark order-i">✓</i>
        <h4  
        style={{ textAlign :"center", color:"green", fontSize: 30,fontStyle:'bold'}} >Your Mail is verfied Successfully </h4>
        </div>}
       {error && 
       <div>
       <h4>Your Account is not verified</h4>
       </div>} 
    
      </div>
    </div>
  );
};

export default BookingHistory;
