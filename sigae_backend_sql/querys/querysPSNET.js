export const querysPSNET = {
  getCatalogoEmpleados: `
  SELECT pernumemp claveEmpleado, trim(PERNOMCOMPLETO) nombreEmpleado
  FROM psnet.rc_lotus3@PSNETDB rc
  WHERE  perestado = 'A' and pertipoemp in ('01','02','03','04','05','13','15','18','90')`
,
 getEmpleado: `SELECT pernumemp claveEmpleado, trim(PERNOMCOMPLETO) nombreEmpleado,  tsinfo correoEmpleado, perunidad claveSede, 

 CASE 
 
       WHEN perunidad = 'Q' THEN  'QUERETARO'
 
       WHEN perunidad = 'M' THEN 'NUEVO LEON'
 
       WHEN perunidad = 'G' THEN 'GUANAJUATO'
 
       WHEN perunidad = 'C' THEN 'CAMPECHE'
 
       WHEN perunidad = 'E' THEN 'EDO DE MEXICO'
 
       WHEN perunidad = 'B' THEN 'BAJA CALIFORNIA'
 
       ELSE 'NA'
 
    END descripcionSede, 
 
    perdireccion claveDireccion, PERDIRECCIONDSC descripcionDireccion, 
 
    pergerencia claveGerencia, PERGERENCIADSC descripcionGerencia, 
 
    percurp curpEmpleado, perissste isssteEmpleado, 
 
    pertipoemp clavetipoEmpleado, PERTIPEMPDESC descripcionTipoEmpleado, 
 
    peridjefe claveempleadoJefe, PERNOMJEFECOMPLETO  nombreCompletoJefe, corjef correoJefe
 
 FROM psnet.rc_lotus3@PSNETDB rc
 
 WHERE  perestado = 'A' 
 
 and pernumemp = :numEmpleado
 
 and pertipoemp in ('01','02','03','04','05','13','15','18','90')
 
 `
 ,
 };