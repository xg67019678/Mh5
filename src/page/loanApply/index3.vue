<template>
    <div class="merchantSettled">
        <van-nav-bar safe-area-inset-top :title="$t('贷款申请')" left-arrow @click-left="$router.go(-1)" fixed ref="header">
        </van-nav-bar>
        <div class="merchantSettled-wap">
            <div class="step-div">
                <div>
                    <div class="content content2">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="labelPosition"
                            label-width="200px" class="demo-ruleForm">
                            <el-form-item :label="$t('申请人')" prop="realName">
                                <el-input :placeholder="$t('真实姓名')" clearable :maxlength="100"
                                    v-model="ruleForm.realName"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('贷款期限')" prop="creditPeriod">
                                <el-select v-model="ruleForm.creditPeriod" :placeholder="$t('请选择贷款期限')"
                                    @change="handleSelectChange">
                                    <el-option v-for="item in creditPeriodList" :key="item.value" :label="item.label"
                                        :value="item.value" :style="item.dis && { color: '#999' }">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('申请金额')" prop="applyAmount">
                                <el-input :placeholder="amountMin + '-' + amountMax" type="number"
                                    v-model="ruleForm.applyAmount" @input="handleInput" @change="handleChange"
                                    clearable></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('贷款利率')" prop="interestRate">
                                <el-input :placeholder="rate * 100 + '%'" disabled></el-input>
                                <!-- v-model="ruleForm.interestRate" -->
                            </el-form-item>
                            <el-form-item :label="$t('放款方式')" prop="loanMethod">
                                <el-input :placeholder="$t('账户余额')" disabled></el-input>
                                <!-- v-model="ruleForm.loanMethod" -->
                            </el-form-item>
                            <el-form-item :label="$t('国籍')" prop="countryId">
                                <div @click="openNationality(2)">
                                    <el-input @click="openNationality(2)" readonly :placeholder="$t('请选择国家')"
                                        v-model="countryName"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item :label="$t('证件号码/护照号码')" prop="identification">
                                <el-input :placeholder="$t('请输入证件号码或者护照号')" clearable :maxlength="50"
                                    v-model="ruleForm.identification" @change="idCartChange"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('证件照/上传护照')">
                                <div class="uploder-center">
                                    <div class="uploder-two-wrap">
                                        <van-uploader :after-read="afterRead2" v-model="fileList2" @delete="handleDelete(2)"
                                            :max-count="1" accept=".png,.jpg,.jpeg" >
                                            <img v-if="creditId" class="card_img" :src="ruleForm.imgCertificateFace"
                                                alt="" />
                                        </van-uploader>
                                        <div class="tips">{{ $t('证件正面') }}</div>
                                    </div>
                                    <div class="uploder-two-wrap">
                                        <van-uploader :after-read="afterRead3" v-model="fileList3" @delete="handleDelete(3)"
                                            :max-count="1" accept=".png,.jpg,.jpeg" > 
                                            <img v-if="creditId" class="card_img" :src="ruleForm.imgCertificateBack"
                                                alt="" />
                                        </van-uploader>
                                        <div class="tips">{{ $t('证件反面') }}</div>
                                    </div>
                                    <div class="uploder-two-wrap">
                                        <van-uploader :after-read="afterRead4" v-model="fileList4" @delete="handleDelete(4)"
                                            :max-count="1" accept=".png,.jpg,.jpeg" >
                                            <img v-if="creditId" class="card_img" :src="ruleForm.imgCertificateHand"
                                                alt="" />
                                        </van-uploader>
                                        <div class="tips">{{ $t('手持证件照') }}</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="el-form-item__label" style="margin-bottom: -26px">{{ $t('拍摄示例') }}</div>
                                    <div class="correct-warp">
                                        <img src="@/assets/image/Merchant/01.png" />
                                        <img src="@/assets/image/Merchant/02.png" />
                                        <img src="@/assets/image/Merchant/03.png" />
                                    </div>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="checkout_box">
                        <van-checkbox shape="square" v-model="isAgree">{{ $t('我已阅读并同意') }}</van-checkbox>
                        <span @click="handleJump">《{{ $t('借款协议') }}》</span>
                    </div>

                    <div class="bottom">
                        <van-button type="primary" :color="mainColor" class="button" @click="requireSellerRegister">{{
                            $t('提交申请')
                        }}
                        </van-button>
                    </div>
                </div>
            </div>
        </div>

        <nationality-list ref='controlChild' :title="$t('选择区域码')" @getName="getName(arguments)" :isInit="false">
        </nationality-list>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { DropdownMenu, DropdownItem, Dropdown, Form, FormItem, Input, Select, Option, ColorPicker, } from 'element-ui'
import { Checkbox, Button, Uploader, Toast } from "vant";
import { uploadimg } from "@/API/commodity";
import { apiApplyLoan, apiApplyLoanConfig, apiBeforereApply } from '@/API/loan'
import { priceFormat, getStorage, isAlphanumeric } from '@/utils/utis'
import NationalityList from '@/components/NationalityList'
import AllNation from '@/components/NationalityList/countryList'

export default {
    name: "merchantSettled",
    data() {
        return {
            mainColor: process.env.VUE_APP_MAIN_COLOR,
            isAlphanumeric,
            creditPeriodList: [],
            lendableDays: [],
            defaultRate: [],
            amountMax: '',
            amountMin: '',
            rate: '',
            //
            priceFormat,
            getStorage,
            isCutting: false,// 是否裁剪
            imgFile: 'https://bpic.588ku.com/element_water_img/18/06/12/b2887846cb19ff36a5502401ac918809.jpg',
            ratioWidth: 1,// 裁剪比例：长 自由比例设置为: 0 即可
            ratioHeight: 1,// 裁剪比例：宽 自由比例设置为: 0 即可
            step: 1,
            checked: false,
            screenWidth: document.body.clientWidth,
            type: 'Email',//Email/Moblie
            uploadCheckIndex: 1,
            areaCode: 1,
            isAgree: false,
            countryName: '',
            ruleForm: {
                // loanMethod: this.$t('账户余额'),
                creditPeriod: '',
                realName: '',
                imgCertificateFace: '',
                imgCertificateBack: '',
                imgCertificateHand: '',
                // interestRate: '2%',
                countryId: '',
                applyAmount: '',
                identification: ''
            },
            labelPosition: 'top',
            isCode: true,
            rules: {
                identification: [
                    { required: true, message: this.$t('请输入证件号码或者护照号'), trigger: 'blur' },
                ],
                imgCertificateFace: [
                    { required: true, message: this.$t('请上传身份证正面'), trigger: 'blur' },
                ],
                imgCertificateBack: [
                    { required: true, message: this.$t('请上传身份证反面'), trigger: 'blur' },
                ],
                imgCertificateHand: [
                    { required: true, message: this.$t('请上传手持身份证'), trigger: 'blur' },
                ],
                // interestRate: [
                //     { required: true, message: this.$t('请输入贷款利率'), trigger: 'blur' },
                // ],
                realName: [
                    { required: true, message: this.$t('请输入真实姓名'), trigger: 'blur' },
                ],
                // loanMethod: [
                //     { required: true, message: this.$t('放款方式不能为空'), trigger: 'blur' },
                // ],
                applyAmount: [
                    { required: true, message: this.$t('请输入金额'), trigger: 'blur' },
                ],
                creditPeriod: [
                    { required: true, message: this.$t('请选择贷款期限'), trigger: 'change' },
                ],
                countryId: [
                    { required: true, message: this.$t('请选择国家'), trigger: 'change' },
                ],
            },
            options: [{ label: this.$t('身份证'), value: '身份证' }, { label: this.$t('护照'), value: '护照' }],
            fileList1: [],
            fileList2: [],
            fileList3: [],
            fileList4: [],
            CountryList: [
                {
                    label: '中国',
                    value: 'cn',
                    icon: require('@/assets/image/language/cn.png')
                },
            ],
            tabList: [this.$t('电子邮箱'), this.$t('手机号')],
            tabIndex: 0,
            lang: [
                {
                    title: '简体中文',
                    key: 'cn',
                    icon: require('@/assets/image/language/cn.png')
                },
                {
                    title: 'English',
                    key: 'en',
                    icon: require('@/assets/image/language/usa.png')
                },
                {
                    title: '繁体中文',
                    key: 'tw',
                    icon: require('@/assets/image/language/tw.png')
                }
            ],
            pageDiaCode: true,
            creditId: this.$route.query?.creditId || null
        };
    },

    computed: {
        languageIcon() {
            const language = this.$store.getters.language || 'tw'
            const icon = {
                'cn': require('@/assets/image/language/cn.png'),
                'en': require('@/assets/image/language/usa.png'),
                'tw': require('@/assets/image/language/tw.png')
            }
            return icon[language]
        },
        ...mapGetters({
            activeLang: 'language'
        })
    },
    components: {
        NationalityList,
        [DropdownMenu.name]: DropdownMenu,
        [DropdownItem.name]: DropdownItem,
        [Dropdown.name]: Dropdown,

        [Checkbox.name]: Checkbox,
        [Button.name]: Button,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Uploader.name]: Uploader,
        [Select.name]: Select,
        [Option.name]: Option,
        [Toast.name]: Toast
    },
    created() {
        if (this.screenWidth >= 500) {
            this.labelPosition = "left"
        } else {
            this.labelPosition = "top"
        }
        this.requireApplyLoanConfig()
        this.creditId && this.requireBeforereApply(this.creditId)
    },
    methods: {
        async requireApplyLoanConfig() {
            const res = await apiApplyLoanConfig()
            res.allLendableDays.forEach(x => {
                res.lendableDays.forEach(y => {
                    this.creditPeriodList.push({
                        label: x + this.$t('天'),
                        value: x,
                        dis: x !== y
                    })
                })
            })
            this.creditPeriodList = this.deduplication(this.creditPeriodList, 'value')
            this.creditPeriodList.forEach(x => {
                res.lendableDays.forEach(y => {
                    if (x.value == y) {
                        x.dis = false
                    }
                })
            })
            this.lendableDays = res.lendableDays
            this.amountMax = res.amountMax
            this.amountMin = res.amountMin
            this.rate = res.rate
        },
        async requireBeforereApply(creditId) {
            const res = await apiBeforereApply({ creditId })
            this.ruleForm.realName = res.realName
            this.ruleForm.applyAmount = res.applyAmount
            this.ruleForm.creditPeriod = res.creditPeriod + ''
            this.handleSelectChange(res.creditPeriod + '')
            // this.ruleForm.creditRate = res.creditRate
            this.rate = res.creditRate
            this.ruleForm.countryId = res.countryId
            this.ruleForm.identification = res.identification
            this.ruleForm.imgCertificateFace = res.imgCertificateFace
            this.ruleForm.imgCertificateBack = res.imgCertificateBack
            this.ruleForm.imgCertificateHand = res.imgCertificateHand
            Object.keys(AllNation).forEach(key => {
                if (AllNation[key]?.dialCode == res.countryId) {
                    this.countryName = AllNation[key]?.name
                }
            })
        },
        deduplication(arr, name) {
            const obj = {};
            return arr.reduce((prev, cur) => {
                obj[cur[name]] ? '' : obj[cur[name]] = true && prev.push(cur);
                return prev
            }, []);
        },
        // handleIdCardInput() {
        //     // ruleForm.identification
        //     const reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        //     console.log(`reg.test(value) ::->`, reg.test(this.ruleForm.identification));
        // },
        handleJump() {
            if(window.plus) {
                window.plus.runtime.openURL(encodeURI(`${window.origin}/promote/#/contract?lang=${getStorage('lang')}&wt=app`))
            } else {
                window.open(`${window.origin}/promote/#/contract?lang=${getStorage('lang')}`)
            }
        },
        idCartChange() {
            if (!this.isAlphanumeric(this.ruleForm.identification)) {
                this.$notify(this.$t('证件号码/护照号码验证未通过'))
                this.ruleForm.identification = ''
            }
        },
        // 裁剪
        handleCutting() {
            this.isCutting = true;
        },
        // 取消
        handleCancel() {
            this.isCutting = false;
            this.fileList1 = [];
        },
        ...mapMutations(['setLanguage']),
        handleDelete(index) {
            this[`fileList${index}`] = [];
        },
        // 提交申请贷款
        requireSellerRegister() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if (!this.ruleForm.imgCertificateFace || !this.ruleForm.imgCertificateBack || !this.ruleForm.imgCertificateHand) {
                        // Toast(this.$t('请上传证件照片'))
                        this.$notify(this.$t('请上传证件照片'))
                    } else {
                        if (!this.isAgree) return this.$notify(this.$t('请阅读并同意借款协议'))
                        this.creditId && (this.ruleForm.creditId = this.creditId)
                        apiApplyLoan(this.ruleForm).then(res => {
                            this.$notify(this.$t('申请成功'), 'success')
                            this.$router.replace('/loan/my')
                        }).catch(err => {
                            console.log(`err ::->`, err);
                        })
                    }
                } else {
                    return false;
                }
            })
        },
        handleSelectChange(val) {
            let day = this.lendableDays.find(x => x == val)
            !day && this.$notify(this.$t('未满足资质条件'))
            !day && (this.ruleForm.creditPeriod = '')
        },
        // 申请金额不能大于最大值
        handleInput() {
            if (this.ruleForm.applyAmount > this.amountMax) {
                this.ruleForm.applyAmount = this.amountMax
            } else if (this.ruleForm.applyAmount < 1) {
                this.ruleForm.applyAmount = ''
            }
        },
        // 申请金额不能小于最小值
        handleChange() {
            if (this.ruleForm.applyAmount < this.amountMin) {
                this.ruleForm.applyAmount = ''
                this.$notify(`${this.$t('申请金额不能小于')}${this.amountMin}`)
            }
        },
        openNationality(index) {
            if (index === 1) {
                this.isCode = true
            } else {
                this.isCode = false
            }
            this.$refs.controlChild.open()
        },
        getName(params) {
            this.ruleForm.countryId = params[2]
            this.countryName = params[0]
        },
        //文件上传
        afterRead1(file) {
            this.imgFile = file.content
            this.isCutting = true
            // Toast.loading({
            //   duration: 0,
            //   message: this.$t('上传中'),
            //   forbidClick: true,
            // })
            // console.log(file)
            // let formData = new FormData();//通过formdata上传
            // formData.append('file', file.file)
            // formData.append('moduleName', 'selle')

            // uploadimg(formData).then((data) => {
            //   Toast.clear()
            //   this.ruleForm.sellerImg = data
            // })

        },
        //文件上传
        afterRead2(file) {
            Toast.loading({
                duration: 0,
                message: this.$t('上传中'),
                forbidClick: true,
            })
            let formData = new FormData();//通过formdata上传
            formData.append('file', file.file)
            formData.append('moduleName', 'selle')
            uploadimg(formData).then((data) => {
                this.ruleForm.imgCertificateFace = data
            }).catch((error) => {
                this.fileList2 = [];
                Toast.fail(this.$t('上传失败'));
            }).finally(() => {
                Toast.clear()
            })
        },
        //文件上传
        afterRead3(file) {
            Toast.loading({
                duration: 0,
                message: this.$t('上传中'),
                forbidClick: true,
            })
            let formData = new FormData();//通过formdata上传
            formData.append('file', file.file)
            formData.append('moduleName', 'selle')
            uploadimg(formData).then((data) => {
                this.ruleForm.imgCertificateBack = data
            }).catch((error) => {
                this.fileList3 = [];
                Toast.fail(this.$t('上传失败'));
            }).finally(() => {
                Toast.clear()
            })
        },
        //文件上传
        afterRead4(file) {
            Toast.loading({
                duration: 0,
                message: this.$t('上传中'),
                forbidClick: true,
            })
            let formData = new FormData();//通过formdata上传
            formData.append('file', file.file)
            formData.append('moduleName', 'selle')
            uploadimg(formData).then((data) => {
                this.ruleForm.imgCertificateHand = data
            }).catch((error) => {
                this.fileList4 = [];
                Toast.fail(this.$t('上传失败'));
            }).finally(() => {
                Toast.clear()
            })
        }
    },

};
</script>

<style lang="scss" scoped>
.checkout_box {
    margin-left: 30PX;
    font-size: 14px;
    transform: translateY(20px);
    display: flex;
    justify-content: center;
    align-items: center;

    span {
        color: var(--main-color);
    }
}

.padding-tb {
    padding: 20Px 0 !important;
}

.color-yellow {
    color: var(--main-color) !important;
}

.card_img {
    width: 80px;
    height: 80px;
}

.merchantSettled {
    width: 100%;
    padding-top: 44px;

    .merchantSettled-wap {
        padding-top: 70px;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1200Px;
        margin: 0 auto;

        .step-div {
            width: 1197Px;
            background: #fff;

            border-radius: 4Px;
            margin-top: -86Px;

            .content {
                padding: 20Px 30Px;
                border: 1Px solid #eeeeee;

                .title {
                    font-size: 24Px;
                    color: #333333;
                    font-weight: 700;
                }

                p {
                    font-family: "PingFang HK";
                    font-style: normal;
                    font-size: 14Px;
                    line-height: 20Px;
                    color: #333333;
                    padding: 6Px 0;
                }
            }

            .bottom {
                height: 140Px;
                font-size: 14Px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                margin: 20Px 0;

                .button {
                    width: 475Px;
                }
            }
        }
    }
}

/deep/ .van-field__label {
    width: 200Px !important;
}

/deep/ .van-tabs__wrap {
    width: 250Px;
}


@media screen and (max-width: 500Px) {
    .merchantSettled {
        width: 100%;

        .merchantSettled-wap {
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100% !important;

            .step-div {
                width: 100%;
                background: #fff;

                border-radius: 4Px;
                margin-top: -86Px;

                .content {
                    padding: 20Px 30Px;
                    border: 1Px solid #eeeeee;

                    .title p {
                        font-family: "PingFang HK";
                        font-style: normal;
                        font-size: 14Px;
                        line-height: 20Px;
                        color: #333333;
                        padding: 6Px 0;
                    }
                }

                // .content2 {
                //   // padding: 20Px 10Px;
                // }

                .bottom {
                    height: 100Px;
                    font-size: 12Px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    margin: 20Px 0;

                    .button {
                        width: 80%;
                    }
                }
            }
        }
    }
}

.demo-ruleForm {
    .uploder-wrap {
        display: flex;
        align-items: center;

        .tips {
            font-size: 12Px;
            color: #999999;

            span {
                color: var(--main-color);
            }
        }
    }

    .uploder-center {
        display: flex;

        .uploder-two-wrap {
            margin-right: 30Px;

            .tips {
                color: #333333;
                font-size: 12Px;
                text-align: center;
                line-height: 16Px;
            }
        }
    }

    .correct-warp {
        display: flex;

        img {
            width: 100Px;
            margin-right: 20Px;
        }
    }

    .tab-wrap {
        display: flex;
        margin-top: 20Px;

        .tab-item {
            width: 98Px;
            height: 34Px;
            background: #EEEEEE;
            border-radius: 4Px;
            text-align: center;
            cursor: pointer;
            line-height: 34Px;
            margin-right: 20Px;
            color: #333333;
            font-size: 14Px;
        }

        .active {
            color: #fff !important;
            background: var(--main-color) !important;
        }
    }

    .code-input {
        width: 420Px;
    }

    .code-wrap {
        width: 133Px;
        height: 34Px;
        background: var(--main-color);
        border-radius: 4Px;
        margin-top: 8Px;
        text-align: center;
        line-height: 34Px;
        font-size: 14Px;
        color: #fff;
        cursor: pointer;
    }

    .el-dropdown {
        width: 100%;
    }

    .prepend-wrap {
        display: flex;
        align-items: center;
        padding: 0 20Px;

        .phone_number {
            flex: 1;
        }
    }

    .phone_number_wrap {
        /deep/ .el-input__inner {
            width: 345px;
        }

    }
}

.option-wrap {
    display: flex;
    align-items: center;
    font-size: 14Px;

    img {
        height: 30Px;
        margin-right: 5Px;
    }
}

.lang-item {
    display: flex;
    align-items: center;

    img {
        width: 20Px;
        height: 20Px;
        margin-right: 5px;
    }
}

/deep/ .el-form-item__label {
    text-align: left !important;
    padding: 0 !important;
    transform: translateY(5px);
}

/deep/ .el-form-item {
    margin-bottom: 10px;
}

/deep/ .el-select-dropdown__list {
    padding: 10Px 0 !important;
}

/deep/ .el-select .el-input .el-select__caret {
    font-size: 15Px;
    display: flex;
    align-items: center;
}

.el-select-dropdown__item.selected {
    color: var(--main-color) !important;
}

.el-select .el-input.is-focus .el-input__inner {
    padding-left: 30Px !important;
}

/deep/ .el-input__inner {
    height: 44px;
    width: 345px;
    font-size: 14Px;
    border: 1px solid #EEEEEE;

    &::placeholder {
        font-size: 14Px;
        color: #999999;
    }
}

/deep/ .van-uploader__upload-icon {
    font-size: 35Px !important;
    color: #AAAAAA !important;
}

/deep/.el-input-group__prepend {
    width: 100Px !important;
    padding: 0 !important;
    background: none !important;
    font-size: 14Px;
}

@media screen and (max-width: 500Px) {
    /deep/ .el-input__inner {
        width: 100% !important;
    }

    /deep/ .el-select {
        width: 100%;
    }

    .phone_number_wrap {
        /deep/ .el-input__inner {
            width: 100% !important;
        }

    }

    .demo-ruleForm .code-input {
        width: 100%;
    }

    .correct-warp {
        img {
            display: block;
            margin-top: 20Px;
            margin-right: 10Px !important;
        }
    }
}

/deep/ .van-checkbox__icon--checked .van-icon {
    background-color: var(--main-color) !important;
    border-color: var(--main-color) !important;
}

/deep/ .el-input.is-disabled .el-input__inner {
    background-color: #fff;
}
</style>
