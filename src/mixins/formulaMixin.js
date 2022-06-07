/*
 * @Author: max
 * @Date: 2022-02-11 13:53:25
 * @LastEditTime: 2022-05-31 18:12:48
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/mixins/formulaMixin.js
 */
import { getDeviceAction, getPlantList, getWorkshopAction, getPlcAction } from "@/services/eap.js";
export const formulaMixin = {
    data() {
        return {
            workshopList: [],
            plantList: "",
            LineList: [],
            deviceList: [],
            plcList: [],
        }
    },
    methods: {
        getPlant() {
            let parmas = {
                entertypecode: "PLANT",
            };
            getPlantList(parmas, "getlistbytypecode").then((res) => {
                if (res.data.success) {
                    this.plantList = res.data.data;
                }
            });
        },
        //生产工厂选择
        plantChange(e) {
            this.plantId = e;
            let parmas = {
                plantid: e,
            };
            getWorkshopAction(parmas, "getlist").then((res) => {
                if (res.data.success) {
                    this.workshopList = res.data.data;
                    this.searchForm.setFieldsValue({
                        workshopid: "",
                        lineid: "",
                        equimentid: "",
                        plcid: "",
                    });
                }
            });
        },
        //生产车间选择
        workshopChange(e) {
            let parmas = {
                plantid: this.plantId,
                workshopid: e,
            };
            getPlantList(parmas, "getlist").then((res) => {
                if (res.data.success) {
                    this.LineList = res.data.data;
                    this.searchForm.setFieldsValue({
                        lineid: "",
                        equimentid: "",
                        plcid: "",
                    });
                }
            });
        },
        //生产产线选择
        lineChange(e,type) {
            let parmas = {
                lineid: e,
            };
            getDeviceAction(parmas, "getlist").then((res) => {
                if (res.data.success) {
                    this.deviceList = res.data.data;
                    this.searchForm.setFieldsValue({
                        equimentid: "",
                        plcid: "",
                    });
                }
            });
            if(type){
                this.getDetailList(e)
            }
        },
        //设备选择
        deviceChange(e,type) {
            let values = this.searchForm.getFieldsValue();
            console.log("values===",values)
            let params = {
                lineid: values.LineId,
                equimentid: e,
            };
            getPlcAction(params, "getlist").then((res) => {
                if (res.data.success) {
                    this.plcList = res.data.data;
                    this.searchForm.setFieldsValue({
                        plcid: "",
                    });
                }
            });
            if(type){
                this.getDetailList(values.LineId,e)
            }
        },
    },
}