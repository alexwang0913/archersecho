<template>
  <div id="div-calculated-field" class="vs-con-loading__container">
    <hot-table :settings="settings"></hot-table>
    <vs-pagination :total="pageLength" v-model="page" goto @change="getCalculatedField"></vs-pagination>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";

export default {
  components: { HotTable },
  data() {
    return {
      settings: {
        height: 500,
        rowHeights: 23,
        data: [{ moduleName: 1 }],
        colHeaders: [
          "Module Name",
          "Level Name",
          "Field Name",
          "Formula",
          "Type",
          "Order",
          "Always",
          "Active",
          "Handle Error",
          "Invalid",
          "Created",
          "Updated"
        ],
        columns: [
          {
            data: "ModuleName",
            editor: false
          },
          {
            data: "LevelName",
            editor: false
          },
          {
            data: "FieldName",
            editor: false,
            columnSorting: {
              headerAction: false,
              compareFunctionFactory: function compareFunctionFactory() {
                return function comparator() {
                  return 0;
                };
              }
            }
          },
          {
            data: "Formula",
            editor: false,
            columnSorting: {
              headerAction: false,
              compareFunctionFactory: function compareFunctionFactory() {
                return function comparator() {
                  return 0;
                };
              }
            }
          },
          {
            data: "FieldType",
            editor: false,
            columnSorting: {
              headerAction: false,
              compareFunctionFactory: function compareFunctionFactory() {
                return function comparator() {
                  return 0;
                };
              }
            }
          },
          {
            data: "CalcOrder",
            editor: false
          },
          {
            data: "Always",
            editor: false,
            columnSorting: {
              headerAction: false,
              compareFunctionFactory: function compareFunctionFactory() {
                return function comparator() {
                  return 0;
                };
              }
            }
          },
          {
            data: "Active",
            editor: false,
            columnSorting: {
              headerAction: false,
              compareFunctionFactory: function compareFunctionFactory() {
                return function comparator() {
                  return 0;
                };
              }
            }
          },
          {
            data: "HandleError",
            editor: false,
            columnSorting: {
              headerAction: false,
              compareFunctionFactory: function compareFunctionFactory() {
                return function comparator() {
                  return 0;
                };
              }
            }
          },
          {
            data: "Invalid",
            editor: false,
            columnSorting: {
              headerAction: false,
              compareFunctionFactory: function compareFunctionFactory() {
                return function comparator() {
                  return 0;
                };
              }
            }
          },
          {
            data: "Created",
            editor: false,
            columnSorting: {
              headerAction: false,
              compareFunctionFactory: function compareFunctionFactory() {
                return function comparator() {
                  return 0;
                };
              }
            }
          },
          {
            data: "Updated",
            editor: false,
            columnSorting: {
              headerAction: false,
              compareFunctionFactory: function compareFunctionFactory() {
                return function comparator() {
                  return 0;
                };
              }
            }
          }
        ],
        columnSorting: true
      },
      socket: io(SERVER_URL),
      database: this.$route.params.database,
      pageLength: 1,
      page: 1
    };
  },
  computed: {
    user() {
      return getFromStorage("user");
    }
  },
  mounted() {
    this.getCalculatedField();
    this.getCalculatedFieldsCount();
    this.responseSocket();
  },
  methods: {
    getCalculatedField() {
      this.$vs.loading({
        container: "#div-calculated-field",
        scale: 0.6
      });
      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database,
        page: this.page
      };
      this.socket.emit("REQ_CALCULATED_FIELD", data);
    },
    getCalculatedFieldsCount() {
      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database
      };
      this.socket.emit("REQ_CALCULATED_FIELD_COUNT", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_CALCULATED_FIELD", data => {
        console.log("response from RES_CALCULATED_FIELD");
        console.log(data);
        this.settings.data = data;
        this.$vs.loading.close("#div-calculated-field > .con-vs-loading");
      });
      this.socket.on("RES_CALCULATED_FIELD_COUNT", count => {
        console.log("response from RES_CALCULATED_FIELD_COUNT");
        console.log(count);
        this.pageLength = Math.ceil(count / 50);
      });
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
  }
};
</script>
<style lang="scss" scoped>
</style>