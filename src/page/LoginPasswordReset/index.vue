<template>
    <div class="LoginPasswordReset" style="min-height: 100vh;">
        <Vcode style="direction: ltr;" :imgs="[img1, img2, img3, img4, img5]" :show="show" @success="onSuccess" :canvasHeight="200"
            @close="show = false;" :sliderText="$t('拖动滑块以完成拼图')" :successText="$t('验证通过!')" :failText="$t('验证失败,请重试')" />

        <van-nav-bar safe-area-inset-top fixed :title=" $t('重置密码') " left-arrow @click-left=" onClickLeft " />
        <div style="width: 100%;" class="h46"></div>
        <div class="nr">
            <div class="biaoti">{{ $t('原密码') }}</div>
            <div class="shuru">
                <el-input :placeholder=" $t('请输入原密码') " maxlength="20" v-model=" it.input1 " show-password clearable>
                </el-input>
            </div>
            <div class="biaoti">{{ $t('新密码') }}</div>
            <div class="shuru">
                <el-input :placeholder=" $t('请输入新密码') " maxlength="20" v-model=" it.input2 " show-password clearable>
                </el-input>
            </div>
            <div class="biaoti">{{ $t('再次输入新密码') }}</div>
            <div class="shuru">
                <el-input :placeholder=" $t('请再次输入新密码') " maxlength="20" v-model=" it.input3 " show-password clearable>
                </el-input>
            </div>
            <div class="tijiao" @click=" biaodantijiao ">{{ $t('提交') }}</div>
        </div>
    </div>
</template>
<script>
import { NavBar, Toast } from 'vant';
import { updateOldAndNewPsw } from "@/API/user";
import { isLogin } from '@/utils/utis'
import Vcode from "vue-puzzle-vcode";
import router from '@/router/router';
export default {
    data() {
        return {
            img1: require('@/assets/image/slider/1.png'),
            img2: require('@/assets/image/slider/2.png'),
            img3: require('@/assets/image/slider/3.png'),
            img4: require('@/assets/image/slider/4.png'),
            img5: require('@/assets/image/slider/5.png'),
            show: false,
            it: {
                input1: '',
                input2: '',
                input3: '',
            }
        }
    },
    components: {
        [NavBar.name]: NavBar,
        Vcode
    },
    created() {
        if (!isLogin()) {
            this.$router.push('/')
        }
    },
    methods: {
        onClickLeft() {
            this.$router.push({ path: '/Setting', dir: 'left' })
        },

        biaodantijiao() {
            const t = this
            if (t.it.input1 === '') {
                Toast(t.$t('请输入原密码'));
                return
            }
            if (t.it.input2 === '') {
                Toast(t.$t('请输入新密码'));
                return
            }
            const reg = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;'"\\|,.<>?~`\-=/]{6,20}$/;
            if (!reg.test(t.it.input2)) {
                Toast(t.$t('请输入 6-20 位由数字或字母组成的密码'));
                return;
            }
            if (t.it.input3 !== t.it.input2) {
                Toast(t.$t('两次密码输入不一致'));
                return
            }
            if(t.it.input1 == t.it.input2){
                Toast(t.$t('新密码不能与原密码相同'));
                return
            }
            this.submitHandle()
            //   this.show = true
        },

        onSuccess() {
            this.submitHandle()
            this.show = false
        },

        submitHandle() {
            Toast.loading({
                duration: 0,
                message: this.$t('提交中'),
                forbidClick: true,
            })

            const params = {
                old_password: encodeURI(this.it.input1),
                password: encodeURI(this.it.input2),
                re_password: encodeURI(this.it.input3)
            }
            updateOldAndNewPsw(params).then(async () => {
                Toast.success(this.$t('修改成功'))
                await this.$store.dispatch('getUserInfo')
                this.onClickLeft()
                // localStorage.removeItem('token')
                // this.$router.push('/login')
            }).catch(err => {
                Toast.clear()
                // Toast.fail(err.msg)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.LoginPasswordReset {
    width: 100%;

    /deep/ .el-input {
        input:focus {
            //   border-color: var(--main-color);
            border-color: var(--main-color);
        }
    }

    .nr {
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;

        .biaoti {
            margin-top: 20px;
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            color: #333333;
        }

        .shuru {
            width: 100%;
            margin-top: 5px;
        }

        .tijiao {
            margin-top: 40px;
            width: 100%;
            height: 44px;
            background: var(--main-color);
            border-radius: 4px;
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 44px;
            /* identical to box height, or 100% */

            text-align: center;

            color: #FFFFFF;
        }
    }
}
</style>
