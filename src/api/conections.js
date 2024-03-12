//url
const url = 'https://apiresidencial.azurewebsites.net'

//Fetch para realizar el login
const login = async (user, pass, tokenDispositivo) => {
    try {
        const response = await fetch(`${url}/IniciarSesion`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                cedula: user,
                pass: pass,
                tokenDispositivos: tokenDispositivo
            }),
        });        
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 307) {
            return response.json();
        }else{
            return Promise.reject('Ha ocurrido un error', response.status);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

//Fetch para traer actividades por residentes
const getAllTareas = async (key, cedulaResponsable) => {

    try {
        const response = await fetch(`${url}/GetAllTareas`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

//Fetch para traer actividades por residentes
const getActividadesDiariasByResponsable = async (key, cedulaResponsable) => {

    try {

        const response = await fetch(`${url}/GetActividadByResponsable/${cedulaResponsable}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}
const getActividadesDiariasByFechaYResponsable = async (key, cedulaResponsable, fecha) => {
    try {

        const response = await fetch(`${url}/GetActividadByResponsableByFecha/${cedulaResponsable}/${fecha}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}


//Fetch para traer visitantes por responsable 
const getMisVisitantesByCedulaResponsable = async (key, cedulaResponsable) => {

    try {

        const response = await fetch(`${url}/GetMisVisitantesByCedulaResponsable/${cedulaResponsable}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization':'Bearer '+ key
            }
        });
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}


//Ver agenda del respondable
const getAgendaByResponsable = async (key, cedulaResponsable) => {
    try {
        const response = await fetch(`${url}/GetAgendaByResponsable/${cedulaResponsable}`, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }
    } catch (error) {
        return Promise.reject(error);
    }
}

//Agregar agenda responsable
const addAgenda = async (key, nuevaAgenda) => {

    try {
        const response = await fetch(`${url}/AddAgenda`, {

            method: 'POST',
            body: nuevaAgenda,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization':'Bearer '+ key
            }
        })
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}

//agregar solicitud de usuario
const addSolicitudUsuario = async (key, nuevaSolicitud) => {
    try{
    const response = await fetch(`${url}/AddSolicitudUsuario`, {
        method: 'POST',
        body: nuevaSolicitud,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
    return response;
}catch (error) {
    return Promise.reject(error);
}
}

//agregar persona responsable
const addResponsable = async (key, nuevoResponsable) => {

try{

    const response = await fetch(`${url}/AddResponsable`, {
        method: 'POST',
        body: nuevoResponsable,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
    if (response.status === 200) {
        const respuesta={
            message: response.json(),
            status: response.status
        };
        return respuesta
    } else {
        const errorData = {
            message: 'Ha ocurrido un error al obtener al residente persona por cédula',
            status: response.status,
        };
        return errorData;
    }
} catch (error) {
    return Promise.reject(error);
}
    

}
//agregar persona residente
const addResidente = async (key, nuevoResidente) => {
    const response = await fetch(`${url}/AddResidente`, {
        method: 'POST',
        body: nuevoResidente,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
    return response;
}

//Fetch para consultar residentes por responsable 
const getResidenteByResponsable = async (key, cedulaResidente) => {

    const response = await fetch(`${url}/GetResidenteByResponsable/${cedulaResidente}`, {
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })    
   return await response;
}


//Fetch para ver todos lo empleados
const getPersonalAll = async (key) => {
    const response = await fetch(`${url}/GetEmpleadosAll`, {
        headers: {
            method: 'GET',
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
        return await response.json()
}
//Fetch para ver todos lo empleados
const getPersonalAllActivos = async (key) => {
    const response = await fetch(`${url}/GetEmpleadosAllActivos`, {
        headers: {
            method: 'GET',
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
        return await response.json()
}
//Fetch para ver todos lo residentes
const getAllResidentes = async (key) => {
    const response = await fetch(`${url}/GetAllResidentes`, {
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
        return await response.json()
    }
    const getAllResidentesActivos = async (key) => {
        const response = await fetch(`${url}/GetAllResidentesActivos`, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization':'Bearer '+ key
            }
        })
            return await response.json()
        }

        const getAllResponsablesActivos = async (key) => {
            const response = await fetch(`${url}/GetAllResponsablesActivos`, {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization':'Bearer '+ key
                }
            })
                return await response.json()
            }

//agregar persona Personal
const addPersonal = async (key, nuevoPersonal) => {    
    const response = await fetch(`${url}/addPersonal`, {
        method: 'POST',
        body: nuevoPersonal,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
   return await response
}

//agregar nuevo Usuario
const addUsuario = async (key, nuevoUsuario) => {


    const response = await fetch(`${url}/AddUsuario`, {
        method: 'POST',
        body: nuevoUsuario,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }  }).then(r => r.json())
        .then(datos => {   
       
    
    })
   return await response
}

//agregar visitante a mis visitantes
const addMisVisitantes = async (key, visitante) => {


    const response = await fetch(`${url}/AddMisVisitantes`, {
        method: 'POST',
        body: visitante,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
   return await response
}





//agregar nueva tarea
const addTarea = async (key, tarea, esPersonal) => {


    const response = await fetch(`${url}/AddTarea/${esPersonal}`, {
        method: 'POST',
        body: tarea,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
   return await response
}

const getAllTiposUsuario = async (key, cedulaUsuario) => {
    const response = await fetch(`${url}/GetTipoDeUsuario/${cedulaUsuario}`, {
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
        return await response
    }

    //Fetch para ver todos lo empleados
const getPersonaByCedula = async (key, documento) => {
    const response = await fetch(`${url}/GetPersonaByCedula/${documento}`, {
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
        return await response.json()
}
  //Fetch para ver las tareas activas de cada empelado
  const getAllTareasByCedPersonal = async (key, documento) => {
    const response = await fetch(`${url}/GetAllTareasByCedPersonal/${documento}`, {
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
    if (response.status === 200) {
        return response.json();
    } else {
        return Promise.reject('Ha ocurrido un error', response.status);
    }
}

const getTareasByFecha = async (key, fecha) => {
    try {

        const response = await fetch(`${url}/GetTareasByFecha/${fecha}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }

    } catch (error) {
        return Promise.reject(error);
    }

}

const getTareasEntreFechas = async (key, fechaDesde, fechaHasta) => {
    try {

        const response = await fetch(`${url}/GetTareasEntreFechas/${fechaDesde}/${fechaHasta}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }

    } catch (error) {
        return Promise.reject(error);
    }

}

const getTareasActivasDelDia = async (key) => {
    try {

        const response = await fetch(`${url}/GetTareasActivasDelDia`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }

    } catch (error) {
        return Promise.reject(error);
    }

}

//Fetch para traer un responsable por su cedula
const getResponsableByCedula = async (key, cedula) => {
    try {
        const response = await fetch(`${url}/GetResponsableByCedula/${cedula}`, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });

        if (response.status === 200) {
            return response.json();
        } else {
            const errorData = {
                message: 'Ha ocurrido un error al obtener el responsable por cédula',
                status: response.status,
            };
            return Promise.reject(errorData);
        }
    } catch (error) {
        return Promise.reject(error);
    }
};


const updateResponsable = async (key, responsable) => {
    try {
        const response = await fetch(`${url}/UpdateResponsable`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            },
            body:  responsable // Convertir a JSON correctamente
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }
    
}
/*         if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject(`Ha ocurrido un error. Código de estado: ${response.status}`);
        }
    } catch (error) {
        return Promise.reject(error);
    } 
;*/
//Fetch para traer un responsable por su cedula
const getDetalleResidenteByCedula = async (key, cedula) => {
    try {
        const response = await fetch(`${url}/GetDetalleResidenteByCedula/${cedula}`, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });

        if (response.status === 200) {
            return response.json();
        } else {
            const errorData = {
                message: 'Ha ocurrido un error al obtener el residente por cédula',
                status: response.status,
            };
            return Promise.reject(errorData);
        }
    } catch (error) {
        return Promise.reject(error);
    }
};

const updateResidente = async (key, residente) => {
    try {
        const response = await fetch(`${url}/UpdateResidente`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            },
            body:  residente // Convertir a JSON correctamente
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }
    
}

//Fetch para traer un responsable por su cedula
const getDetalleEmpleadoByCedula = async (key, cedula) => {
    try {
        const response = await fetch(`${url}/GetDetalleEmpleadoByCedula/${cedula}`, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });

        if (response.status === 200) {
            return response.json();
        } else {
            const errorData = {
                message: 'Ha ocurrido un error al obtener el empleado por cédula',
                status: response.status,
            };
            return Promise.reject(errorData);
        }
    } catch (error) {
        return Promise.reject(error);
    }


};
const updatePersonal = async (key, residente) => {
    try {
        const response = await fetch(`${url}/UpdatePersonal`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            },
            body:  residente // Convertir a JSON correctamente
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }

    
}

const HabilitarPersona = async (key, cedula) => {
    try {
        const response = await fetch(`${url}/HabilitarPersona/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            },
            body:  cedula // Convertir a JSON correctamente
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }    
}

const eliminarPersona = async (key, cedulaPersona) => {
    try {
        const response = await fetch(`${url}/EliminarPersona/${cedulaPersona}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            },
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }    
}

const asignarTarea = async (key, cedula, idTarea) => {
    try {
        const response = await fetch(`${url}/AsignarTarea/${cedula}/${idTarea}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            },
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }    
}
//Fetch para traer todas las agendas por su ultimo estadp (si es activa, su ultimo estado es Aprobada) 
const getAgendasPorEstado = async (key, recibeEstado) => {

    try {

        const response = await fetch(`${url}/GetAgendasPorEstado/${recibeEstado}`, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }


    } catch (error) {
        return Promise.reject(error);
    }
};
//Fetch para traer todas las agendas del dia 
const getAgendasDelDia = async (key) => {

    try {

        const response = await fetch(`${url}/GetAgendasDelDia`, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }


    } catch (error) {
        return Promise.reject(error);
    }
};
const EvaluarAgenda = async (key, recibeIdAgenda, recibeAprobarORechazar, recibeComentario) => {
    try {
        const response = await fetch(`${url}/EvaluarAgenda/${recibeIdAgenda}/${recibeAprobarORechazar}/${recibeComentario}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            }
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }    
}

const getAgendasEntreFechas = async (key, fechaDesde, fechaHasta) => {
    try {

        const response = await fetch(`${url}/GetAgendasEntreFechas/${fechaDesde}/${fechaHasta}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }

    } catch (error) {
        return Promise.reject(error);
    }

}
//Fetch para reiniciar la contraseña
const resetPassword = async (objetoReseteo) => {
    try {
        const response = await fetch(`${url}/ResetPassword`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: objetoReseteo,
        });
            return response.status;
        
    } catch (error) {
        return Promise.reject(error);
    }
}

const aprobarSolicitudUsuario = async (key, recibeIdSolicitud, recibeCedulaPersonal) => {
    try {
        const response = await fetch(`${url}/AprobarSolicitudUsuario/${recibeIdSolicitud}/${recibeCedulaPersonal}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            }
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }    
}

const rechazarSolicitudUsuario = async (key, recibeIdSolicitud, recibeCedulaPersonal) => {
    try {
        const response = await fetch(`${url}/RechazarSolicitudUsuario/${recibeIdSolicitud}/${recibeCedulaPersonal}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            }
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }    
}

const PostfinalizarTarea = async (key, tareaId, cedPersonal) => {
    try {
        const response = await fetch(`${url}/FinalizarTarea/${cedPersonal}/${tareaId}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            }
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }
    }catch (error){
        return Promise.reject(error);
    }    
}
const getSolicitudesUsuarioPorEstado = async (key, recibeEstado) => {
    try {

        const response = await fetch(`${url}/GetSolicitudesUsuarioPorEstado/${recibeEstado}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }

    } catch (error) {
        return Promise.reject(error);
    }
}

const getSolicitudesUsuarioProcesadas = async (key) => {
    try {
        const response = await fetch(`${url}/GetSolicitudesUsuarioProcesadas`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key
            },
        });
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject('Ha ocurrido un error', response.status);
        }

    } catch (error) {
        return Promise.reject(error);
    }
}

const getTareasSinAsignar = async (key, rol) => {
  
    try {
    const response = await fetch(`${url}/GetTareasSinAsignar/${rol}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + key
        },
    });
    if (response.status === 200) {
        return response.json();
    } else {
        return Promise.reject('Ha ocurrido un error', response.status);
    }

} catch (error) {
    return Promise.reject(error);
}

}

const finalizarAgenda = async (key, ced, agendaAAprobar, observaciones, visitado) => {
    try {
        const response = await fetch(`${url}/FinalizarAgenda/${ced}/${agendaAAprobar}/${observaciones}/${visitado}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + key// Descomenta esta línea si es necesario
            }
        });
        return await response;
    }catch (error){
        return Promise.reject(error);
    }    
}
//obtener token usuario para comparar el token del asyncstorage con el de la BD
const getTokenUsuario = async (key) => {
    const response = await fetch(`${url}/GetTokenUsuario`, {
        method: 'POST',
        body: JSON.stringify(key),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
   return await response
}

const SendNotificationsEmergencia = async (key, cedulaResidente ) => {
   
    const response = await fetch(`${url}/SendNotificationsEmergencia/${cedulaResidente}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })

    
   return response.json()
}

//fetch para registrar logoff
const logOff = async (key, recibeCedula) => {
    const response = await fetch(`${url}/LogOff`, {
        method: 'POST',
        body: JSON.stringify(recibeCedula),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })
   return await response
}

//obtener terminos y condiciones de la aplicación
const getTerminosYCondiciones = async () => {
    try{
    const response = await fetch(`${url}/GetTerminosYCondiciones`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    if (response.status === 200) {
        return response.json();
    } else {
        const errorData = {
            message: 'Ha ocurrido un error al obtener el empleado por cédula',
            status: response.status,
        };
        return Promise.reject(errorData);
    }

} catch (error) {
    return Promise.reject(error);
}
}
//fetch para ejecutar procedimientos de cerrar tareas y cerrar agendas del dia anterior
const cerrarTareasYAgendas = async (key) => {
    const response = await fetch(`${url}/CerrarTareasYAgendas`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization':'Bearer '+ key
        }
    })    
   return await response
}

export default login;

export { getActividadesDiariasByResponsable,getActividadesDiariasByFechaYResponsable, getMisVisitantesByCedulaResponsable, 
    getAgendaByResponsable, addAgenda, addSolicitudUsuario, getResidenteByResponsable, getPersonalAll, getAllResidentes, getTareasSinAsignar,getAllTareasByCedPersonal,PostfinalizarTarea,

    addResponsable, addResidente, addPersonal, addUsuario,getAllTiposUsuario, SendNotificationsEmergencia,
    addTarea, addMisVisitantes, getPersonaByCedula, getAllTareas, getTareasByFecha, getTareasEntreFechas, getTareasActivasDelDia, getResponsableByCedula, 
    updateResponsable, getDetalleResidenteByCedula, updateResidente, getDetalleEmpleadoByCedula, updatePersonal, asignarTarea, getAgendasPorEstado,
    EvaluarAgenda, getAgendasEntreFechas, resetPassword, aprobarSolicitudUsuario, rechazarSolicitudUsuario, getSolicitudesUsuarioPorEstado, 
    eliminarPersona, getPersonalAllActivos, getAllResidentesActivos, getAllResponsablesActivos, 
    finalizarAgenda, getSolicitudesUsuarioProcesadas, getAgendasDelDia, getTokenUsuario, logOff, getTerminosYCondiciones, cerrarTareasYAgendas}



