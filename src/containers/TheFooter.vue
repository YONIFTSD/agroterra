<template>
  <CFooter :fixed="false">
    <div>
      <a >Copyright</a>
      <span class="ml-1">&copy; {{new Date().getFullYear()}} Todos los derechos reservados</span>
    </div>
    <div class="mfs-auto">
      <span v-if="author == 0">Este sistema de facturación electrónica está desarrollado por Yonathan William M. C.</span>
      <span v-if="author == 1">Este sistema de facturación electrónica está desarrollado por <a href="https://wa.me/51928872148" target="_blank">Yonathan William M. C.</a></span>
    </div>
  </CFooter>
</template>

<script>
const je = require("json-encrypt");
const axios = require("axios").default;
import { mapState,mapActions } from "vuex";
export default {
  name: 'TheFooter',
  data() {
    return {
      author:""
    };
  },
   methods: {
    ViewBussiness,
  },
  mounted() {
    this.ViewBussiness();

  },
  computed: {
    ...mapState(["url_base"]),
    user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user;
    },
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
}

function ViewBussiness() {
  let me = this;
  let url = this.url_base + "get-business";

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
  .then(function (response) {
    if (response.data.status == 200) {
      me.author = response.data.result.author;
      
    }
  })
}
</script>
