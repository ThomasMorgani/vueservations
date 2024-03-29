export { apiSettings, firebaseSettings }

//All Urls should include trailing forward slash (/)
const apiSettings = {
  appUrl: '/', //URL OF CLIENT WEB APP
  authUrl: '/', //URL OF AUTH ENDPOINT
  baseUrl: '/', //BASE URL OF API REQUESTS
  fqdn: '/', //BASE FQDN
  mediaUrl: '/images/' //BASE URL FOR WHERE IMAGES ARE SERVED
}

const firebaseSettings = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
}
