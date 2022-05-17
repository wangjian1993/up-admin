<template>
  <div>
    <a-modal title="高级查询" :visible="visible" @ok="handleOk" @cancel="handleCancel" width="50%">
      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="docno" has-feedback label="品号" prop="docno">
          <a-input style="width: 200px" v-model="form.docno" allowClear placeholder="请输入品号" />
        </a-form-model-item>
        <a-form-model-item ref="docname" has-feedback label="品名" prop="docname">
          <a-input style="width: 200px" v-model="form.docname" allowClear placeholder="请输入品名" />
        </a-form-model-item>
        <a-form-model-item ref="itemspecification" has-feedback label="规格" prop="itemspecification">
          <a-input style="width: 200px" v-model="form.itemspecification" allowClear placeholder="请输入规格" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="长">
          <a-input-number :min="0" style="width: 120px" v-model="form.lengths" allowClear placeholder="请输入长" @change="limitsCount('LENGHT')" />
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="form.lenghtLimits" allowClear placeholder="公差" @change="limitsCount('LENGHT')" />
          <a-button style="margin-left: 10px;" @click="limitsCount('LENGHT')">计算</a-button>
          <a-input-number :min="0" disabled style="width: 80px;margin-left: 10px;" v-model="minlength" allowClear placeholder="最小值" />
          <a-input-number :min="0" disabled style="width: 80px;margin-left: 10px;" v-model="maxlength" allowClear placeholder="最大值" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="宽">
          <a-input-number :min="0" style="width: 120px" v-model="form.widths" allowClear placeholder="请输入宽" @change="limitsCount('LENGHT')" />
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="form.widthLimits" allowClear placeholder="公差" @change="limitsCount('WIDHT')" />
          <a-button style="margin-left: 10px;" @click="limitsCount('WIDHT')">计算</a-button>
          <a-input-number :min="0" disabled style="width: 80px;margin-left: 10px;" v-model="minwidth" allowClear placeholder="最小值" />
          <a-input-number :min="0" disabled style="width: 80px;margin-left: 10px;" v-model="maxwidth" allowClear placeholder="最大值" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="高">
          <a-input-number :min="0" style="width: 120px" v-model="form.heights" allowClear placeholder="请输入高" @change="limitsCount('LENGHT')" />
          <a-input-number :min="0" style="width: 80px;margin-left: 10px;" v-model="form.heightLimits" allowClear placeholder="公差" @change="limitsCount('HEIGHT')" />
          <a-button style="margin-left: 10px;" @click="limitsCount('HEIGHT')">计算</a-button>
          <a-input-number :min="0" disabled style="width: 80px;margin-left: 10px;" v-model="minheight" allowClear placeholder="最小值" />
          <a-input-number :min="0" disabled style="width: 80px;margin-left: 10px;" v-model="maxheight" allowClear placeholder="最大值" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: ["editData"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        docno: "",
        docname: "",
        itemspecification: "",
        widths: 0,
        lengths: 0,
        heights: 0,
      },
      minlength: 0,
      maxlength: 0,
      maxwidth: 0,
      minwidth: 0,
      minheight: 0,
      maxheight: 0,
    };
  },
  created() {
    this.form.docno = this.editData.docno || "";
    this.form.docname = this.editData.docname || "";
    this.form.itemspecification = this.editData.itemspecification || "";
    this.form.widths = this.editData.widths || 0;
    this.form.lengths = this.editData.lengths || 0;
    this.form.heights = this.editData.heights || 0;
    this.form.lenghtLimits = this.editData.lenghtLimits || 0;
    this.form.widthLimits = this.editData.widthLimits || 0;
    this.form.heightLimits = this.editData.heightLimits || 0;
    this.minlength = this.editData.minlength;
    this.maxlength = this.editData.maxlength;
    this.maxwidth = this.editData.maxwidth;
    this.minwidth = this.editData.minwidth;
    this.minheight = this.editData.minheight;
    this.maxheight = this.editData.maxheight;
    console.log(this.form);
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    limitsCount(type) {
      if (type == "LENGHT") {
        this.maxlength = Number(this.form.lengths) + Number(this.form.lenghtLimits);
        this.minlength = Number(this.form.lengths) - Number(this.form.lenghtLimits);
      } else if (type == "WIDHT") {
        this.maxwidth = Number(this.form.widths) + Number(this.form.widthLimits);
        this.minwidth = Number(this.form.widths) - Number(this.form.widthLimits);
      } else if (type == "HEIGHT") {
        this.maxheight = Number(this.form.heights) + Number(this.form.heightLimits);
        this.minheight = Number(this.form.heights) - Number(this.form.heightLimits);
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            widths: this.form.widths,
            lengths: this.form.lengths,
            heights: this.form.heights,
            lenghtLimits: this.form.lenghtLimits,
            widthLimits: this.form.widthLimits,
            heightLimits: this.form.heightLimits,
            docno: this.form.docno,
            docname: this.form.docname,
            itemspecification: this.form.itemspecification,
            maxlength: this.maxlength,
            minlength: this.minlength < 0 ? 0 : this.minlength,
            maxwidth: this.maxwidth,
            minwidth: this.minwidth < 0 ? 0 : this.minwidth,
            maxheight: this.maxheight,
            minheight: this.minheight < 0 ? 0 : this.minheight,
          };
          this.$emit("closeModal");
          this.$emit("success", params);
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
</style>
