<template>
  <div>
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vs-card>
      <vs-row>
        <vs-tabs vs-position="left">
          <vs-tab
            v-for="(tab, index) in tabs"
            :key="index"
            :vs-label="tab"
            @click="selectTab = tab"
          >
            <keep-alive>
              <component :is="selectTab"></component>
            </keep-alive>
          </vs-tab>
        </vs-tabs>
      </vs-row>
    </vs-card>
  </div>
</template>

<script>
import DataFeed from "./DataFeed.vue";
import Information from "./Information.vue";
import ApplicationField from "./ApplicationField.vue";
import CalculatedField from "./CalculatedField.vue";
import LoginHeatmap from "./LoginHeatmap.vue";
import NotificationDetail from "./NotificationDetail.vue";
import JobEngineDetail from "./JobEngineDetail.vue";
import ContentInfo from "./ContentInfo.vue";
import SearchIndexQueue from "./SearchIndexQueue.vue";
import LDAPSyncInformation from "./LDAPSyncInformation.vue";
import CalculatedFieldError from "./CalculatedFieldError.vue";

export default {
  components: {
    DataFeed,
    Information,
    ApplicationField,
    CalculatedField,
    LoginHeatmap,
    NotificationDetail,
    JobEngineDetail,
    ContentInfo,
    SearchIndexQueue,
    LDAPSyncInformation,
    CalculatedFieldError
  },
  data() {
    return {
      tabs: [
        "DataFeed",
        "Information",
        "ApplicationField",
        "CalculatedField",
        "LoginHeatmap",
        "NotificationDetail",
        "JobEngineDetail",
        "ContentInfo",
        "SearchIndexQueue",
        "LDAPSyncInformation",
        "CalculatedFieldError"
      ],
      selectTab: "DataFeed",
      tab: "DataFeed"
    };
  }
};
</script>

<style src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>
<style lang="scss" scoped>
</style>