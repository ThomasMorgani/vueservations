import axios from 'axios'
import { apiSettings } from '@/.env.local.js'

export default {
  callApi(uri, postData) {
    //console.log(uri);
    //console.log(postData);
    let url = apiSettings.baseUrl + uri
    if (postData) {
      //MOVE THIS TO A SEPERATE API CALL FUNCTION: uploadApi
      // const params = new URLSearchParams();
      // for (let key in postData) {
      //   params.append(key, postData[key]);
      // }
      axios.defaults.withCredentials = true
      return (
        axios
          // .post(url, params, this.axiosDefaultPostOptions)
          .post(url, { data: postData }, this.axiosDefaultOptions)
          .then(data => {
            // //console.log(data)
            //TODO: CHANGE
            if (data.data === 'unfound19') {
              // router.push({ name: 'Login' })
            } else {
              return data.data
            }
          })
          .catch(err => {
            return err
          })
      )
    } else {
      return axios
        .get(url, this.axiosDefaultPostOptions)
        .then(response => {
          if (response) {
            if (this.isHttpError(response.status)) {
              //console.log('request error');
              //console.log(response);
              return false
            } else {
              return response.data
            }
          }
          // //console.log(data)
          // if (response.data === 'unfound19') {
          //   // router.push({ name: 'Login' })
          // } else {
          //   return response.data
          // }
        })
        .catch(err => {
          return err
        })
    }
  },
  postApi(uri, postData) {
    //console.log(uri);
    //console.log(postData);
    let url = apiSettings.baseUrl + uri
    //MOVE THIS TO A SEPERATE API CALL FUNCTION: uploadApi
    // const params = new URLSearchParams();
    // for (let key in postData) {
    //   params.append(key, postData[key]);
    // }
    axios.defaults.withCredentials = true
    return (
      axios
        // .post(url, params, this.axiosDefaultPostOptions)
        .post(url, postData, this.axiosPostOptions)
        .then(data => {
          // //console.log(data)
          //TODO: CHANGE
          if (data.data === 'unfound19') {
            // router.push({ name: 'Login' })
          } else {
            return data.data
          }
        })
        .catch(err => {
          return err
        })
    )
  },
  isHttpError(statusCode) {
    const acceptedStatusCodes = [200, 304]
    return !acceptedStatusCodes.includes(statusCode)
  },
  axiosPostOptions() {
    axios.defaults.withCredentials = true
    var options = {
      mode: 'no-cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      credentials: 'include'
    }
    return options
  },
  axiosUploadOptions() {
    axios.defaults.withCredentials = true
    var options = {
      mode: 'no-cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true,
      credentials: 'include'
    }
    return options
  }
}
