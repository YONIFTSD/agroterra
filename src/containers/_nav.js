
const je = require('json-encrypt')
let user_permissions = window.localStorage.getItem("user_permissions");
user_permissions = JSON.parse(JSON.parse(je.decrypt(user_permissions)));

var modules = [{
  _name: 'CSidebarNavItem',
  name: 'Inicio',
  to: '/inicio/inicio',
  icon: 'cilHome',
}];

if(user_permissions.indexOf('SaleList') > -1 ){
  let me = this;

  let TypeUser = {
    _name: 'CSidebarNavItem',
    name: 'Venta',
    to: '/venta/listar',
    icon: 'cil-cash',
  }
  modules.push(TypeUser);
}


if(user_permissions.indexOf('OrderList') > -1 ){
  let me = this;

  let TypeUser = {
    _name: 'CSidebarNavItem',
    name: 'Pedidos',
    to: '/pedidos/listar',
    icon: 'cil-cart',
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
    item.push({ name: 'Arqueo Caja', to: '/caja/nuevo' });
  }
  if (user_permissions.indexOf('IncomeList') > -1) {
    item.push({ name: 'Ingresos', to: '/ingresos/listar'});
  }
  if (user_permissions.indexOf('ExpenseList') > -1) {
    item.push({ name: 'Egresos', to: '/egresos/listar'});
  }
  

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Arqueo de Caja',
    icon: 'cib-cashapp',
    items: item
  }
  modules.push(TypeUser);
}


if(user_permissions.indexOf('AccountReceivableList') > -1 ){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('AccountReceivableList') > -1) {
    item.push({ name: 'Cuentas por Cobrar', to: '/cuentas-por-cobrar/listar' });
  }

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Tesoreria',
    icon: 'cib-cashapp',
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
  if (user_permissions.indexOf('CategoryList') > -1) {
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
  if (user_permissions.indexOf('CategoryList') > -1) {
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

  // if (user_permissions.indexOf('CreditDebitNoteList') > -1) {
  //   item.push({ name: 'Nota de Crédito/Débito', to: '/nota-compra/listar'});
  // }

  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Compras',
    icon: 'cilClipboard',
    items: item
  }
  modules.push(TypeUser);
}



if(user_permissions.indexOf('RequirementList') > - 1 || user_permissions.indexOf('ReferralGuideList') > - 1 ){
  let me = this;
  let item = [];

  if (user_permissions.indexOf('ReferralGuideList') > -1) {
    item.push({ name: 'Guia de Remision', to: '/guia-remision/listar' });
  }

  if (user_permissions.indexOf('RequirementList') > -1) {
    item.push({ name: 'Requerimientos', to: '/requerimiento/listar' });
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

if(user_permissions.indexOf('InputList') > -1  || user_permissions.indexOf('InitialKardexList') > -1  || user_permissions.indexOf('OutputList') > -1  || user_permissions.indexOf('StockGeneralList') > -1 || user_permissions.indexOf('TransformationList') > -1){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('InputList') > -1) {
    item.push({ name: 'Entradas', to: '/entrada/listar' });
  }
  if (user_permissions.indexOf('OutputList') > -1) {
    item.push({ name: 'Salidas', to: '/salida/listar'});
  }
  if (user_permissions.indexOf('InitialKardexList') > -1) {
    item.push({ name: 'Kardex Inicial', to: '/kardex-inicial/listar'});
  }
  if (user_permissions.indexOf('KardexPsysicalList') > -1) {
    item.push({ name: 'Kardex Fisico', to: '/kardex/fisico'});
  }
  if (user_permissions.indexOf('KardexValuedList') > -1) {
    item.push({ name: 'Kardex Valorado', to: '/kardex/valorado'});
  }
  if (user_permissions.indexOf('StockGeneralList') > -1) {
    item.push({ name: 'Stock General', to: '/kardex/stock-general'});
  }
  if (user_permissions.indexOf('StockValuedList') > -1) {
    item.push({ name: 'Stock Valorado', to: '/kardex/stock-valorado'});
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


if(user_permissions.indexOf('ReportSaleList') > -1 || user_permissions.indexOf('ReportSaleDetailList') > -1 || user_permissions.indexOf('ReportShoppingList') > -1 || user_permissions.indexOf('ReportShoppingDetailList') > -1){
  let me = this;
  let item = [];
  if (user_permissions.indexOf('ReportSaleList') > -1) {
    item.push({ name: 'Ventas', to: '/reporte/venta' });
  }
  if (user_permissions.indexOf('ReportSaleDetailList') > -1) {
    item.push({ name: 'Detalle de Ventas', to: '/reporte/venta-detallado'});
  }
  if (user_permissions.indexOf('ReportShoppingList') > -1) {
    item.push({ name: 'Compras', to: '/reporte/compra'});
  }
  if (user_permissions.indexOf('ReportShoppingDetailList') > -1) {
    item.push({ name: 'Detalle de Compra', to: '/reporte/compra-detallado'});
  }


  let TypeUser = {
    _name: 'CSidebarNavDropdown',
    name: 'Reportes',
    icon: 'cilStorage',
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

  // if (user_permissions.indexOf('CoverPageList') > -1) {
  //   item.push({ name: 'Portada',to: '/portadas/listar'});
  // }

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



export default [
  {
    _name: 'CSidebarNav',
    _children: modules
  }
]