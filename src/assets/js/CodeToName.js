
var NameDocumentType = (function() {

    return function NameDocumentType(code_document_type) {
        var name = '';
        switch (code_document_type) {
            case '1': name = "DNI"; break;
            case '6': name = "RUC"; break;
            case '4': name = "CARNET EXT."; break;
            case '7': name = "PASAPORTE"; break;
            case '0': name = "OTROS"; break;
            
            
            default: name = ''; break;
        }

        return name;
    };

})();

var CodeInvoice = (function() {

    return function CodeInvoice(code_invoice) {
        var code = '';
        switch (code_invoice) {
            case '01': code = "FT"; break;
            case '03': code = "BT"; break;
            case '07': code = "NC"; break;
            case '08': code = "ND"; break;
            case '09': code = "GR"; break;
            case '31': code = "GRT"; break;
            case 'NE': code = "NE"; break;
            case 'NS': code = "NS"; break;
            case 'NV': code = "NV"; break;
            case '00': code = "OT"; break;
            case 'NR': code = "NR"; break;
            case 'CS': code = "CS"; break;
            case 'GC': code = "GC"; break;
            case 'AT': code = "AT"; break;
            case 'NA': code = "NA"; break;
            case 'NP': code = "NP"; break;
            case 'GD': code = "GD"; break;
            default: code = ''; break;
        }

        return code;
    };

})();

var NameInvoice = (function() {

    return function NameInvoice(code_invoice) {
        var name = '';
        switch (code_invoice) {
            case '00' : name = "Otros"; break;
            case '01' : name = "Factura"; break;
            case '03' : name = "Boleta de Venta"; break;
            case '04' : name = "Liquidación de Compra"; break;
            case '07' : name = "Nota de Crédito"; break;
            case '08' : name = "Nota de Débito"; break;
            case '09' : name = "Guía Rem Rem"; break;
            case '12' : name = "Ticket o cinta emitido por máquina registradora"; break;
            case '21' : name = "Conocimiento de embarque por el servicio de transporte de carga marítima"; break;
            case '22' : name = "Comprobante por Operaciones No Habituales"; break;
            case '31' : name = "Guía de Remisión - Transportista"; break;
            case '50' : name = "Declaración Única de Aduanas - Importación definitiva"; break;
            case '52' : name = "Despacho Simplificado - Importación Simplificada"; break;
            case '91' : name = "Comprobante de No Domiciliado"; break;
            case 'GC' : name = "Guía de Credito"; break; 
            case 'NR' : name = "Nota de Requerimiento"; break; 
            case 'AT' : name = "Asisencia Técnica"; break; 
            case 'CT' : name = "Cotización "; break; 
            case 'PF' : name = "Proforma"; break; 
            case 'NS' : name = "Nota de Salida"; break; 
            case 'NE' : name = "Nota de Entrada"; break; 
            case 'NV' : name = "Nota de Venta"; break; 
            case 'NP' : name = "Nota de Pago"; break; 
            case 'NA' : name = "Nota de Almacen"; break; 
            case 'NS' : name = "Nota de Servicio"; break; 
            case 'GD' : name = "Guía de Despacho"; break; 
            default: name = ''; break;
        }

        return toLowerCase(name);
    };

})();



var NameOperationType = (function() {

    return function NameOperationType(code_operation_type) {
        var name = '';
        switch (code_operation_type) {
            case '01' : name =  "VENTA NACIONAL"; break;
            case '02' : name =  "COMPRA NACIONAL"; break;
            case '03' : name =  "CONSIGNACIÓN RECIBIDA"; break;
            case '04' : name =  "CONSIGNACIÓN ENTREGADA"; break;
            case '05' : name =  "DEVOLUCIÓN RECIBIDA"; break;
            case '06' : name =  "DEVOLUCIÓN ENTREGADA"; break;
            case '07' : name =  "BONIFICACIÓN"; break;
            case '08' : name =  "PREMIO"; break;
            case '09' : name =  "DONACIÓN"; break;
            case '10' : name =  "SALIDA A PRODUCCIÓN"; break;
            case '11' : name =  "TRANSFERENCIA ENTRE ALMACENES "; break;
            case '12' : name =  "RETIRO"; break;
            case '13' : name =  "MERMAS"; break;
            case '14' : name =  "DESMEDROS"; break;
            case '15' : name =  "DESTRUCCIÓN"; break;
            case '16' : name =  "SALDO INICIAL"; break;
            case '17' : name =  "EXPORTACIÓN"; break;
            case '18' : name =  "IMPORTACIÓN"; break;
            case '19' : name =  "ENTRADA DE PRODUCCIÓN"; break;
            case '20' : name =  "ENTRADA POR DEVOLUCIÓN DE PRODUCCIÓN"; break;
            case '21' : name =  "TRANSFERENCIA ENTRE ALMACENES"; break;
            case '22' : name =  "ENTRADA POR IDENTIFICACIÓN ERRONEA"; break;
            case '23' : name =  "SALIDA POR IDENTIFICACIÓN ERRONEA"; break;
            case '24' : name =  "ENTRADA POR DEVOLUCIÓN DEL CLIENTE"; break;
            case '25' : name =  "SALIDA POR DEVOLUCIÓN AL PROVEEDOR"; break;
            case '26' : name =  "ENTRADA PARA SERVICIO DE PRODUCCIÓN"; break;
            case '27' : name =  "SALIDA POR SERVICIO DE PRODUCCIÓN"; break;
            case '28' : name =  "AJUSTE POR DIFERENCIA DE INVENTARIO"; break;
            case '29' : name =  "ENTRADA DE BIENES EN PRÉSTAMO"; break;
            case '30' : name =  "SALIDA DE BIENES EN PRÉSTAMO"; break;
            case '31' : name =  "ENTRADA DE BIENES EN CUSTODIA"; break;
            case '32' : name =  "SALIDA DE BIENES EN CUSTODIA"; break;
            case '33' : name =  "MUESTRAS MÉDICAS"; break;
            case '34' : name =  "PUBLICIDAD"; break;
            case '35' : name =  "GASTOS DE REPRESENTACIÓN"; break;
            case '36' : name =  "RETIRO PARA ENTREGA A TRABAJADORES"; break;
            case '37' : name =  "RETIRO POR CONVENIO COLECTIVO"; break;
            case '38' : name =  "RETIRO POR SUSTITUCIÓN DE BIEN SINIESTRADO"; break;
            case '91' : name =  "OTROS 1"; break;
            case '92' : name =  "OTROS 2"; break;
            case '93' : name =  "OTROS 3 "; break;
            case '94' : name =  "OTROS 4"; break;
            case '99' : name =  "OTROS"; break;
            default: name = ''; break;
        }

        return (name);
    };
})();


var NameMethodPayment = (function() {

    return function NameMethodPayment(code_method_payment) {
        var name = '';
        switch (code_method_payment) {
            case '001': name = 'DEPÓSITO EN CUENTA'; break;
            case '003': name = 'TRANSFERENCIA DE FONDOS'; break;
            case '004': name = 'ORDEN DE PAGO'; break;
            case '005': name = 'TARJETA DE DÉBITO'; break;
            case '006': name = 'TARJETA DE CRÉDITO'; break;
            case '007': name = 'CHEQUES CON LA CLÁUSULA DE "NO NEGOCIABLE"'; break;
            case '008': name = 'EFECTIVO'; break;
            case '009': name = 'EFECTIVO, EN LOS DEMÁS CASOS'; break;
            case '101': name = 'TRANSFERENCIAS - COMERCIO EXTERIOR'; break;
            case '102': name = 'CHEQUES BANCARIOS  - COMERCIO EXTERIOR'; break;
            default: name = ''; break;
        }

        return (name);
    };
})();


var NameReasonNCD = (function() {

    return function NameReasonNCD(type_invoice,code) {
        var name = '';
       
        if (type_invoice == "07") {
            switch (code) {
                case '01' : name = "Anulación de la operación"; break;
                case '02' : name = "Anulación por error en el RUC"; break;
                case '03' : name = "Corrección por error en la descripción"; break;
                case '04' : name = "Descuento global"; break;
                case '05' : name = "Descuento por ítem"; break;
                case '06' : name = "Devolución total"; break;
                case '07' : name = "Devolución por ítem"; break;
                case '08' : name = "Bonificación"; break;
                case '09' : name = "Disminución en el valor"; break;
                case '10' : name = "Otros Conceptos "; break;
                default: name = ''; break;
            }
            return name;
        }
        if (type_invoice == "08") {
            switch (code) {
                case '01' : name = "Intereses por mora"; break;
                case '02' : name = "Aumento en el valor"; break;
                case '03' : name = "Penalidades/ otros conceptos"; break;
                default: name = ''; break;
            }
            return name;
        }
    };
})();


export default {NameDocumentType,CodeInvoice,NameInvoice,NameOperationType,NameMethodPayment,NameReasonNCD}
