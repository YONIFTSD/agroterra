
const je = require('json-encrypt')
let user_permissions = window.localStorage.getItem("user_permissions");
user_permissions = JSON.parse(JSON.parse(je.decrypt(user_permissions)));

var modules = [{
  _name: 'CSidebarNavItem',
  name: 'Inicio',
  to: '/inicio/inicio',
  icon: 'cilHome',
}];

if(user_permissions.indexOf('SaleList') > -1 || user_permissions.indexOf('OrderList') > -1  || user_permissions.indexOf('RedeemedSaleList') > -1 || user_permissions.indexOf('POSList') > -1 || user_permissions.indexOf('QuotationList') > -1 ){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('SaleList') > -1) {
    item.push({ name: 'Venta', to: '/venta/listar' });
  }
  if (user_permissions.indexOf('POSList') > -1) {
    item.push({ name: 'POS', to: '/pos/nuevo' });
  }
  if (user_permissions.indexOf('OrderList') > -1) {
    item.push({ name: 'Pedidos', to: '/pedidos/listar' });
  }
  if (user_permissions.indexOf('QuotationList') > -1) {
    item.push({ name: 'Cotización', to: '/cotizacion/listar' });
  }
  if (user_permissions.indexOf('RedeemedSaleList') > -1) {
    item.push({ name: 'Canje de Ventas', to: '/canje-venta/listar' });
  }
  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Ventas',
    icon: 'cil-cash',
    items: item
  }
  modules.push(TypeUser);
}

if(user_permissions.indexOf('CashList') > -1 || user_permissions.indexOf('ExpenseList') > -1 || user_permissions.indexOf('IncomeList') > -1 ){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('CashList') > -1) {
    item.push({ name: 'Cajas', to: '/caja/listar' });
  }
  if (user_permissions.indexOf('CashAdd') > -1) {
    item.push({ name: 'Estado Caja', to: '/caja/nuevo' });
  }
  if (user_permissions.indexOf('IncomeList') > -1) {
    item.push({ name: 'Ingresos', to: '/ingresos/listar'});
  }
  if (user_permissions.indexOf('ExpenseList') > -1) {
    item.push({ name: 'Egresos', to: '/egresos/listar'});
  }
  

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Tesoreria',
    icon: 'cib-cashapp',
    items: item
  }
  modules.push(TypeUser);
}


if(user_permissions.indexOf('AccountReceivableList') > -1 || user_permissions.indexOf('AccountPayList') > -1 
|| user_permissions.indexOf('ExchangeDocumentList') > -1 || user_permissions.indexOf('PaymentList') > -1 
|| user_permissions.indexOf('ChargeList') > -1 || user_permissions.indexOf('SettlementCollectionList') > -1 
|| user_permissions.indexOf('SettlementPaymentList') > -1 ){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('AccountReceivableList') > -1) {
    item.push({ name: 'Cuentas por Cobrar', to: '/cuentas-por-cobrar/listar' });
  }
  if (user_permissions.indexOf('ChargeList') > -1) {
    item.push({ name: 'Registro de Cobros', to: '/registro-de-cobros/listar' });
  }
  if (user_permissions.indexOf('SettlementCollectionList') > -1) {
    item.push({ name: 'Liquidacion de Cobros', to: '/liquidacion-de-cobros/listar' });
  }


  if (user_permissions.indexOf('AccountPayList') > -1) {
    item.push({ name: 'Cuentas por Pagar', to: '/cuentas-por-pagar/listar' });
  }
  if (user_permissions.indexOf('PaymentList') > -1) {
    item.push({ name: 'Registro de Pagos', to: '/registro-de-pagos/listar' });
  }
  if (user_permissions.indexOf('SettlementPaymentList') > -1) {
    item.push({ name: 'Liquidacion de Pagos', to: '/liquidacion-de-pagos/listar' });
  }
  if (user_permissions.indexOf('ExchangeDocumentList') > -1) {
    item.push({ name: 'Canje de Documentos', to: '/canje-de-documentos/listar' });
  }
  

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Finanzas',
    icon: 'cilDollar',
    items: item
  }
  modules.push(TypeUser);
}


if(user_permissions.indexOf('ClientList') > -1 || user_permissions.indexOf('ProviderList') > -1 ){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('ClientList') > -1) {
    item.push({ name: 'Clientes', to: '/cliente/listar' });
    
  }
  if (user_permissions.indexOf('ProviderList') > -1) {
    item.push({ name: 'Proveedores', to: '/proveedor/listar'});
  }

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Entidades',
    icon: 'cil-people',
    items: item
  }
  modules.push(TypeUser);
}


if(user_permissions.indexOf('ProductList') > -1 || user_permissions.indexOf('CategoryList') > -1 || user_permissions.indexOf('BrandList') > -1 || user_permissions.indexOf('ProductPriceList') > -1 ){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('ProductList') > -1) {
    item.push({ name: 'Productos', to: '/producto/listar' });
  }
  if (user_permissions.indexOf('ProductPriceList') > -1) {
    item.push({ name: 'Precios', to: '/producto-precios/listar' });
  }
  if (user_permissions.indexOf('CategoryList') > -1) {
    item.push({ name: 'Categorias', to: '/categoria/listar'});
  }
  if (user_permissions.indexOf('BrandList') > -1) {
    item.push({ name: 'Marcas', to: '/marca/listar'});
  }

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Productos',
    icon: 'cil-applications',
    items: item
  }
  modules.push(TypeUser);
}






if(user_permissions.indexOf('ShoppingList') > -1 || user_permissions.indexOf('CostingList') > -1 || user_permissions.indexOf('PurchaseExpensesList') > -1 || user_permissions.indexOf('CreditDebitNoteList') > -1 ){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('ShoppingList') > -1) {
    item.push({ name: 'Compras', to: '/compra/listar' });
  }

  if (user_permissions.indexOf('CostingList') > -1) {
    item.push({ name: 'Costeo', to: '/costeo/listar'});
  }

  if (user_permissions.indexOf('PurchaseExpensesList') > -1) {
    item.push({ name: 'Gastos', to: '/gastos-compra/listar'});
  }

  if (user_permissions.indexOf('CreditDebitNoteList') > -1) {
    item.push({ name: 'Nota de Crédito/Débito', to: '/nota-compra/listar'});
  }

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Compras',
    icon: 'cilGrid',
    items: item
  }
  modules.push(TypeUser);
}



if(user_permissions.indexOf('RequirementList') > - 1 || user_permissions.indexOf('ReferralGuideList') > - 1  || user_permissions.indexOf('PurchaseOrderList') > - 1 ){
  let me = this;
  let item = [];

  if (user_permissions.indexOf('ReferralGuideList') > -1) {
    item.push({ name: 'Guia de Remision', to: '/guia-remision/listar' });
  }

  if (user_permissions.indexOf('RequirementList') > -1) {
    item.push({ name: 'Requerimientos', to: '/requerimiento/listar' });
  }

  if (user_permissions.indexOf('PurchaseOrderList') > -1) {
    item.push({ name: 'Orden de Compra', to: '/orden-de-compra/listar' });
  }

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Logistica',
    icon: 'cilClipboard',
    items: item
  }
  modules.push(TypeUser);
}

// if(user_permissions.indexOf('VideoconferenceList') > -1 ){
//   let me = this;

//   let TypeUser = {
//     _name: 'CSidebarNavItem',
//     name: 'Videoconferencia',
//     to: '/videoconferencia/zoom',
//     icon: 'cil-cart',
//   }
//   modules.push(TypeUser);
// }

if(user_permissions.indexOf('InputList') > -1  || user_permissions.indexOf('ControlStockList') > -1  || user_permissions.indexOf('InitialKardexList') > -1  || user_permissions.indexOf('OutputList') > -1  || user_permissions.indexOf('StockGeneralList') > -1 || user_permissions.indexOf('TransformationList') > -1){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('InputList') > -1) {
    item.push({ name: 'Entradas', to: '/entrada/listar' });
  }
  if (user_permissions.indexOf('OutputList') > -1) {
    item.push({ name: 'Salidas', to: '/salida/listar'});
  }
  if (user_permissions.indexOf('InitialKardexList') > -1) {
    item.push({ name: 'Inventario Inicial', to: '/kardex-inicial/listar'});
  }
  if (user_permissions.indexOf('KardexPsysicalList') > -1) {
    item.push({ name: 'Kardex Fisico', to: '/kardex/fisico'});
  }
  if (user_permissions.indexOf('KardexValuedList') > -1) {
    item.push({ name: 'Kardex Valorado', to: '/kardex/valorado'});
  }
  if (user_permissions.indexOf('KardexExistenceList') > -1) {
    item.push({ name: 'Kardex de Existencias', to: '/kardex/existencias'});
  }
  if (user_permissions.indexOf('StockList') > -1) {
    item.push({ name: 'Stock', to: '/kardex/stock'});
  }
  if (user_permissions.indexOf('StockGeneralList') > -1) {
    item.push({ name: 'Stock General', to: '/kardex/stock-general'});
  }
  if (user_permissions.indexOf('StockDiferenceList') > -1) {
    item.push({ name: 'Diferencia Stock', to: '/kardex/diferencia-stock'});
  }
  if (user_permissions.indexOf('ControlStockList') > -1) {
    item.push({ name: 'Control Stock', to: '/control-stock/listar'});
  }
  if (user_permissions.indexOf('TransformationList') > -1) {
    item.push({ name: 'Transformación', to: '/transformacion/listar'});
  }


  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Almacen',
    icon: 'cilStorage',
    items: item
  }
  modules.push(TypeUser);
}


if(user_permissions.indexOf('ReportSaleList') > -1 || user_permissions.indexOf('ReportSaleDetailList') > -1 || 
  user_permissions.indexOf('ReportShoppingList') > -1 || user_permissions.indexOf('ReportShoppingDetailList') > -1
  || user_permissions.indexOf('ReportIncomeSettlementList') > -1 || user_permissions.indexOf('ReportDayliIncomeSettlementList') > -1
  || user_permissions.indexOf('ReportUtilityList') > -1 || user_permissions.indexOf('ReportSalesTrackingList') > -1
  || user_permissions.indexOf('ReportShoppingTrackingList') > -1 || user_permissions.indexOf('ReportSalesPriceList') > -1
  || user_permissions.indexOf('ReportReceivableList') > -1 || user_permissions.indexOf('ReportPayList') > -1
  || user_permissions.indexOf('ReportProgramList') > -1 || user_permissions.indexOf('ReportSaleDeleteList') > -1
  ){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('ReportSaleList') > -1) {
    item.push({ name: 'Ventas', to: '/reporte/venta' });
  }
  if (user_permissions.indexOf('ReportSaleDetailList') > -1) {
    item.push({ name: 'Detalle de Ventas', to: '/reporte/venta-detallado'});
  }
  if (user_permissions.indexOf('ReportSale14.1List') > -1) {
    item.push({ name: 'Ventas 14.1', to: '/reporte/venta-14.1' });
  }
  if (user_permissions.indexOf('ReportShoppingList') > -1) {
    item.push({ name: 'Compras', to: '/reporte/compra'});
  }
  if (user_permissions.indexOf('ReportShoppingDetailList') > -1) {
    item.push({ name: 'Detalle de Compra', to: '/reporte/compra-detallado'});
  }

  if (user_permissions.indexOf('ReportUtilityList') > -1) {
    item.push({ name: 'Utilidad', to: '/reporte/utilidad'});
  }

  if (user_permissions.indexOf('ReportCommissionableProductsList') > -1) {
    item.push({ name: 'Prod. Comisionables', to: '/reporte/productos-comisionables'});
  }

  if (user_permissions.indexOf('ReportIncomeSettlementList') > -1) {
    item.push({ name: 'Liq. de Ingresos', to: '/reporte/liquidacion-de-ingresos'});
  }

  if (user_permissions.indexOf('ReportDayliIncomeSettlementList') > -1) {
    item.push({ name: 'Liq. de Ingresos Diaria', to: '/reporte/liquidacion-de-ingresos-diaria'});
  }

  if (user_permissions.indexOf('ReportSalesTrackingList') > -1) {
    item.push({ name: 'Seg. de Ventas', to: '/reporte/seguimiento-de-ventas'});
  }

  if (user_permissions.indexOf('ReportShoppingTrackingList') > -1) {
    item.push({ name: 'Seg. de Compras', to: '/reporte/seguimiento-de-compras'});
  }

  if (user_permissions.indexOf('ReportSalesPriceList') > -1) {
    item.push({ name: 'Ventas Segun el Precio', to: '/reporte/ventas-segun-precio'});
  }

  if (user_permissions.indexOf('ReportReceivableList') > -1) {
    item.push({ name: 'Cuentas por Cobrar', to: '/reporte/cuentas-por-cobrar'});
  }

  if (user_permissions.indexOf('ReportPayList') > -1) {
    item.push({ name: 'Cuentas por Pagar', to: '/reporte/cuentas-por-pagar'});
  }

  if (user_permissions.indexOf('ReportProgramList') > -1) {
    item.push({ name: 'Programaciones', to: '/reporte/programaciones'});
  }

  if (user_permissions.indexOf('ReportSaleDeleteList') > -1) {
    item.push({ name: 'Ventas Eliminadas', to: '/reporte/ventas-eliminadas'});
  }


  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Reportes',
    icon: 'cilFile',
    items: item
  }
  modules.push(TypeUser);
}


if(user_permissions.indexOf('UserList') > -1 || user_permissions.indexOf('UserTypeList') > -1  || user_permissions.indexOf('VoucherpeList') > -1 || user_permissions.indexOf('Business') > -1){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('UserList') > -1) {
    item.push({ name: 'Usuario', to: '/usuario/listar' });
    
  }
  if (user_permissions.indexOf('UserTypeList') > -1) {
    item.push({ name: 'Tipo de Usuario', to: '/tipo-usuario/listar'});
  }

  if (user_permissions.indexOf('VoucherList') > -1) {
    item.push({ name: 'Comprobante',to: '/comprobante/listar'});
  }

  if (user_permissions.indexOf('EstablishmentList') > -1) {
    item.push({ name: 'Establecimiento',to: '/establecimiento/listar'});
  }

  if (user_permissions.indexOf('FactoringList') > -1) {
    item.push({name: 'Ser. Factoring',to: '/servicio-factoring/listar'});
  }

  if (user_permissions.indexOf('BusinessList') > -1) {
    item.push({name: 'Empresa',to: '/empresa/editar'});
  }
  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Mantenimiento',
    icon: 'cilCog',
    items: item
  }
  modules.push(TypeUser);
}



if(user_permissions.indexOf('WebPageList') > -1){
  let me = this;
  let item = [];
  item.push({ name: 'Portada',to: '/portadas/listar'});
  item.push({ name: 'Promociones',to: '/promociones/listar'});
  item.push({ name: 'Comentarios',to: '/comentarios/listar'});
  item.push({ name: 'Suscripciones',to: '/suscripciones/listar'});

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Pagina Web',
    icon: 'cilStar',
    items: item
  }
  modules.push(TypeUser);
}



export default [
  {
    _name: 'CSidebarNav',
    _children: modules
  }
]