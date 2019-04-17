<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-table :data="repositoryList">
      <template slot="thead">
        <vs-th>File Repository Path</vs-th>
        <vs-th>File Repository Size</vs-th>
        <vs-th>File Repository Count</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.path}}</vs-td>
          <vs-td>{{tr.size}}</vs-td>
          <vs-td>{{tr.count}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";

export default {
  data() {
    return {
      socket: io(SERVER_URL),
      archerId: this.$route.params.id,
      userId: getFromStorage("user").id,
      resCount: 0,
      instances: [],
      repositoryList: [],
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    this.getRepositoryList();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    async getRepositoryList() {
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      this.repositoryList = [];
      const data = {
        archerId: this.archerId,
        userId: this.userId,
        sectionName: "File Repository",
        database: "Configuration",
        method: "FILE_REPOSITORY"
      };
      this.socket.emit("REQ_FILE_REPOSITORY", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });
      this.socket.on("RES_FILE_REPOSITORY", response => {
        console.log("response from FileRepository");
        console.log(response);

        let fileRepository = {
          path: "",
          size: "",
          count: ""
        };

        for (const data of response) {
          if (data.data_point === "File Repository Path") {
            fileRepository.path = data.data_point_value;
          } else if (data.data_point === "File Repository Size") {
            fileRepository.size =
              Math.floor(data.data_point_value / 1024) + " KB";
          } else if (data.data_point === "File Repository Count") {
            fileRepository.count = data.data_point_value;
          }
        }

        this.repositoryList.push(fileRepository);

        this.$vs.loading.close("#div-loading > .con-vs-loading");
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      this.timer = setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-loading > .con-vs-loading");
          vm.$vs.notify({
            color: "warning",
            title: "Warning",
            text: "No response from server."
          });
        }
      }, 1000 * 10);
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
    clearTimeout(this.timer);
  }
};
</script>

<style lang="scss" scoped>
</style>