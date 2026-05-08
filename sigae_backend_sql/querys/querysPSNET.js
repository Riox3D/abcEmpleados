export const querysPSNET = {
  getCatalogoEmpleados: `
  SELECT pernumemp claveEmpleado, trim(PERNOMCOMPLETO) nombreEmpleado
  FROM psnet.rc_lotus3@PSNETDB rc
  WHERE  perestado = 'A' and pertipoemp in ('01','02','03','04','05','13','15','18','90')`
,
 };