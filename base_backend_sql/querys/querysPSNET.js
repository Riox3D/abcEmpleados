export const querysPSNET = {
    user: `SELECT 
    PERNUMEMP,
    TRIM(PERPUESTODSC) AS PERPUESTODSC,
    TRIM(TSINFO) AS TSINFO,
    PERIDJEFE,
    TRIM(PERESPECIALIDAD) AS PERESPECIALIDAD,
    TRIM(CORJEF) AS CORJEF,
    TRIM(PERNOMCOMPLETO) AS PERNOMCOMPLETO,
    TRIM(PERNOMJEFECOMPLETO) AS PERNOMJEFECOMPLETO,
    TRIM(PERGERENCIADSC) AS PERGERENCIADSC,
    TRIM(PERDIRECCIONDSC) AS PERDIRECCIONDSC,
    PERINGRESOCENTRO,
    TRIM(UNIFIS)
  FROM PSNET.RC_LOTUS3
  WHERE PERESTADO = 'A'
  AND TRIM(TSINFO) = :correo`,

  userCorreo: `SELECT 
    TRIM(TSINFO) AS TSINFO
  FROM PSNET.RC_LOTUS3
  WHERE PERESTADO = 'A'
  AND TRIM(PERNUMEMP) = :numEmp`,

  empleadosPL:`SELECT pernumemp, trim(PERNOMCOMPLETO) PERNOMCOMPLETO, perunidad, perdireccion, 
pergerencia, user_admivo.getequivalenciaarea(pergerencia) gerenciaBaan,  percostins, 
pertipoemp, user_admivo.getequivalenciatipoemp(pertipoemp) tipoEmpBaan, 
        peridjefe,
CASE 
   WHEN perunidad = 'Q' THEN  'QUERETARO'
   WHEN perunidad = 'M' THEN 'NUEVO LEON'
   WHEN perunidad = 'G' THEN 'GUANAJUATO'
   WHEN perunidad = 'C' THEN 'CAMPECHE'
   WHEN perunidad = 'E' THEN 'EDO DE MEXICO'
   WHEN perunidad = 'B' THEN 'BAJA CALIFORNIA'
   ELSE 'NA'
END HUNIFIS
FROM  PSNET.RC_LOTUS3 rc
WHERE  perestado = 'A'
and pertipoemp in ('01','02','03','04','05','13','15','18','90')
AND pernumemp = :numEmp
order by pernomcompleto
`
 }