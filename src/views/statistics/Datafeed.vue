<template>
  <div id="div-datafeed" class="vs-con-loading__container" style="height: 500px">
    <vs-row vs-justify="center" vs-align="center">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
        <vs-select class="selectExample" v-model="instance">
          <vs-select-item
            :key="index"
            :value="item.database"
            :text="item.name"
            v-for="(item,index) in instances"
          />
        </vs-select>
      </vs-col>

      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
        <datepicker style="z-index: 1000;" placeholder="Select Start Date" v-model="startDate"></datepicker>
      </vs-col>

      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
        <datepicker style="z-index: 1000;" placeholder="Select End Date" v-model="endDate"></datepicker>
      </vs-col>
    </vs-row>
    <vs-row class="mt-4">
      <vs-col vs-offset="9" vs-justify="center" vs-align="center" vs-type="flex" vs-w="3">
        <vs-button type="relief" @click="getData">Get data</vs-button>
      </vs-col>
    </vs-row>
    <vs-row class="mt-4" v-if="showData">
      <vs-col>
        <span>Completed:</span>
        <span class="font-semibold ml-2">{{datafeedData.Completed}}</span>
      </vs-col>
      <vs-col>
        <span>Faulted:</span>
        <span class="font-semibold ml-2">{{datafeedData.Faulted}}</span>
      </vs-col>
      <vs-col>
        <span>Pending:</span>
        <span class="font-semibold ml-2">{{datafeedData.Pending}}</span>
      </vs-col>
      <vs-col>
        <span>Running:</span>
        <span class="font-semibold ml-2">{{datafeedData.Running}}</span>
      </vs-col>
      <vs-col>
        <span>Terminated:</span>
        <span class="font-semibold ml-2">{{datafeedData.Terminated}}</span>
      </vs-col>
      <vs-col>
        <span>Terminating:</span>
        <span class="font-semibold ml-2">{{datafeedData.Terminating}}</span>
      </vs-col>
      <vs-col>
        <span>Warning:</span>
        <span class="font-semibold ml-2">{{datafeedData.Warning}}</span>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import archerApi from "../../api/archer";
import { getFromStorage } from "../../utils";
import Datepicker from "vuejs-datepicker";

import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";

export default {
  components: { Datepicker },
  data() {
    return {
      socket: io(SERVER_URL),
      archerId: getFromStorage("archerId"),
      user: getFromStorage("user"),

      instances: [],
      instance: null,
      startDate: null,
      endDate: null,

      datafeedData: {
        Completed: 0,
        Faulted: 0,
        Pending: 0,
        Running: 0,
        Terminated: 0,
        Terminating: 0,
        Warning: 0
      },
      showData: false
    };
  },
  mounted() {
    this.getInstances();
    this.responseSocket();
  },
  methods: {
    async getInstances() {
      this.$vs.loading({
        container: "#div-datafeed",
        scale: 0.6,
        type: "point"
      });
      this.instances = await archerApi.getInstances(this.archerId);
      this.$vs.loading.close("#div-datafeed > .con-vs-loading");
    },
    async getData() {
      this.$vs.loading({
        container: "#div-datafeed",
        scale: 0.6,
        type: "point"
      });

      const data = {
        archerId: this.archerId,
        startDate: this.startDate,
        endDate: this.endDate,
        instance: this.instance,
        userId: this.user.id
      };
      // console.log(data);

      this.socket.emit("REQ_DATAFEED_STATISTIC", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_DATAFEED_STATISTIC", response => {
        // console.log("response from Datafeed Statistic");
        // console.log(response);
        this.datafeedData = response;
        this.showData = true;
        this.$vs.loading.close("#div-datafeed > .con-vs-loading");
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