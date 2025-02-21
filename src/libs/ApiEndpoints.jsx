import { smartAlert } from "../utils/Helper";
import ApiService from "./ApiService";


export const getRewardsBalance = async (data = {}) => {
    if(data == null || Object.keys(data).length == 0){
      return false
    }
    const payloadUrl = `/publisher/getRewardBalance`;
    const method = "POST";
    const payload = {...data}
    let res = await ApiService.fetchData(payloadUrl, method, payload);
    let result = false
    if (res && (res.status_code == 200 || res.status == 200)) {
        let data = res.results;
        result = data
    }else{
      smartAlert({title: "Error", message: res?.message,type: 2});
    }
    return result
}
