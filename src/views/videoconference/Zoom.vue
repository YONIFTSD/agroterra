<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Videoconferencia</strong>
          </CCardHeader>
          <CCardBody>
 
          <!-- <div class="col-md-12" style="height:1000px">
              <vue-jitsi-meet ref="jitsiRef" domain="meet.jit.si"  :options="jitsiOptions"></vue-jitsi-meet>
          </div> -->
     
            
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
// npm install @mycure/vue-jitsi-meet
// import { JitsiMeet } from '@mycure/vue-jitsi-meet';
export default {
  name: 'HelloWorld',
  components: {
    // VueJitsiMeet: JitsiMeet
  },
  created () {
  
  },
  mounted() {
  
  },
  data () {
    return {
      apiKey: "",
     
    }
  },
  methods: {
    // onIFrameLoad () {
    //   // do stuff
    // },
  },
  computed: {
    // user: function () {
    //   let user = window.localStorage.getItem("user");
    //   user = JSON.parse(JSON.parse(je.decrypt(user)));
    //   return user;
    // },
    // jitsiOptions () {
    //   let user = window.localStorage.getItem("user");
    //   user = JSON.parse(JSON.parse(je.decrypt(user)));

    //   return {
    //     roomName: 'some-room-name',
    //     noSSL: false,
    //     userInfo: {
    //       email: user.email,
    //       displayName: user.name,
    //     },
    //     configOverwrite: {
    //       enableNoisyMicDetection: false
    //     },
    //     interfaceConfigOverwrite: {
    //       SHOW_JITSI_WATERMARK: false,
    //       SHOW_WATERMARK_FOR_GUESTS: false,
    //       SHOW_CHROME_EXTENSION_BANNER: false
    //     },
    //     onload: this.onIFrameLoad
    //   };
    // },
  },
}
</script>
