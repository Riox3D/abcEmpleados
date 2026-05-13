import { defineStore } from "pinia";
import { ref } from "vue";


export const useParams = defineStore("params", () => {
  //variables compartidas
  let estatus = ref({
    CREADA: 'Creada',
    ENVIADA: 'Enviada',
    ENVIADARH: 'Enviada RH',
    ENTERADORH: 'Enterado RH"',
    CANCELADA: 'Cancelada',
    RECHAZADA: 'Rechazada'
  });

  return {
    estatus

  }

});
