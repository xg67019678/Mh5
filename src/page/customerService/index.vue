<template>
    <div class="service-box" :style="isApp ? { height: '93%' } : null">

        <!--      <div class="h-10 bg-grey w-full"></div> -->

        <div class="back" @click="$router.go(-1)">
            <!-- <img src="@/assets/image/back.png" alt=""> -->
        </div>
        <iframe ref="frame" :src="serviceUrl" frameborder="0" width="100%" height="100%"
            :class="[this.localIsList && 'local_list']"></iframe>
    </div>
</template>

<script>
import { Icon } from 'vant';
import { mapGetters } from "vuex";
export default {
    name: "CustomerService",
    data() {
        return {
            isFirstRequest: true,
            token: "",
            serviceUrl: "",
            pageHeight: "",
            lang: "",
            sellerId: "",
            storeName: "",
            isApp: window.plus ? true : false,
            path: "",
            localIsList: false,
            isShowIcon: false
        };
    },
    components: {
        [Icon.name]: Icon,
    },
    computed: {
        ...mapGetters({
            userInfo: "userInfo",
        }),
    },
    mounted() {
        // this.$refs.header.$refs.navBar.offsetHeight - 44;
        this.init()
        // this.localIsList = this.$route.query?.path == 'contacts'
        // 监听 message 事件
        window.addEventListener('message', (e) => {
            e.data == 'back' && this.$router.push('/');
            // this.localIsList = this.isShowIcon = e.data == '/h5/message/yellow'
        });
    },
    methods: {
        onClickLeft() {
            // 返回
            this.$router.push('/');
        },
        // onClickRight() {
        //     const base_url = process.env.VUE_APP_IS_APP ? this.$store.state.multiItem[process.env.VUE_APP_ITEM_NAME].app_url : location.origin
        //     this.$refs.frame.contentWindow.postMessage('toContacts', base_url);
        //     // this.$refs.frame.contentWindow.postMessage('toContacts', 'https://thsjbvh.site');

        //     // this.$refs.frame.contentWindow.postMessage('toContacts', 'http://localhost:3000');
        // },
        init() {
            this.token = localStorage.getItem("token");
            this.lang = localStorage.getItem("lang");
            // this.lang = this.lang?.replace('"', "")?.replace('"', "");
            this.pageHeight = document.documentElement.clientHeight - 44
            this.sellerId = this.$route.query?.path ? '' : localStorage.getItem("sellerId");
            this.storeName = this.$route.query?.path ? '' : localStorage.getItem("storeName");
            // this.lang = this.lang == "cn" ? "cn" : this.lang == "en" ? "en" : "tw";
            const shopName = this.$route.query?.path ? this.$t('消息') : sessionStorage.getItem('shopName')
            const goodsId = this.$route.query?.goodsId
            let base_url = window?.plus ? this.$store.state.app.app_domain : location.origin
            if (location.origin.indexOf('localhost') > -1) {
                base_url = 'https://thsjbvh.site'
            }
            const qs = this.sellerId
                ? `?partyid=${this.sellerId}&token=${this.token}&lang=${this.lang}&height=${this.pageHeight}px`
                : `?token=${this.token}&lang=${this.lang}&height=100%`;
            console.log(`shopName ::->`, shopName);
            this.serviceUrl = `${base_url}/chat/#/h5/${this.$route.query?.path || "message"
                }/yellow${qs}&loginType=user&nohead=true&isH5=true&selfimg=${this.userInfo?.avatar || 1}${shopName ? '&shopName=' + shopName : ''}${(goodsId && goodsId != 'undefined') ? '&productId=' + goodsId : ''}`;
        }
    },
};
</script>
<style lang="scss" scoped>
// iframe {
//     transform: translateY(44px);
// }
// .local_list {
//     transform: translateY(0) !important;
// }
.notify {
    width: 100%;
    height: 77px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid #F4F6F9;

    .img {
        width: 40px;
        height: 40px;
        background: #ccc;
        border-radius: 50%;
    }

    .content1 {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 70vw;

        span {
            &:nth-child(1) {
                font-weight: 600;
                font-size: 14px;
            }

            &:nth-child(2) {
                font-size: 12px;
                color: #999;
            }
        }
    }
}

.back {
    width: 44px;
    height: 44px;
    position: fixed;
    top: 0;
    left: 0;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;

}

.service-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.time {
    padding-top: 0;
    padding-bottom: 10px;
    padding-left: 54px;

    &.justify-end {
        padding-right: 54px;
    }
}

.content {
    overflow-y: scroll;
    height: calc(100vh - 110px);
    position: fixed;
    width: 100%;
}

.break-word {
    word-break: break-word;
}

// .max-w-230 {
//   //max-width: 230px;
// }
.responser {
    position: relative;
    //&::after {
    //    content: '';
    //    width:0;
    //    height:0;
    //    border-top:10px solid transparent;
    //    border-bottom:10px solid transparent;
    //    border-right:20px solid #f3f3f3;
    //    position: absolute;
    //    left: -20px;
    //    top: 20px;
    //}
}

.fasong {
    width: 74px;
    height: 34px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 34px;
    text-align: center;
    color: #ffffff;
    // background: var(--main-color);
    background: var(--main-color);
    border-radius: 45px;
}

.etyaak0 {
    position: absolute;
    left: 0;
    bottom: 784px;
}
</style>
