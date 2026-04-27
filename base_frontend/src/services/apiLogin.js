import {api} from "src/boot/axios";

export default {
    postLoginGoogle(body){
        return api.post('/auth/login',body);
    },
    postAD(body){
        return api.post('/auth/loginAD',body);
    },
    getMenu(){
        return api.get('/auth/menu');
    }
    

}