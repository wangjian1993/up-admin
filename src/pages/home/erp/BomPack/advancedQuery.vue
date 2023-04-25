<template>
  <div>
    <a-modal :title="queryType == 1 ? '包材高级查询' : '线材高级查询'" :visible="visible" @ok="handleOk" @cancel="handleCancel" width="50%">
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="品号" v-for="(domain, index) in itemcodeForm" :key="'itemcodeForm' + index">
          <a-input style="width: 200px" v-model="domain.value" allowClear placeholder="请输入品号" />
          <a-dropdown style="margin:0 10px">
            <a-button shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
            <a-menu slot="overlay">
              <a-menu-item v-for="(item, indexs) in filtrate" :key="indexs" @click="itemFiltrete(index, 'itemcode', item)">
                <a href="javascript:;" :class="domain.where == item ? 'menuBg' : ''">{{ item }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <span>{{ domain.where }}</span>
          <a-icon style="margin-left: 10px" class="dynamic-delete-button" v-if="index == 0" type="plus" @click="addForm(1)" />
          <a-icon style="margin-left: 10px" class="dynamic-delete-button" v-if="!index == 0" type="minus-circle-o" @click="removeDomain(domain, 'itemcodeForm')" />
        </a-form-model-item>
        <a-form-model-item ref="itemname" has-feedback label="品名" prop="itemname" v-for="(domain, index) in itemnameForm" :key="'itemnameForm' + index">
          <a-input style="width: 200px" v-model="domain.value" allowClear placeholder="请输入品名" />
          <a-dropdown style="margin:0 10px">
            <a-button shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
            <a-menu slot="overlay">
              <a-menu-item v-for="(item, indexs) in filtrate" :key="indexs" @click="itemFiltrete(index, 'itemname', item)">
                <a href="javascript:;" :class="domain.where == item ? 'menuBg' : ''">{{ item }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <span>{{ domain.where }}</span>
          <a-icon style="margin-left: 10px" class="dynamic-delete-button" v-if="index == 0" type="plus" @click="addForm(2)" />
          <a-icon style="margin-left: 10px" class="dynamic-delete-button" v-if="!index == 0" type="minus-circle-o" @click="removeDomain(domain, 'itemnameForm')" />
        </a-form-model-item>
        <a-form-model-item ref="itemspecification" has-feedback label="规格" prop="itemspecification" v-for="(domain, index) in itemspecificationForm" :key="'itemspecificationForm' + index">
          <a-input style="width: 200px" v-model="domain.value" allowClear placeholder="请输入规格" />
          <a-dropdown style="margin:0 10px">
            <a-button shape="circle" icon="unordered-list" size="small" @click="(e) => e.preventDefault()" />
            <a-menu slot="overlay">
              <a-menu-item v-for="(item, indexs) in filtrate" :key="indexs" @click="itemFiltrete(index, 'itemspecification', item)">
                <a href="javascript:;" :class="domain.where == item ? 'menuBg' : ''">{{ item }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <span>{{ domain.where }}</span>
          <a-icon style="margin-left: 10px" class="dynamic-delete-button" v-if="index == 0" type="plus" @click="addForm(3)" />
          <a-icon style="margin-left: 10px" class="dynamic-delete-button" v-if="!index == 0" type="minus-circle-o" @click="removeDomain(domain, 'itemspecificationForm')" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="尺寸" v-for="(domain, index) in sizeForm" :key="index">
          <a-input-number :min="0" style="width: 120px" v-model="domain.lengths" allowClear placeholder="请输入长" @change="limitsCount('LENGHT', index)" />
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="domain.lenghtLimits" allowClear placeholder="公差" @change="limitsCount('LENGHT', index)" />
          <a-button style="margin-left: 10px;" @click="limitsCount('LENGHT', index)">计算</a-button>
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="domain.minlength" allowClear placeholder="最小值" />
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="domain.maxlength" allowClear placeholder="最大值" />
          <a-icon style="margin-left: 10px" class="dynamic-delete-button" v-if="!index == 0" type="minus-circle-o" @click="removeDomain(domain, 'sizeForm')" />
          <a-icon style="margin-left: 10px" class="dynamic-delete-button" v-if="index == 0" type="plus" @click="addForm()" />
        </a-form-model-item>
        <!-- <div class="add-btn">
          <a-button type="primary" style="width:300px;margin:0 auto;" @click="addForm"> <a-icon type="plus" />添加尺寸</a-button>
        </div> -->
        <!-- <a-form-model-item has-feedback label="宽">
          <a-input-number :min="0" style="width: 120px" v-model="form.widths" allowClear placeholder="请输入宽" @change="limitsCount('LENGHT')" />
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="form.widthLimits" allowClear placeholder="公差" @change="limitsCount('WIDHT')" />
          <a-button style="margin-left: 10px;" @click="limitsCount('WIDHT')">计算</a-button>
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="minwidth" allowClear placeholder="最小值" />
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="maxwidth" allowClear placeholder="最大值" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="高">
          <a-input-number :min="0" style="width: 120px" v-model="form.heights" allowClear placeholder="请输入高" @change="limitsCount('LENGHT')" />
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="form.heightLimits" allowClear placeholder="公差" @change="limitsCount('HEIGHT')" />
          <a-button style="margin-left: 10px;" @click="limitsCount('HEIGHT')">计算</a-button>
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="minheight" allowClear placeholder="最小值" />
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="maxheight" allowClear placeholder="最大值" />
        </a-form-model-item> -->
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: ["editData", "queryType"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        itemcode: "",
        itemname: "",
        itemspecification: "",
      },
      minlength: 0,
      maxlength: 0,
      maxwidth: 0,
      minwidth: 0,
      minheight: 0,
      maxheight: 0,
      filtrate: ["不过滤", "包含(A,B,C)", "不包含", "等于", "不等于", "开始于", "结束于", "小于", "小于或等于", "大于", "大于或等于"],
      itemcodesign: "",
      itemnamesign: "",
      itemspecificationsign: "",
      itemcodeForm: [{ value: "", where: "" }],
      itemnameForm: [{ value: "", where: "" }],
      itemspecificationForm: [{ value: "", where: "" }],
      sizeForm: [{ widths: 0, lengths: 0, heights: 0 }],
    };
  },
  created() {
    let queryValue = "";
    if (this.queryType == 1) {
      queryValue = localStorage.getItem("PACK_QUERY_VALUE");
    } else {
      queryValue = localStorage.getItem("WIRE_QUERY_VALUE");
    }
    let item = JSON.parse(queryValue);
    console.log("item===", item);
    this.itemcodeForm = item.itemcodeForm.length === 0 ? [{ value: "", where: "" }] : item.itemcodeForm;
    this.itemnameForm = item.itemnameForm.length === 0 ? [{ value: "", where: "" }] : item.itemnameForm;
    this.itemspecificationForm = item.itemspecificationForm.length === 0 ? [{ value: "", where: "" }] : item.itemspecificationForm;
    this.sizeForm = item.sizeForm.length === 0 ? [{ widths: 0, lengths: 0, heights: 0 }] : item.sizeForm;
  },
  methods: {
    //添加
    removeDomain(item, str) {
      let varStr = str == "itemcodeForm" ? this.itemcodeForm : str == "itemnameForm" ? this.itemnameForm : str == "itemspecificationForm" ? this.itemspecificationForm : this.sizeForm;
      console.log("varStr===", varStr);
      let index = varStr.indexOf(item);
      if (index !== -1) {
        varStr.splice(index, 1);
      }
    },
    addForm(index) {
      let obj = { where: "", value: "" };
      if (index == 1) {
        this.itemcodeForm.push(obj);
      } else if (index == 2) {
        this.itemnameForm.push(obj);
      } else if (index == 3) {
        this.itemspecificationForm.push(obj);
      } else {
        this.sizeForm.push({ widths: 0, lengths: 0, heights: 0 });
      }
    },
    itemFiltrete(index, type, text) {
      switch (type) {
        case "itemcode":
          this.itemcodeForm[index].where = text;
          break;
        case "itemname":
          this.itemnameForm[index].where = text;
          break;
        case "itemspecification":
          this.itemspecificationForm[index].where = text;
          break;
      }
      // this.handleOk();
    },
    close() {
      this.$emit("closeModal");
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    limitsCount(type, index) {
      if (type == "LENGHT") {
        this.sizeForm[index].maxlength = Number(this.sizeForm[index].lengths) + Number(this.sizeForm[index].lenghtLimits);
        this.sizeForm[index].minlength = Number(this.sizeForm[index].lengths) - Number(this.sizeForm[index].lenghtLimits);
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let sizeArray = [];
          let itemcodeArray = [];
          let itemnameArray = [];
          let itemspecificationArray = [];
          this.sizeForm.forEach((item) => {
            if (item.maxlength != "" && item.minlength) {
              sizeArray.push({ max: item.maxlength, min: item.minlength < 0 ? 0 : item.minlength });
            }
          });
          this.itemcodeForm.forEach((item) => {
            if (item.value != "" && item.where) {
              itemcodeArray.push(item);
            }
          });
          this.itemnameForm.forEach((item) => {
            if (item.value != "" && item.where) {
              itemnameArray.push(item);
            }
          });
          this.itemspecificationForm.forEach((item) => {
            if (item.value != "" && item.where) {
              itemspecificationArray.push(item);
            }
          });
          let params = {
            sizes: sizeArray,
            itemcodes: itemcodeArray,
            itemnames: itemnameArray,
            itemspecifications: itemspecificationArray,
          };
          let storage = {
            sizeForm: this.sizeForm,
            itemspecificationForm: this.itemspecificationForm,
            itemnameForm: this.itemnameForm,
            itemcodeForm: this.itemcodeForm,
          };
          let editData = {
            ...params,
            sizeForm: this.sizeForm,
          };
          if (this.queryType == 1) {
            localStorage.setItem("PACK_QUERY_VALUE", JSON.stringify(storage));
          } else {
            localStorage.setItem("WIRE_QUERY_VALUE", JSON.stringify(storage));
          }
          this.$emit("closeModal");
          this.$emit("success", params, editData);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-form-item {
  margin-bottom: 5px;
}
.menuBg {
  background: #13c2c2;
  color: #fff;
}
.add-btn {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
</style>
