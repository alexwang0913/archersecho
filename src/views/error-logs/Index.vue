<template>
  <div id="div-errorlog" class="vs-con-loading__container">
    <vx-card title="Error Logs">
      <vs-row>
        <vs-col vs-offset="8" vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
          <vs-input
            icon="search"
            placeholder="Search"
            v-model="keyword"
            class="mb-4"
            @keyup="search"
          />
        </vs-col>
      </vs-row>
      <vs-table :data="errorList">
        <template slot="thead">
          <vs-th>File Name</vs-th>
          <vs-th>Created Time</vs-th>
          <vs-th>Download</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{ tr.fileName }}</vs-td>
            <vs-td>{{ tr.createdAt.replace('T', ' ').split('.')[0] }}</vs-td>
            <vs-td>
              <a :href="getDownloadUrl(tr.name)">download</a>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import archerApi from "../../api/archer";
import deviceApi from "../../api/device";
import { SERVER_URL } from "../../utils/constant";
export default {
  data() {
    return {
      errorList: [],
      archerId: this.$route.params.id,
      keyword: ""
    };
  },
  mounted() {
    this.getErrorLogs();
  },
  methods: {
    async getErrorLogs() {
      this.$vs.loading({
        container: "#div-errorlog",
        scale: 0.6
      });
      this.errorList = await archerApi.getErrorLogs(this.archerId);
      this.$vs.loading.close("#div-errorlog > .con-vs-loading");
    },
    getDownloadUrl(name) {
      return SERVER_URL + "/" + name;
    },
    async search(e) {
      if (e.keyCode === 13) {
        const data = {
          keyword: this.keyword,
          archerId: this.archerId
        };
        this.$vs.loading({
          container: "#div-errorlog",
          scale: 0.6
        });
        this.errorList = await deviceApi.searchError(data);
        this.$vs.loading.close("#div-errorlog > .con-vs-loading");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>