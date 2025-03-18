
import axios from 'axios'

const api = axios.create({
 baseURL: 'https://chitragrandtest.unitdtechnologies.com:2501',
        // baseURL: 'http://localhost:6007',

});

export default api