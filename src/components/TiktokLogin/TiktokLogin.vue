<template>
  <img
    class="icon"
    :src="require('@/assets/image/login/tiktok.png')"
    @click="login"
  />
</template>

<script>
import axios from "axios";

export default {
  name: "tiktok-login",

  data() {
    return {
      error: "",
    };
  },

  props: {},

 async created() {
    const code = this.$route.query.code;
    const type = this.$route.query.type; //类型是1line登陆还是2tiktok登陆
    
    if (type == 2) {
      if (!code) return;
      console.log(code, "code");
      this.$emit("tiktok", {code:code});
      
    //   const result = await this.getToken(code);
        // console.log(result)
    //   const { data } = await this.getProfile(result.token);

    //   if (!this.error) {
    //     const response = Object.assign(data, result.getPostable());
    //     this.$emit("result", response);
    //   }
    }
  },

  methods: {
    openwindow(aa) {
      return window.open(
        aa,
        "newindow",
        "height=600,width=900,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no"
      );
    },
    login() {
      let csrfState = Math.random().toString(36).substring(2);
      //   res.cookie("csrfState", csrfState, { maxAge: 60000 });
      let url = "https://www.tiktok.com/v2/auth/authorize/";
      // the following params need to be in `application/x-www-form-urlencoded` format.
      url += "?client_key=sbaw6ityqubmjmxj91";
      url += "&scope=user.info.basic";
      url += "&response_type=code";
      url += "&redirect_uri=https://login.tkshouppig.com?type=2";
      url += "&state=" + csrfState;

      window.location.href = url;
    },

    async getProfile(token) {
      return await axios.post("https://login.tkshouppig.com/api.php", {
        data
      });
    },

    // async checkFriend(token) {
    //     const { data } = await axios.get('https://api.line.me/friendship/v1/status', {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })

    //     return data.friendFlag
    // }
  },
};
</script>

<style lang="scss">
.btn-block + .btn-block {
  margin-top: 5px;
}
.btn-social {
  position: relative;
  padding-left: 44px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-block {
  display: block;
  width: 100%;
}
.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}
.btn-line {
  color: #fff;
  background-color: #00b900;
  border-color: rgba(0, 0, 0, 0.2);
}
.btn-social > :first-child {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 32px;
  line-height: 34px;
  font-size: 1.6em;
  text-align: center;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}
.fa-line {
  background: url(https://d.line-scdn.net/r/web/social-plugin/img/common/line_v3.png)
    3px 4px no-repeat;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 32px;
  height: 100%;
  line-height: 34px;
  font-size: 1.6em;
  text-align: center;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  background-size: 26px 24px;
}
</style>
