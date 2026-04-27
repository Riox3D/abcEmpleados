import {api} from "src/boot/axios";

export default {

    getDatosFicha(EmpleadoID){
        return api.get('/sql/ficha/get-datosFicha/'+EmpleadoID);
    },
    getProyectos(){
        return api.get('/sql/ficha/get-proyectos');
    }
   
}