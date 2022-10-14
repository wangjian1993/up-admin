<!--
 * @Author: max
 * @Date: 2021-10-14 16:15:42
 * @LastEditTime: 2022-09-29 10:50:45
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/supplier/component/setClass.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="设置资质分类" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :bodyStyle="{ padding: '5px 10px' }">
      <a-spin tip="loading..." :spinning="loading">
        <a-table :columns="columns" :data-source="classList" size="small" :pagination="false" :rowKey="(list) => list.ItemCode" bordered>
          <template slot="Code" slot-scope="text, record">
            <a-input size="small" v-if="record.editable" style="width: 150px" v-model="record.Code" />
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="Name" slot-scope="text, record">
            <a-input size="small" v-if="record.editable" style="width: 150px" v-model="record.Name" />
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="IsRequired" slot-scope="text, record">
            <a-select size="small" v-if="record.editable" style="width: 100px" v-model="record.IsRequired">
              <a-select-option value="false">可选</a-select-option>
              <a-select-option value="true">必须</a-select-option>
            </a-select>
            <template v-if="!record.editable && record.Id">
              {{ text ? "必须" : "可选" }}
            </template>
          </template>
          <template slot="ExpiredLength" slot-scope="text, record">
            <a-select size="small" v-if="record.editable" style="width: 100px" v-model="record.ExpiredLength">
              <a-select-option :value="item" v-for="(item, index) in expiry" :key="index">{{ item }}</a-select-option>
            </a-select>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="IsFileRequired" slot-scope="text, record">
            <a-checkbox v-if="record.editable" v-model="record.IsFileRequired"> </a-checkbox>
            <template v-if="!record.editable && record.Id">
              <a-checkbox v-model="record.IsFileRequired" disabled> </a-checkbox>
            </template>
          </template>
          <template slot="FileId" slot-scope="text, record">
            <a-upload v-if="record.editable" :custom-request="uploadFile" :default-file-list="fileList" :data="{ classId: record.Id }" :before-upload="beforeUpload" :remove="removeFile" class="upload-list-inline">
              <a-button> <a-icon type="upload" /> 上传附件 </a-button>
            </a-upload>
            <template v-else>
              {{ text }}
            </template>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a v-if="!record.editable && !editingFlag" @click="add(record)"> <a-icon type="plus" />新增 </a>
              <span v-if="record.editable && record.Id">
                <a style="margin-left: 8px" @click="() => save(record)"> <a-icon type="save" />保存</a>
                <a style="margin-left: 8px" @click="() => editForm(record.Id, false)"> <a-icon type="container" />取消</a>
              </span>
              <span v-if="!record.editable && record.Id && !editingFlag">
                <a :disabled="!hasPerm('edit')" @click="() => editForm(record.Id, true)"> <a-icon type="edit" />编辑</a>
              </span>
              <a-popconfirm v-if="!record.editable && record.Id" title="确定删除?" @confirm="() => useDelete(record, Id)">
                <a style="margin-left: 8px" :disabled="!hasPerm('delete')"> <a-icon type="delete" />删除 </a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
        <AddClass v-if="isForm" :isEdit="isEdit" :editData="editData" @closeModal="closeModal" @success="getDetailList" />
      </a-spin>
    </a-drawer>
  </div>
</template>

<script>
import { getQuaList, setQuaList } from "@/services/srm.js";
import { splitData } from "@/utils/util.js";
import AddClass from "./addClass.vue";
const columns = [
  {
    title: "资质分类",
    dataIndex: "ClassName",
    scopedSlots: { customRender: "ClassName" },
    align: "center",
    customRender: (value, row) => {
      const obj = {
        children: value,
        attrs: {},
      };
      obj.attrs.rowSpan = row.mergeRowSpan;
      return obj;
    },
  },
  {
    title: "资质文件编码",
    dataIndex: "Code",
    scopedSlots: { customRender: "Code" },
    align: "center",
  },
  {
    title: "资质文件名称",
    dataIndex: "Name",
    scopedSlots: { customRender: "Name" },
    align: "center",
  },
  {
    title: "是否必要",
    dataIndex: "IsRequired",
    scopedSlots: { customRender: "IsRequired" },
    align: "center",
  },
  {
    title: "有效期",
    dataIndex: "ExpiredLength",
    scopedSlots: { customRender: "ExpiredLength" },
    align: "center",
  },
  {
    title: "文件到期是否必填",
    dataIndex: "IsFileRequired",
    scopedSlots: { customRender: "IsFileRequired" },
    align: "center",
  },
  {
    title: "模板",
    dataIndex: "FileId",
    scopedSlots: { customRender: "FileId" },
    align: "center",
  },
  {
    title: "发布人",
    dataIndex: "PublishUser",
    scopedSlots: { customRender: "PublishUser" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
import { updateFile, deleteFile } from "@/services/srm.js";
export default {
  components: { AddClass },
  data() {
    return {
      columns,
      size: "small",
      visible: true,
      classList: [],
      loading: false,
      editingKey: -1,
      expiry: ["长期", "半年", "一年", "两年", "三年"],
      editingFlag: false,
      fileList: [],
      filesList: [],
      isForm:false,
      isEdit:false,
      editData: [],
    };
  },
  created() {
    this.getDetailList();
  },
  methods: {
    splitData,
    removeFile() {
      let params = [this.filesList.ResourceId];
      deleteFile(params).then((res) => {
        if (res.data.success) {
          this.$message.success("移除成功!");
          this.fileList = [];
          this.filesList = [];
        }
      });
    },
    uploadFile(info) {
      this.spinning = true;
      getBase64(info.file, (result) => {
        console.log("info==", info);
        let defaType = info.file.type.split("/");
        let fileType = defaType[0];
        let fileSuffix = defaType[1];
        let params = {
          filename: info.file.name,
          filetype: fileType,
          fileprefix: "",
          filesuffix: "." + fileSuffix,
          filesize: info.file.size,
          filelength: "0",
          filecontent: result,
        };
        updateFile(params).then((res) => {
          if (res.data.success) {
            this.filesList = {
              ...res.data.data,
              ...info.file,
              Id: info.data.classId,
            };
          }
          console.log(this.filesList);
          this.spinning = false;
        });
      });
    },
    //getData代表请求过来的list
    //dataIndex代表每一行的第一列的key名称
    rowSpan(getData, dataIndex) {
      //过滤合并后现实的表格内容
      let arr = getData
        .reduce((result, item) => {
          //不存在则放入展示结果
          if (result.indexOf(item[dataIndex]) < 0) {
            result.push(item[dataIndex]);
          }
          return result;
        }, [])
        //确定每个合并的合并行数
        .reduce((result, keys) => {
          //计算出可以合并的数据
          const children = getData.filter((item) => item[dataIndex] === keys);
          result = result.concat(
            //计算出合并行数
            children.map((item, index) => ({
              ...item,
              [`mergeRowSpan`]: index === 0 ? children.length : 0,
            }))
          );
          return result;
        }, []);
      //将最后展示的数据替换原数据
      this.classList = arr;
    },
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isForm = false;
    },
    beforeUpload(file) {
      let fileList = [...this.fileList, file];
      this.fileList = fileList.slice(-1);
    },
    add(record) {
      this.isForm =true;
      this.isEdit = true;
      this.editData= record;
      console.log(this.editData)
    },
    editForm(key, flag) {
      this.fileList = [];
      this.filesList = [];
      const newData = [...this.classList];
      const target = newData.find((item) => key === item.Id);
      this.editingKey = key;
      if (target) {
        this.editingFlag = flag;
        target.editable = flag;
        this.classList = newData;
      }
    },
    useDelete(record) {
      let params = [record.Id];
      setQuaList(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功");
          this.getDetailList();
        }
      });
    },
    getDetailList() {
      this.loading = true;
      this.classList =[]
      getQuaList("", "getqualification").then((res) => {
        if (res.data.success) {
          //   this.classList = res.data.data.list;
          let list = res.data.data.list;
          list.forEach((item) => {
            if (item.Children.length == 0) {
              this.classList.push({
                ClassCode: item.ClassCode,
                ClassName: item.ClassName,
                Code: "",
                ExpiredLength: "",
                FileId: "",
                IsFileRequired: false,
                IsRequired: false,
                Name: "",
                PublishUser: "",
                editable: false,
              });
            } else {
              item.Children.forEach((i) => {
                this.classList.push({
                  ...i,
                  editable: false,
                });
              });
            }
          });
          this.$nextTick(() => {
            this.rowSpan(this.classList, "ClassName");
          });
        }
        this.loading = false;
      });
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    save(record) {
      let params = {
        classcode: record.ClassCode,
        classname: record.ClassName,
        id: record.Id,
        code: record.Code,
        name: record.Name,
        isrequired: record.IsRequired,
        expiredlength: record.ExpiredLength,
        isfilerequired: record.IsFileRequired,
        fileid: this.filesList.ResourceId,
      };
      console.log("params", params);
      setQuaList(params, "update").then((res) => {
        if (res.data.success) {
          this.$message.success("修改成功");
          this.editForm(record.Id, false);
          this.getDetailList();
        }
      });
    },
    actionBtn(action) {
      setQuaList;
      let params = [this.docno];
      setQuaList(params, action).then((res) => {
        if (res.data.success) {
          let content = action == "agree" ? "同意成功" : "退回成功";
          this.$message.success(content);
          this.$emit("closeModal");
        }
      });
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
      this.isUnfold = false;
    },
  },
};
</script>

<style lang="less" scoped>
p {
  padding: 0;
  margin: 0;
}
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
  background: rgba(0, 0, 0, 0.05);
}
/deep/.ant-card-head {
  padding: 0;
}
/deep/.ant-table {
  font-size: 10px;
}
/deep/.ant-descriptions-title {
  margin-bottom: 0;
}
/deep/.ant-table-row-cell-break-word {
  white-space: nowrap;
  overflow: hidden;
}
/deep/.ant-descriptions-item-content {
  font-size: 10px;
}
</style>
