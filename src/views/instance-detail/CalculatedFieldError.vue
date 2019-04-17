<template>
  <div id="div-calculated-field" class="vs-con-loading__container ml-2">
    <vs-row class="mb-4">
      <vs-col vs-w="4" vs-type="flex" vs-justify="center" vs-align="center">
        <span class="mr-2">Count:</span>
        <span class="font-semibold">{{count}}</span>
      </vs-col>
      <vs-col vs-w="4" vs-type="flex" vs-justify="center" vs-align="center">
        <span class="mr-2">Modules:</span>
        <span class="font-semibold">{{moduleCount}}</span>
      </vs-col>
      <vs-col vs-w="4" vs-type="flex" vs-justify="center" vs-align="center">
        <span class="mr-2">Fields:</span>
        <span class="font-semibold">{{fieldCount}}</span>
      </vs-col>
    </vs-row>

    <hot-table :settings="settings"></hot-table>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";
import { HotTable } from "@handsontable/vue";

export default {
  components: { HotTable },
  data() {
    return {
      socket: io(SERVER_URL),
      database: this.$route.params.database,

      statisticData: [],
      errorData: [],
      settings: {
        height: 300,
        rowHeights: 23,
        rowHeaders: true,
        data: [],
        colHeaders: [
          "Created",
          "Module",
          "Level",
          "Field Name",
          "Error",
          "Field Id",
          "Content Id",
          "User"
        ],
        columns: [
          { data: "CreateDate", editor: false },
          { data: "ModuleName", editor: false },
          { data: "LevelName", editor: false },
          { data: "FieldName", editor: false },
          { data: "Error", editor: false },
          { data: "FieldId", editor: false },
          { data: "ContentId", editor: false },
          { data: "User", editor: false }
        ]
      },

      moduleCount: 0,
      fieldCount: 0,
      count: 0
    };
  },
  computed: {
    user() {
      return getFromStorage("user");
    }
  },
  mounted() {
    this.getCalculatedFieldError();
    this.responseSocket();
  },
  methods: {
    getCalculatedFieldError() {
      this.$vs.loading({
        container: "#div-calculated-field",
        scale: 0.6
      });
      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database
      };
      this.socket.emit("REQ_CALCULATED_FIELD_ERROR", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_CALCULATED_FIELD_ERROR", response => {
        console.log("response from CalculatedFieldError");
        console.log(response);
        this.settings.data = response;
        this.settings.data.map(data => {
          data.CreateDate = data.CreateDate.replace("T", " ").split(".")[0];
        });

        let moduleName = [];
        let fieldIds = [];
        for (const data of response) {
          moduleName.push(data.ModuleName);
          fieldIds.push(data.FieldId);
        }
        const uniqueModuleName = [...new Set(moduleName)];
        const uniqueField = [...new Set(fieldIds)];
        this.moduleCount = uniqueModuleName.length;
        this.fieldCount = uniqueField.length;
        this.count = response.length;

        this.$vs.loading.close("#div-calculated-field > .con-vs-loading");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>