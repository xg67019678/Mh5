<template>
    <div class="commodity" style="min-height: 100vh;">
        <van-nav-bar safe-area-inset-top fixed left-arrow :title="$route.query.className" @click-left="onClickLeft" />
        <div style="width: 100%;" class="h46"></div>
        <div style="width: 100%;" class="h46"></div>
        <div class="class_filter_div">
            <div :class="['filter-item', filterIndex == index && 'active']" v-for="(item, index) in filter_list"
                :key="index" @click="selectIndex(item, index)">
                <div>{{ item }}</div>
                <div class="right_icon" v-if="index !== 0 && item">
                    <img v-if="highLow === 1 || filterIndex !== index" src="@/assets/image/shop/1.jpg" alt="">
                    <img v-if="highLow === 2 && filterIndex === index" src="@/assets/image/shop/2.jpg" alt="">
                    <img v-if="highLow === 3 && filterIndex === index" src="@/assets/image/shop/3.jpg" alt="">
                </div>
            </div>
        </div>
        <div class="padd-15">
            <van-skeleton :row="6" class="commodity_skeleton skeleton" :loading="shopLoading">
                <van-pull-refresh style="min-height: 100vh;" v-model="refreshing" @refresh="onRefresh"
                    :pulling-text="$t('下拉即可刷新')" :loosing-text="$t('释放即可刷新')">
                    <van-list v-model="loading" :finished="finished" @load="onLoad" :loading-text="$t('加载中')">
                        <div class="list">
                            <div v-for="(item, index) in list" class="list-item commodity" @click="openDetails(item)">
                                <div class="commodity-img">
                                    <img :src="item.imgUrl1 || $defaultGoodsImage" alt="" />
                                </div>
                                <div class="money padd-15">${{ priceFormat(item.discountPrice || item.sellingPrice) }}</div>
                                <div class="text padd-15">{{ $t('卖出') }} {{ priceFormatInt(item.soldNum) }}</div>
                                <!-- <div class="text padd-15">{{ $t('浏览量') }} 8464</div> -->
                                <div class="title padd-15">{{ $textOmit(item.name) }}</div>
                            </div>
                        </div>
                    </van-list>
                    <van-empty v-if="!list.length" :description="$t('暂无数据')" />
                </van-pull-refresh>
            </van-skeleton>
        </div>
        <!-- <div style="width: 100%;height: 90px;"></div> -->
        <van-action-sheet v-model="show" :actions="actions" @cancel="onCancel" :cancel-text="$t('取消')" close-on-click-action
            @select="onSelect" />
    </div>
</template>
<script>
import { NavBar, Tab, Tabs, PullRefresh, List, ActionSheet, Empty, Skeleton } from 'vant';
import { home_sellerGoods } from "@/API/home";
import { priceFormat, priceFormatInt } from '@/utils/utis'
// import { throws } from 'assert';
export default {
    data() {
        return {
            mainColor: process.env.VUE_APP_MAIN_COLOR,
            priceFormat,
            priceFormatInt,
            highLow: 1,
            list: [],
            loading: false,
            finished: false,
            show: false,
            refreshing: false,
            filter_list: [this.$t('综合'), this.$t('销量'), this.$t('价格'), this.$t('新品')],
            filterIndex: 0,
            page_no: 0,
            isPrice: 0,
            newTime: 0,
            isHot: 0,
            actions: [],
            active1: 0,
            active2: 0,
            active3: 0,
            actions1: [{ name: this.$t('价格由高到低'), value: 1 }, { name: this.$t('价格由低到高'), value: 2 }],
            actions2: [{ name: this.$t('销售量由高到低'), value: 1 }, { name: this.$t('销售量由低到高'), value: 2 }],
            actions3: [{ name: this.$t('时间由远到近'), value: 1 }, { name: this.$t('时间由近到远'), value: 2 }],
            shopLoading: true,
            itemName: process.env.VUE_APP_ITEM_NAME,
        }
    },
    components: {
        [NavBar.name]: NavBar,
        [Tab.name]: Tab,
        [Empty.name]: Empty,
        [Tabs.name]: Tabs,
        [List.name]: List,
        [PullRefresh.name]: PullRefresh,
        [ActionSheet.name]: ActionSheet,
        [Skeleton.name]: Skeleton,

    },
    // mounted() {
    //     console.log(`$route.query.className ::->`, this.$route.query);
    // },
    created() {
        const tempObj = JSON.parse(sessionStorage.getItem("classificationState"))

        if (['Argos','ArgosShop'].includes(this.itemName)) {
            this.filter_list = ['', this.$t('销量'), this.$t('价格'), ''];
            this.selectIndex({}, 1, 3)
        } else if (tempObj?.filterIndex) {
            this.filterIndex = tempObj.filterIndex
            this.highLow = tempObj.highLow
            this.selectIndex({}, tempObj.filterIndex, tempObj.highLow)
        } else {
            this.onLoad();
        }
    },
    methods: {
        onRefresh() {
            // 清空列表数据
            this.finished = false;
            this.page_no = 0
            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.shopLoading = this.loading = true;
            this.onLoad();
        },
        onSelect(item) {
            if (this.filterIndex == 1) {
                this.isPrice = 0
                this.isHot = item.value
                this.newTime = 0
                this.actions2.map(info => {
                    info.color = ''
                    if (info.value == item.value) {
                        info.color = this.mainColor
                    }
                })
            } else if (this.filterIndex == 2) {
                this.isPrice = item.value
                this.isHot = 0
                this.newTime = 0
                this.actions1.map(info => {
                    info.color = ''
                    if (info.value == item.value) {
                        info.color = this.mainColor
                    }
                })
            } else {
                this.isPrice = 0
                this.isHot = 0
                this.newTime = item.value
                this.actions3.map(info => {
                    info.color = ''
                    if (info.value == item.value) {
                        info.color = this.mainColor
                    }
                })
            }
            this.page_no = 0
            this.list = []
            this.onLoad();
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        },
        onCancel() {
            if (this.filterIndex == 1) {
                this.actions1.map(info => {
                    info.color = ''
                })
                this.isPrice = 0
            } else if (this.filterIndex == 2) {
                this.actions2.map(info => {
                    info.color = ''
                })
                this.isHot = 0
            } else {
                this.actions3.map(info => {
                    info.color = ''
                })
                this.newTime = 0
            }
            this.page_no = 0
            this.list = []
            this.onLoad();
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        },
        onLoad() {
            // this.shopLoading = true
            if (this.refreshing) {
                this.list = [];
                this.refreshing = false;
            }
            this.tuanduimingxi_post()
        },
        tuanduimingxi_post() {
            this.page_no++
            var data = {
                'pageNum': this.page_no,
                'pageSize': 10,
                'categoryId': this.$route.query.categoryId,
                'isPrice': this.isPrice,
                'newTime': this.newTime,
                'isHot': this.isHot,
            }
            !data.categoryId && delete data.categoryId;
            !data.isHot && delete data.isHot;
            !data.isPrice && delete data.isPrice;
            !data.newTime && delete data.newTime;
            home_sellerGoods(data).then(res => {
                for (let i = 0; i < res.pageList.length; i++) {
                    this.list.push(res.pageList[i]);
                }
                this.shopLoading = this.loading = false;
                if (res.pageList.length == 0) {
                    this.finished = true;
                }
            })
        },
        openDetails(item) {
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
            this.$router.push('/CommodityDetails?sellerGoodsId=' + item.id)
        },
        onClickLeft() {
            this.$router.back()
        },
        selectIndex(item, index, highLow) {
            this.shopLoading = true
            if (!highLow) {
                if (this.filterIndex === index) {
                    this.highLow = this.highLow === 2 ? 3 : this.highLow === 3 ? 2 : 2
                } else {
                    this.highLow = 2
                }
            } else {
                this.highLow = highLow
            }
            this.filterIndex = index;
            if (index == 1) {
                // this.isPrice = 0
                // this.newTime = ''
                this.actions = this.actions2;
                this.onSelect({ value: this.highLow - 1 })
            } else if (index == 2) {
                this.actions = this.actions1;
                // this.isPrice = 1
                // this.newTime = ''
                this.onSelect({ value: this.highLow - 1 })
            } else if (index == 3) {
                // this.isPrice = 0
                // this.newTime = 'new'
                this.actions = this.actions3;
                this.onSelect({ value: this.highLow - 1 })
            } else {
                this.isPrice = 0
                this.newTime = ''
                this.isPrice = 0;
                this.newTime = 0;
                this.isHot = 0;
                this.page_no = 0;
                this.list = [];
                this.onLoad();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;

            }

            this.filterIndex = index;
            sessionStorage.setItem("classificationState", JSON.stringify({ filterIndex: this.filterIndex, highLow: this.highLow }))
        },
    }
}
</script>
<style lang="scss" scoped>
.commodity {
    position: relative;
    background: #fff;
    min-height: 100%;
    font-size: 14px;

    .pw1 {
        width: 375px;
    }

    .padd-15 {
        padding: 0 15px;
        box-sizing: border-box;
        transform: translateY(-10px);
    }

    .search-wrap {
        display: flex;
        align-items: center;
        position: fixed;
        top: 44px;
        left: 0;
        width: 100%;
        z-index: 1;
        background: #fff;

        .left {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 36px;
                height: 36px;
            }
        }

        .right {
            flex: 1;

            .van-search .van-cell {
                padding: 8px 8px 8px 0;
            }
        }
    }

    .list {
        display: flex;
        flex-wrap: wrap;

        .list-item {
            width: 46%;
            height: 285px;
            border: 1px solid #EEEEEE;
            margin-top: 20px;

            .commodity-img {
                height: 160px;
                padding: 10px;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    height: fit-content;
                    width: auto;
                    max-height: 100%;
                    max-width: 100%;
                }
            }

            .money {

                color: var(--main-color);
                font-weight: 500;
                font-size: 16px;
                margin-top: 10px;
            }

            .text {
                color: #999999;
                font-size: 12px;
                margin-top: 3px;
            }

            .title {
                height: 37px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -moz-box-orient: vertical;
                box-orient: vertical;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                margin-top: 4px;
            }
        }

        .list-item:nth-child(even) {
            margin-left: 6%;
        }
    }

    .class_filter_div {
        position: fixed;
        top: 40px;
        left: 0;
        z-index: 99;
        width: calc(100% - 28px);
        height: 46px;
        background: #fff;
        margin: 0 14px 0 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow-x: auto;

        .right_icon {
            margin-left: 5px;
            transform: translateY(-1px);

            img {
                width: 10px;
                height: 15px;
                vertical-align: middle;
            }
        }

        .filter-item {
            margin-left: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;

            &:first-child {
                margin-left: 0;
            }

            &.active {
                color: var(--main-color);
            }

            div {
                white-space: nowrap;
            }

            // .icons {
            //     display: flex;
            //     flex-direction: column;
            //     justify-content: flex-start;
            //     align-items: center;

            //     .top-icon {
            //         width: 15px;
            //         height: 9px;
            //         margin-left: 3px;
            //     }

            //     .top-icon1 {
            //         margin-top: 5px;
            //     }

            //     .top-bg-icon {
            //         background: url("@/assets/image/shop/top1.png") center no-repeat;
            //         background-size: 100% 100%;
            //     }

            //     .down-bg-icon {
            //         background: url("@/assets/image/shop/top2.png") center no-repeat;
            //         background-size: 100% 100%;
            //     }
            // }
        }
    }
}

/deep/ .van-field__left-icon {
    display: flex;
    align-items: center;
    width: 16px;
    margin-right: 8px;

    >img {
        width: 100%;
        height: auto;
    }
}

:deep(.van-skeleton__row) {
    margin-top: 10px;
}



.arrow-right {
    width: 10px;
}
</style>
