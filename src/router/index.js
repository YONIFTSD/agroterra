import Vue from "vue";
import Router from "vue-router";
const je = require("json-encrypt");

// Containers
const TheContainer = () => import("@/containers/TheContainer");

// Views
const Dashboard = () => import("@/views/Dashboard");

// Views - Components

const Forms = () => import("@/views/base/Forms");

// Views - Pages
const Page404 = () => import("@/views/pages/Page404");
const Page500 = () => import("@/views/pages/Page500");
const Login = () => import("@/views/pages/Login");
const Register = () => import("@/views/pages/Register");

const userGuard = (to, from, next) => {
  let user = window.localStorage.getItem("user");
  let user_permissions = window.localStorage.getItem("user_permissions");

  if (user == null || user == undefined) {
    next("/");
  } else {
    user = JSON.parse(JSON.parse(je.decrypt(user)));
    if (user.api_token.length != 60) {
      next("/");
    } else {
      let isAuthenticated = false;
      if (user_permissions == null || user_permissions == undefined) {
        next({ name: "Page404" });
      } else {
        user_permissions = JSON.parse(JSON.parse(je.decrypt(user_permissions)));
        if (user_permissions.indexOf(to.name) > -1) isAuthenticated = true;
      }
      if (!isAuthenticated) next({ name: "Page404" });
      else next();
    }
  }
};

Vue.use(Router);

export default new Router({
  mode: "hash", // https://router.vuejs.org/api/#mode
  linkActiveClass: "active",
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes(),
});

function configRoutes() {
  return [
    {
      path: "/",
      redirect: "/",
      name: "Login",
      component: {
        render(c) {
          return c("router-view");
        },
      },
      children: [
        {
          path: "/",
          name: "LoginPage",
          component: Login,
        },
      ],
    },
    {
      path: "/inicio",
      redirect: "/inicio/inicio",
      name: "Home",
      component: TheContainer,
      children: [
        {
          path: "inicio",
          name: "Dashboard",
          component: Dashboard,
        },
        {
          path: "404",
          name: "Page404",
          component: Page404,
        },
        {
          path: "500",
          name: "Page500",
          component: Page500,
        },
      ],
    },

    {
      path: "/usuario",
      redirect: "/usuario/listar",
      name: "Usuario",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "UserList",
          component: () => import("@/views/user/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "UserAdd",
          component: () => import("@/views/user/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_user",
          name: "UserEdit",
          component: () => import("@/views/user/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_user",
          name: "UserView",
          component: () => import("@/views/user/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/tipo-usuario",
      redirect: "/tipo-usuario/listar",
      name: "TipoUsuario",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "UserTypeList",
          component: () => import("@/views/usertype/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "UserTypeAdd",
          component: () => import("@/views/usertype/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_user_type",
          name: "UserTypeEdit",
          component: () => import("@/views/usertype/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_user_type",
          name: "UserTypeView",
          component: () => import("@/views/usertype/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },


    {
      path: "/establecimiento",
      redirect: "/establecimiento/listar",
      name: "Establecimiento",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "EstablishmentList",
          component: () => import("@/views/establishment/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "EstablishmentAdd",
          component: () => import("@/views/establishment/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_establishment",
          name: "EstablishmentEdit",
          component: () => import("@/views/establishment/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_establishment",
          name: "EstablishmentView",
          component: () => import("@/views/establishment/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/cliente",
      redirect: "/cliente/listar",
      name: "Cliente",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "ClientList",
          component: () => import("@/views/client/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "ClientAdd",
          component: () => import("@/views/client/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_client",
          name: "ClientEdit",
          component: () => import("@/views/client/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_client",
          name: "ClientView",
          component: () => import("@/views/client/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/proveedor",
      redirect: "/proveedor/listar",
      name: "Proveedor",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "ProviderList",
          component: () => import("@/views/provider/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "ProviderAdd",
          component: () => import("@/views/provider/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_provider",
          name: "ProviderEdit",
          component: () => import("@/views/provider/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_provider",
          name: "ProviderView",
          component: () => import("@/views/provider/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/categoria",
      redirect: "/categoria/listar",
      name: "Categoria",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "CategoryList",
          component: () => import("@/views/category/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "CategoryAdd",
          component: () => import("@/views/category/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_category",
          name: "CategoryEdit",
          component: () => import("@/views/category/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_category",
          name: "CategoryView",
          component: () => import("@/views/category/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/marca",
      redirect: "/marca/listar",
      name: "Marca",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "BrandList",
          component: () => import("@/views/brand/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "BrandAdd",
          component: () => import("@/views/brand/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_brand",
          name: "BrandEdit",
          component: () => import("@/views/brand/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_brand",
          name: "BrandView",
          component: () => import("@/views/brand/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },
    {
      path: "/producto",
      redirect: "/producto/listar",
      name: "Producto",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "ProductList",
          component: () => import("@/views/product/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "ProductAdd",
          component: () => import("@/views/product/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_product",
          name: "ProductEdit",
          component: () => import("@/views/product/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_product",
          name: "ProductView",
          component: () => import("@/views/product/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/producto-precios",
      redirect: "/producto-precios/listar",
      name: "ProductoPrecios",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "ProductPriceList",
          component: () => import("@/views/product-price/List"),
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/comprobante",
      redirect: "/comprobante/listar",
      name: "Comprobante",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "VoucherList",
          component: () => import("@/views/voucher/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "VoucherAdd",
          component: () => import("@/views/voucher/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_voucher",
          name: "VoucherEdit",
          component: () => import("@/views/voucher/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_voucher",
          name: "VoucherView",
          component: () => import("@/views/voucher/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/compra",
      redirect: "/compra/listar",
      name: "Compra",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "ShoppingList",
          component: () => import("@/views/shopping/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "ShoppingAdd",
          component: () => import("@/views/shopping/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_shopping",
          name: "ShoppingEdit",
          component: () => import("@/views/shopping/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_shopping",
          name: "ShoppingView",
          component: () => import("@/views/shopping/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },


    {
      path: "/costeo",
      redirect: "/costeo/listar",
      name: "Costeo",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "CostingList",
          component: () => import("@/views/costing/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "CostingAdd",
          component: () => import("@/views/costing/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_shopping",
          name: "CostingEdit",
          component: () => import("@/views/costing/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_shopping",
          name: "CostingView",
          component: () => import("@/views/costing/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/gastos-compra",
      redirect: "/gastos-compra/listar",
      name: "GastosCompra",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "PurchaseExpensesList",
          component: () => import("@/views/purchase-expenses/List"),
          beforeEnter: userGuard,
        },

        {
          path: "nuevo",
          name: "PurchaseExpensesAdd",
          component: () => import("@/views/purchase-expenses/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_purchase_expenses",
          name: "PurchaseExpensesEdit",
          component: () => import("@/views/purchase-expenses/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_purchase_expenses",
          name: "PurchaseExpensesView",
          component: () => import("@/views/purchase-expenses/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/venta",
      redirect: "/venta/listar",
      name: "Venta",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "SaleList",
          component: () => import("@/views/sale/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "SaleAdd",
          component: () => import("@/views/sale/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_sale",
          name: "SaleEdit",
          component: () => import("@/views/sale/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_sale",
          name: "SaleView",
          component: () => import("@/views/sale/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/caja",
      redirect: "/caja/listar",
      name: "Caja",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "CashList",
          component: () => import("@/views/cash/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "CashAdd",
          component: () => import("@/views/cash/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_cash",
          name: "CashEdit",
          component: () => import("@/views/cash/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_cash",
          name: "CashView",
          component: () => import("@/views/cash/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },



    {
      path: "/cuentas-por-cobrar",
      redirect: "/cuentas-por-cobrar/listar",
      name: "CuentasPorCobrar",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "AccountReceivableList",
          component: () => import("@/views/account-receivable/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "AccountReceivableAdd",
          component: () => import("@/views/account-receivable/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_account_receivable",
          name: "AccountReceivableEdit",
          component: () => import("@/views/account-receivable/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_account_receivable",
          name: "AccountReceivableView",
          component: () => import("@/views/account-receivable/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/ingresos",
      redirect: "/ingresos/listar",
      name: "Ingresos",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "IncomeList",
          component: () => import("@/views/income/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "IncomeAdd",
          component: () => import("@/views/income/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_income",
          name: "IncomeEdit",
          component: () => import("@/views/income/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_income",
          name: "IncomeView",
          component: () => import("@/views/income/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/egresos",
      redirect: "/egresos/listar",
      name: "Egresos",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "ExpenseList",
          component: () => import("@/views/expense/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "ExpenseAdd",
          component: () => import("@/views/expense/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_expense",
          name: "ExpenseEdit",
          component: () => import("@/views/expense/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_expense",
          name: "ExpenseView",
          component: () => import("@/views/expense/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/portadas",
      redirect: "/portadas/listar",
      name: "Portadas",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "CoverPageList",
          component: () => import("@/views/cover-page/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "CoverPageAdd",
          component: () => import("@/views/cover-page/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_cover_page",
          name: "CoverPageEdit",
          component: () => import("@/views/cover-page/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_cover_page",
          name: "CoverPageView",
          component: () => import("@/views/cover-page/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/mantenimiento",
      redirect: "/mantenimiento/listar",
      name: "Mantenimiento",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "MaintenanceList",
          component: () => import("@/views/maintenance/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "MaintenanceAdd",
          component: () => import("@/views/maintenance/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_maintenance",
          name: "MaintenanceEdit",
          component: () => import("@/views/maintenance/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_maintenance",
          name: "MaintenanceView",
          component: () => import("@/views/maintenance/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/entrada",
      redirect: "/entrada/listar",
      name: "Entrada",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "InputList",
          component: () => import("@/views/input/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "InputAdd",
          component: () => import("@/views/input/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_input",
          name: "InputEdit",
          component: () => import("@/views/input/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_input",
          name: "InputView",
          component: () => import("@/views/input/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },


    {
      path: "/salida",
      redirect: "/salida/listar",
      name: "Salida",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "OutputList",
          component: () => import("@/views/output/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "OutputAdd",
          component: () => import("@/views/output/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_output",
          name: "OutputEdit",
          component: () => import("@/views/output/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_output",
          name: "OutputView",
          component: () => import("@/views/output/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/kardex-inicial",
      redirect: "/kardex-inicial/listar",
      name: "KardexInicial",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "InitialKardexList",
          component: () => import("@/views/initial-kardex/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "InitialKardexAdd",
          component: () => import("@/views/initial-kardex/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_initial_kardex",
          name: "InitialKardexEdit",
          component: () => import("@/views/initial-kardex/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_initial_kardex",
          name: "InitialKardexView",
          component: () => import("@/views/initial-kardex/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/kardex",
      redirect: "/kardex/fisico",
      name: "Kardex",
      component: TheContainer,
      children: [
        {
          path: "fisico",
          name: "KardexPsysicalList",
          component: () => import("@/views/kardex/KardexPhysical"),
          beforeEnter: userGuard,
        },
        {
          path: "valorado",
          name: "KardexValuedList",
          component: () => import("@/views/kardex/KardexValued"),
          beforeEnter: userGuard,
        },
        {
          path: "stock-general",
          name: "StockGeneralList",
          component: () => import("@/views/kardex/StockGeneral"),
          beforeEnter: userGuard,
        },
      ],
    },


    {
      path: "/videoconferencia",
      redirect: "/videoconferencia/zoom",
      name: "Videoconferencia",
      component: TheContainer,
      children: [
        {
          path: "zoom",
          name: "VideoconferenceList",
          component: () => import("@/views/videoconference/Zoom"),
          beforeEnter: userGuard,
        },
      ],
    },


    {
      path: "/empresa",
      redirect: "/empresa/editar",
      name: "Eempresa",
      component: TheContainer,
      children: [
        {
          path: "editar",
          name: "BusinessEdit",
          component: () => import("@/views/business/Edit"),
          beforeEnter: userGuard,
        },
      ],
    },


    {
      path: "/pedidos",
      redirect: "/pedidos/listar",
      name: "Pedidos",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "OrderList",
          component: () => import("@/views/order/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "OrderAdd",
          component: () => import("@/views/order/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_order",
          name: "OrderEdit",
          component: () => import("@/views/order/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_order",
          name: "OrderView",
          component: () => import("@/views/order/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/guia-remision",
      redirect: "/guia-remision/listar",
      name: "GuiaRemision",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "ReferralGuideList",
          component: () => import("@/views/referral-guide/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "ReferralGuideAdd",
          component: () => import("@/views/referral-guide/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_referral_guide",
          name: "ReferralGuideEdit",
          component: () => import("@/views/referral-guide/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "completar/:id_referral_guide",
          name: "ReferralGuideComplete",
          component: () => import("@/views/referral-guide/Complete"),
          props: true,
        },
        {
          path: "ver/:id_referral_guide",
          name: "ReferralGuideView",
          component: () => import("@/views/referral-guide/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },

    {
      path: "/transformacion",
      redirect: "/transformacion/listar",
      name: "Transformacion",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "TransformationList",
          component: () => import("@/views/transformation/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "TransformationAdd",
          component: () => import("@/views/transformation/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_transformation",
          name: "TransformationEdit",
          component: () => import("@/views/transformation/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_transformation",
          name: "TransformationView",
          component: () => import("@/views/transformation/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },



    {
      path: "/requerimiento",
      redirect: "/requerimiento/listar",
      name: "Requerimiento",
      component: TheContainer,
      children: [
        {
          path: "listar",
          name: "RequirementList",
          component: () => import("@/views/requirement/List"),
          beforeEnter: userGuard,
        },
        {
          path: "nuevo",
          name: "RequirementAdd",
          component: () => import("@/views/requirement/Add"),
          beforeEnter: userGuard,
        },
        {
          path: "editar/:id_requirement",
          name: "RequirementEdit",
          component: () => import("@/views/requirement/Edit"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "ver/:id_requirement",
          name: "RequirementView",
          component: () => import("@/views/requirement/View"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },





    {
      path: "/reporte",
      redirect: "/reporte/venta",
      name: "Reporte",
      component: TheContainer,
      children: [
        {
          path: "venta",
          name: "ReportSaleList",
          component: () => import("@/views/report/Sale"),
          beforeEnter: userGuard,
        },
        {
          path: "venta-detallado",
          name: "ReportSaleDetailList",
          component: () => import("@/views/report/SaleDetail"),
          beforeEnter: userGuard,
        },
        {
          path: "compra",
          name: "ReportShoppingList",
          component: () => import("@/views/report/Shopping"),
          props: true,
          beforeEnter: userGuard,
        },
        {
          path: "compra-detallado",
          name: "ReportShoppingDetailList",
          component: () => import("@/views/report/ShoppingDetail"),
          props: true,
          beforeEnter: userGuard,
        },
      ],
    },


  ];
}
