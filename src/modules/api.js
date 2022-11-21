import axios from 'axios'

export default {
  callApi(uri, postData) {
    console.log(process)
    let url = process.env.VUE_APP_API_URL + uri
    //remove trailing slash
    if (url[url.length - 1] === '/') url = url.slice(0, -1)
    if (postData) {
      //MOVE THIS TO A SEPERATE API CALL FUNCTION: uploadApi
      // const params = new URLSearchParams();
      // for (let key in postData) {
      //   params.append(key, postData[key]);
      // }
      axios.defaults.withCredentials = true
      return axios
        .post(url, { data: postData }, this.axiosDefaultOptions)
        .then(data => {
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
    } else {
      return axios
        .get(url, this.axiosDefaultPostOptions)
        .then(response => {
          if (response) {
            if (this.isHttpError(response.status)) {
              return false
            } else {
              return response.data
            }
          }
        })
        .catch(err => {
          return err
        })
    }
  },
  postApi(uri, postData) {
    let url = process.env.VUE_APP_API_URL + uri
    //MOVE THIS TO A SEPERATE API CALL FUNCTION: uploadApi
    // const params = new URLSearchParams();
    // for (let key in postData) {
    //   params.append(key, postData[key]);
    // }
    axios.defaults.withCredentials = true
    return axios
      .post(url, postData, this.axiosPostOptions)
      .then(data => {
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
