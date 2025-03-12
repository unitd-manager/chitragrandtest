
import axios from 'axios'

const api = axios.create({
 baseURL: 'https://chitragrandtest.unitdtechnologies.com:2078',
// baseURL: 'http://localhost:6007',

});

export default api