import { jsPDF } from "jspdf";
import cidesi from '../assets/cidesi.png';

async function generatePDFOS(data) {

    const textStyles = {
        title: { color: [0, 0, 0], fontSize: 8 , fontStyle: 'bold' },  // Rojo
        description: { color: [0, 0, 0], fontSize: 8, fontStyle: 'italic'  },  // Azul
        default: { color: [0, 0, 0], fontSize: 10 },  // Negro
        bitacora : { color: [0,0,0],fontSize: 6},
        subtitle : {color: [0,0,0], fontSize: 14, fontStyle:'bold'}
      };
    
      function setTextStyle(doc, style) {
        doc.setTextColor(...style.color);
        doc.setFontSize(style.fontSize);
        if (style.fontStyle) {
          doc.setFont('Helvetica', style.fontStyle);
      } else {
          doc.setFont('Helvetica', 'normal');
      }
      }
  // Crea un nuevo objeto jsPDF
  const doc = new jsPDF({
    orientation: 'portrait', // Orientación vertical
    unit: 'mm', // Unidad de medida en milímetros
    format: 'letter', // Tamaño de página carta
  });
 // const longText = data.vehiculo
  //const asunto = data.asunto;
  //const proyecto = data.proyecto;
  //const conductor =data.conductor;
  //const acompanantes =data.acompañantesLista;
  const width = 150;
  const width2 =110;
 // const lines = doc.splitTextToSize(longText, width);
  //const lines1 = doc.splitTextToSize(asunto, width);
 // const lines2 = doc.splitTextToSize(proyecto, width);
 // const lines3= doc.splitTextToSize(acompanantes, width);
  // const lines4= doc.splitTextToSize(conductor, width2);

  let y3=50;
  let y = 56; // Coordenada Y inicial
  const maxLines = 3; // Máximo número de líneas
  let startx=43;
  let y1 = 68;
  let y2 = 92;
  let y4=74;
  let y5=194;
  let y6 = 206;
  let y7=212;
  let y8=230;
  let y9=188;
  let coordx=0;
  let coordy=0;
  let coordh=0;
 // const truncatedLines = lines3.slice(0, maxLines);
// const lastLineIndex = truncatedLines.length - 1;
const lineHeight = 3; // Altura de línea

/* if (lines3.length > maxLines) {
  // Agrega puntos suspensivos en la última línea
  const lastLine = truncatedLines[lastLineIndex];
  truncatedLines[lastLineIndex] = lastLine.replace(/(.{0,35})[^\s]*$/, '$1 (...)'); // Ajusta el número 35 según el ancho disponible
}*/ 

  doc.setFont('Helvetica', 'bold');

  function agregarEncabezado(doc) {
    coordx=15;
    coordy=26;
    // Establece el tipo de letra a "arial"
   //m//doc.setFont('arial', 'bold');
   doc.addImage(cidesi, 'PNG', 15, 10, 30, 13);
   setTextStyle(doc,textStyles.subtitle)
   doc.text('CENTRO DE INGENIERIA Y DESARROLLO INDUSTRIAL', 50,  21);
   doc.setFillColor(47, 47, 78); // Establecer el color de relleno a negro
   doc.rect(coordx, coordy, 180, 9, 'F'); // 'F' indica que se debe rellenar el rectángulo
   doc.setTextColor(255);
   doc.text(`Registro de actividades : ${data.folio}`, 20,  32);
   setTextStyle(doc, textStyles.subtitle);
   doc.text('DATOS GENERALES',80,43);
  }

  function agregarBody(doc) {
    // Establece el tipo de letra a "arial"
   //m//doc.setFont('arial', 'bold');
   setTextStyle(doc,textStyles.title)
   doc.text('PLANEACIÓN : ', 20,  50);
   doc.text('PROYECTO : ', 20,  56);
   doc.text('GERENTE :', 20, 62);
   doc.text('FECHA INICIO :', 20,  68);
   doc.text('VALIDA DISPONIBLE :', 20,  74);
 

   setTextStyle(doc,textStyles.description)
   doc.text(`${data.idPlaneacion}`, 55,  50);
   doc.text(`${data.idProyecto}`, 55,  56);
   doc.text(`${data.gerenteProyecto}`, 55, 62);
   doc.text(`${data.fechaInicio}`, 55,  68);
   doc.text(`${data.validaDisponible}`, 55,  74);
   setTextStyle(doc,textStyles.title)

   doc.text('ESTATUS : ', 120,  50);
   //doc.text('MARCA :', 120,  68);
   doc.text('ADMINISTRADOR :', 120, 62);
   doc.text('FECHA FIN :', 120, 68);
   doc.text('PRESENTA BITÁCORA :', 120, 74);

   setTextStyle(doc,textStyles.description)
   doc.text(`${data.nombreEstatus}`, 156,  50);
   doc.text(`${data.adminProyecto}`, 156,  62);
   doc.text(`${data.fechaFin}`, 156, 68);
   doc.text(`${data.presentaBitacora}`, 156, 74);
  let lastTableY= 74;
  coordy+=19;
  coordh=(lastTableY-coordy)+5
   doc.rect(coordx, 45, 180, coordh ); // 'F' indica que se debe rellenar el rectángulo
   setTextStyle(doc, textStyles.subtitle);
   doc.text('OTROS DATOS',85,92);

lastTableY= 96+10;

   setTextStyle(doc,textStyles.title)
   doc.text('PRESUPUESTO HI : ',20, lastTableY);
   coordy=lastTableY-5;
   doc.text('GASTO ACTUAL : ',120,lastTableY);
      setTextStyle(doc,textStyles.description)

    doc.text(`${data.persupuestoHoraIngenieria}`,60, lastTableY);
   doc.text(`${data.gastoActual}`,163, lastTableY);
   lastTableY +=6;
   setTextStyle(doc,textStyles.title)
   doc.text('PRESUPUESTO ASIGNADO : ',20, lastTableY);
   doc.text('PRESUPUESTO DISPONIBLE : ',120, lastTableY);
   setTextStyle(doc,textStyles.description)
   doc.text(`${data.presupuestoAsignado}`,60, lastTableY);
   doc.text(`${data.presupuestoDisponible}`,163, lastTableY);
   lastTableY +=6;
    coordh=(lastTableY-coordy)

    doc.rect(coordx, coordy, 180, coordh, 'S'); // 'F' indica que se debe rellenar el rectángulo

/*
   setTextStyle(doc,textStyles.title)
   doc.text('PRESUPUESTO HI life: ', 20,  lastTableY + 6);
   doc.text('PRESUPUESTO ASIGNADO life: ', 20,  56);


      setTextStyle(doc,textStyles.description)
   doc.text(`${data.taller}`, 55,  50);
   doc.text(`${data.fechasalida}`, 55,  56);

   setTextStyle(doc,textStyles.title)
   doc.text('GASTO ACTUAL : ', 120,  50);
   //doc.text('MARCA :', 120,  68);
   doc.text('PRESUPUESTO DISPONIBLE :', 120, 62);

         setTextStyle(doc,textStyles.description)
   doc.text(`${data.taller}`, 55,  50);
   doc.text(`${data.fechasalida}`, 55,  56);
  // Datos de la tabla (Ejemplo)*/
  const tableHeaders = ['Descripción', 'Precio', 'Observaciones']; // Encabezado fijo
  //servicios.map(servicio => [servicio.descripcion || servicio.servicio , `$ ${servicio.subTotal || servicio.precio}`, servicio.observaciones]);
  const tableData = [
    ['Folio', 'Destino', 'Conductor'],
    ['12345', 'Madrid', 'Juan Pérez'],
    ['67890', 'Barcelona', 'Carlos Ruiz'],
    ['54321', 'Valencia', 'Ana González'],
   
  ];

  // Usar autoTable para crear la tabla
 /* autoTable(doc, {
    head: [tableHeaders],  // Encabezado de la tabla
    body: tableRows,  // Cuerpo de la tabla (todas las filas excepto la primera)
    startY: 100,  // Posición inicial Y, después del subtítulo "Servicios y Precios"
    theme: 'grid',  // Estilo de la tabla
    headStyles: { fillColor: [23, 48, 66], halign:'center',fontStyle:'bold'}, // Color de fondo de las cabeceras
    bodyStyles: { fillColor: [245, 245, 245] }, // Color de fondo de las celdas
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'center' },
      2: { halign: 'center' }
    }
 }); */


   lastTableY +=10;

  // let lastTableY = doc.lastAutoTable.finalY;
   // Subtítulo "Observaciones Generales"
   setTextStyle(doc, textStyles.subtitle);
   doc.text('DETALLE', 88, lastTableY);  
   //lastTableY +=20; // Espacio adicional de 10 unidades debajo de la tabla
 // Colocar las observaciones debajo del subtítulo
 const observaciones = "Aquí van las observaciones generales, que pueden ser de cualquier tamaño dependiendo de la información que quieras mostrar.";
 setTextStyle(doc,textStyles.description)
 //doc.text(`${observ}`, 20, lastTableY);
 lastTableY +=10;  // Espacio adicional de 20 unidades debajo del subtítulo
 
   setTextStyle(doc,textStyles.title)
   doc.text('CLAVE ACTIVIDAD : ',20, lastTableY);
   coordy=lastTableY-5;
   doc.text('NOMBRE ACTIVIDAD : ',120,lastTableY);
      setTextStyle(doc,textStyles.description)

    doc.text(`${data.cveActividad}`,65, lastTableY);
   doc.text(`${data.nombreActividad}`,163, lastTableY);
   lastTableY +=6;
   setTextStyle(doc,textStyles.title)
   doc.text('FECHA INICIO ACTIVIDAD : ',20, lastTableY);
   doc.text('FECHA FIN ACTIVIDAD : ',120, lastTableY);
   setTextStyle(doc,textStyles.description)
   doc.text(`${data.fechaInicio}`,65, lastTableY);
   doc.text(`${data.fechaFin}`,163, lastTableY);
   lastTableY +=6;
   setTextStyle(doc,textStyles.title)
   doc.text('COSTO PLANEADO ACTIVIDAD : ',20, lastTableY);
   doc.text('GASTO ACTUAL ACTIVIDAD : ',120, lastTableY);
   setTextStyle(doc,textStyles.description)
   doc.text(`${data.costoPlaneadoActividad}`,65, lastTableY);
   doc.text(`${data.gastoActualActividad}`,163, lastTableY);
   lastTableY +=6;
coordh=(lastTableY-coordy)
    doc.rect(coordx, coordy, 180, coordh, 'S'); // 'F' indica que se debe rellenar el rectángulo


   lastTableY +=10;  // Espacio adicional de 20 unidades debajo del subtítulo

   setTextStyle(doc, textStyles.subtitle);
   doc.text('DATOS DEL USUARIO', 80, lastTableY);  
lastTableY +=10;  // Espacio adicional de 20 unidades debajo del subtítulo
 
   setTextStyle(doc,textStyles.title)
   doc.text('NÚMERO EMPLEADO : ',20, lastTableY);
   coordy=lastTableY-5
   doc.text('NOMBRE EMPLEADO : ',120,lastTableY);
      setTextStyle(doc,textStyles.description)

    doc.text(`${data.cveEmpleado}`,57, lastTableY);
   doc.text(`${data.nombreEmpleado}`,155, lastTableY);
   lastTableY +=6;
   setTextStyle(doc,textStyles.title)
   doc.text('COSTO INSTITUCIONAL : ',20, lastTableY);
   doc.text('HORAS ASIGNADAS : ',120, lastTableY);
   setTextStyle(doc,textStyles.description)
   doc.text(`${data.costroInstitucional}`,57, lastTableY);
   doc.text(`${data.horasAsignadas}`,155, lastTableY);
   lastTableY +=6;
   setTextStyle(doc,textStyles.title)
   doc.text('HORAS REALIZADAS : ',20, lastTableY);
   doc.text('HORAS DISPONIBLES : ',120, lastTableY);
   setTextStyle(doc,textStyles.description)
   doc.text(`${data.horasRealizadas}`,57, lastTableY);
   doc.text(`${data.horasDisponibles}`,155, lastTableY);
   lastTableY +=6;
  
  coordh=(lastTableY-coordy)
  
      doc.rect(coordx, coordy, 180, coordh, 'S'); // 'F' indica que se debe rellenar el rectángulo

  
  
  
  
  
  
  
  
  
   //

  // doc.text(`${data.refacciones}`, 85, lastTableY);
  /* if(data.factura){
    doc.text(`${data.factura}`, 160, lastTableY);

   }
   setTextStyle(doc,textStyles.title)
 //  doc.text(`${fact}`, 165, lastTableY);
*/


   //DATOS DE DB

   /*
    setTextStyle(doc,textStyles.description)
   doc.text(`${data.placa}`, 35,  50);
   lines.forEach(line => {
    doc.text(line, startx, y); // Agrega texto en la coordenada X=10, Y=y
    y += lineHeight; // Mueve la coordenada Y para la siguiente línea
  });
   doc.text(`${data.destino}`, 35,  62);
   lines1.forEach(line => {
    doc.text(line, 35, y1); // Agrega texto en la coordenada X=10, Y=y
    y1 += lineHeight; // Mueve la coordenada Y para la siguiente línea   doc.text('000QS0648 : INSPECCION NO DES', 40,  74);
   });
    lines2.forEach(line => {
      doc.text(line, 40, 74); // Agrega texto en la coordenada X=10, Y=y
      y4 += lineHeight; // Mueve la coordenada Y para la siguiente línea
    });
   doc.text(`${data.fechaSalida} ${' - '} ${data.horaSalida} `, 55,  80);
   doc.text(`${data.fechaRegreso} ${' - '} ${data.horaRegreso}`, 60,  86);
   truncatedLines.forEach((line, index) => {
    const x = index === 0 ? 48 : 48; // Cambia X solo en la primera línea
    doc.text(line, x, y2);
    y2 += lineHeight; // Mueve la coordenada Y para la siguiente línea
});
lines4.forEach(line => {
  doc.text(line, 145, y3); // Agrega texto en la coordenada X=10, Y=y
  y3 += lineHeight; // Mueve la coordenada Y para la siguiente línea   doc.text('000QS0648 : INSPECCION NO DES', 40,  74);
 });
   doc.text(`${data.numLicencia}`, 143,  56);
   doc.text(`${data.tipo}`, 135,  62);
   doc.text(`${data.vigen}`, 142,  68);
   doc.text(`${maquinaria}`, 187,  74);
   doc.text(`${data.peso}`, 137,  80);
   doc.text(`${data.alto}`, 137,  86);
   doc.text(`${data.ancho}`, 186,  80);
   doc.text(`${data.largo}`, 186,  86);
*/
/*
   //doc.text(`${conductor}`, 135, 108);
   setTextStyle(doc,textStyles.description)
// Depurar los valores
// Centrar el texto del solicitante en la posición 258 (parte central de la hoja)
const pageWidth = doc.internal.pageSize.getWidth(); // Ancho total de la hoja

// Texto del solicitante centrado
const textSolicitante = `${data.solicitante}`;
const textWidthSolicitante = doc.getStringUnitWidth(textSolicitante) * 12 / 72; // Ancho en mm
const xPositionSolicitante = (pageWidth - textWidthSolicitante) / 2.5; 
doc.text(textSolicitante, xPositionSolicitante, 258);

// Dibujar la línea centrada
const underlineText = '_____________________________________';
const underlineWidth = doc.getStringUnitWidth(underlineText) * 12 / 72; // Ancho en mm
const xPositionUnderline = (pageWidth - underlineWidth) / 2.8; 
doc.text(underlineText, xPositionUnderline, 262);

// Texto de la firma centrado
const signatureText = 'NOMBRE Y FIRMA DEL USUARIO SOLICIANTE';
const signatureWidth = doc.getStringUnitWidth(signatureText) * 12 / 72; // Ancho en mm
const xPositionSignature = (pageWidth - signatureWidth) / 2.9;
doc.text(signatureText, xPositionSignature, 268);

*/
 //  setTextStyle(doc,textStyles.description)
  // doc.text('BITÁCORA ELECTRÓNICA',20,125)
  // setTextStyle(doc,textStyles.bitacora)
  // doc.text('12/02/2024 09:09 - PEREZ LECONA ISRAEL: Solicitud Aprobada',20,129)
  // doc.text('12/02/2024 09:02 - QUÑONES RIOS FRANCISCO JAVIER: Solicitud Aprobada',20,133)
   

   
 // doc.addImage(qrCodeDataUrl, 'PNG', 180, 250, 20, 20);

  }
/*
  function agrergarFootter (doc){
    doc.addImage(cidesi, 'PNG', 15, 147, 30, 13);
    setTextStyle(doc,textStyles.subtitle)
    doc.text('CENTRO DE INGENIERIA Y DESARROLLO INDUSTRIAL', 50,  157);
    doc.setFillColor(47, 47, 78); // Establecer el color de relleno a negro
    doc.rect(15, 162, 180, 9, 'F'); // 'F' indica que se debe rellenar el rectángulo
    doc.setTextColor(255);
    doc.text(`FOLIO : ${data.folio}`, 20,  168);
    setTextStyle(doc, textStyles.subtitle);
    doc.text('Datos de la Solicitud Vehicular',70,180);
  }

  function bodyfooter (doc){
    setTextStyle(doc,textStyles.title)
   doc.text('PLACAS : ', 20,  188);
   doc.text('DESCRIPCION : ', 20,  194);
   doc.text('DESTINO :', 20,  200);
   doc.text('ASUNTO :', 20,  206);
   doc.text('PROYECTO :', 20,  212);
   doc.text('FECHA Y HORA SALIDA :', 20,  218);
   doc.text('FECHA Y HORA REGRESO :', 20, 224);
   doc.text('ACOMPAÑANTES :', 20, 230);

   doc.text('CONDUCTOR : ', 125,  188);
   doc.text('LICENCIA : ', 125,  194);
   doc.text('TIPO :', 125,  200);
   doc.text('VIGENCIA :', 125,  206);
   doc.text('¿ TRANSPORTA EQUIPO O MAQUINARIA? :', 125, 212);
   doc.text('PESO :', 125, 218);
   doc.text('ANCHO :', 160, 218);
   doc.text('ALTO :', 125, 224);
   doc.text('LARGO :', 160, 224);

   //DATOS DE DB
    setTextStyle(doc,textStyles.description)
   doc.text(`${data.placa}`, 35,  188);
   lines.forEach(line => {
    doc.text(line, 45, y5); // Agrega texto en la coordenada X=10, Y=y
    y5 += lineHeight; // Mueve la coordenada Y para la siguiente línea
  });
  doc.text(`${data.destino}`, 35,  200);
  lines1.forEach(line => {
    doc.text(line, 38, y6); // Agrega texto en la coordenada X=10, Y=y
    y6 += lineHeight; // Mueve la coordenada Y para la siguiente línea   doc.text('000QS0648 : INSPECCION NO DES', 40,  74);
   });
   lines2.forEach(line => {
    doc.text(line, 38, 212); // Agrega texto en la coordenada X=10, Y=y
    y7 += lineHeight; // Mueve la coordenada Y para la siguiente línea
  });
  doc.text(`${data.fechaSalida} ${' - '} ${data.horaSalida} `, 60,  218);
  doc.text(`${data.fechaRegreso} ${' - '} ${data.horaRegreso}`, 60,  224);
  truncatedLines.forEach((line, index) => {
    const x = index === 0 ? 50 : 50; // Cambia X solo en la primera línea
    doc.text(line, 50, y8);
    y8 += lineHeight; // Mueve la coordenada Y para la siguiente línea
});



   lines4.forEach(line => {
    doc.text(line, 147, 188); // Agrega texto en la coordenada X=10, Y=y
    y9 += lineHeight; // Mueve la coordenada Y para la siguiente línea   doc.text('000QS0648 : INSPECCION NO DES', 40,  74);
   });
   doc.text(`${data.numLicencia}`, 143,  194);
   doc.text(`${data.tipo}`, 135,  200);
   doc.text(`${data.vigen}`, 142,  206);
   doc.text(`${maquinaria}`, 187,  212);
   doc.text(`${data.peso}`, 137,  218);
   doc.text(`${data.alto}`, 137,  224);
   doc.text(`${data.ancho}`, 186,  218);
   doc.text(`${data.largo}`, 186,  224);


   setTextStyle(doc,textStyles.description)
   doc.text(`${conductor}`, 135, 243);
   setTextStyle(doc,textStyles.title)
   doc.text('_____________________________________',40,245)
   doc.text('NOMBRE Y FIRMA DEL VIGILANTE QUE REPORTA',35,250)
   doc.text('_____________________________________',127,245)
   doc.text('NOMBRE Y FIRMA DEL USUARIO',132,250)

   setTextStyle(doc,textStyles.description)
 //  doc.text('BITÁCORA ELECTRÓNICA',20,258)
   setTextStyle(doc,textStyles.bitacora)
 //  doc.text('12/02/2024 09:09 - PEREZ LECONA ISRAEL: Solicitud Aprobada',20,262)
  // doc.text('12/02/2024 09:02 - QUÑONES RIOS FRANCISCO JAVIER: Solicitud Aprobada',20,266)
   doc.setFontSize(15);
   doc.text('COPIA DEL SOLICITANTE',20,273)

   
   doc.addImage(qrCodeDataUrl, 'PNG', 175, 254, 20, 20);
  }

  doc.setFontSize(20);
  doc.text('------------------------------------------------------------------------------',15,144)
*/
  agregarEncabezado(doc);
  agregarBody(doc);
  //agrergarFootter(doc);
  //bodyfooter(doc);

  return doc.output('arraybuffer');

}

export {
  generatePDFOS
}