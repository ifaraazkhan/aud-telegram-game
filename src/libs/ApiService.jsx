import { CustomConfig } from "../utils/config";
import { GetCookie, smartAlert } from "../utils/Helper";
class ApiService {
    static fetchData = async (url = null, method = null, data = {},options = {}) => {
        const  {formType ="", apiUrl = '', tpUrl=null, signal = null, isFileRequest = false, fileUpload = false} = options
        const EndPointUrl = CustomConfig.API_URL;
        if(!url && !method){
          return false
        }
        try {
            let formData = new FormData();
            if(formType === 'form'){
                formData = data
            }else{
                formData = JSON.stringify(data)
            }
            
            let config = {
                method: method,
                headers: {}
            }
            if(method === 'POST' || method === 'PATCH' || method === 'DELETE' || method === 'PUT'){
                config.body = formData
            }
            isFileRequest && (config.responseType = 'stream')
            signal && (config.signal = signal);
            formType !== 'form' && (config.headers = {'Content-Type': 'application/json'});
            
            
            if(CustomConfig && CustomConfig.access_token){
              const authToken = `Bearer ${CustomConfig.access_token}`
              config['headers']['Authorization'] = authToken
            }
            let endPoint = `${apiUrl !== '' ? apiUrl : EndPointUrl}${url}`;
          const response = await fetch(endPoint,config);
          let res = await response.json();
          res.status = response.status
          if(response.status !== 200){
            if(response.status === 440){
            }
          }
          return res
        }
        catch (err) {
          console.log(err);
          smartAlert({title: "Network Error", message: `${err} ${apiUrl !== '' ? apiUrl : EndPointUrl}${url}`,type: 2});
          // Alert.alert("err",`${apiUrl !== '' ? apiUrl : process.env.EXPO_PUBLIC_API_URL}${url}`)
        }
    }
}

export default ApiService