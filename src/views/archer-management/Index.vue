<template>
  <div>
    <vs-card>
      <add-archer></add-archer>
      <vs-table :data="archers">
        <template slot="thead">
          <vs-th>Name</vs-th>
          <vs-th>Description</vs-th>
          <vs-th>Created At</vs-th>
          <vs-th></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="tr.name">{{ tr.name }}</vs-td>

            <vs-td>{{ data[indextr].description }}</vs-td>

            <vs-td>{{ data[indextr].createdAt.split('T')[0] }}</vs-td>

            <vs-td>
              <div class="vx-row">
                <vs-button
                  color="danger"
                  type="border"
                  icon="delete"
                  radius
                  @click="openConfirm(tr._id)"
                ></vs-button>
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AddArcher from "./AddArcher.vue";
import { getFromStorage } from "../../utils";
import archerApi from "../../api/archer";

export default {
  data() {
    return {
      users: [
        {
          email: "user@mail.com",
          username: "user1",
          website: "XXX.com",
          id: "123"
        }
      ],
      selId: null
    };
  },
  mounted() {
    this.$store.dispatch("archer/getArcherList", this.localUser.id);
  },
  methods: {
    onClickEditbtn(id) {
      console.log("edit button clicked");
      console.log(id);
    },
    openConfirm(id) {
      this.selId = id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this archer?",
        accept: this.deleteArcher
      });
    },
    async deleteArcher() {
      await archerApi.removeArcher(this.selId);
      this.$vs.notify({
        type: "success",
        title: "Success",
        text: "Success in remove archer"
      });
      this.$store.dispatch("archer/getArcherList", this.localUser.id);
    },
    gotoArcherDetail(id) {
      console.log(id);
      this.$router.push({ path: `/archer-detail/${id}` });
    }
  },
  components: {
    AddArcher
  },
  computed: {
    localUser() {
      return getFromStorage("user");
    },
    ...mapState({
      archers: state => state.archer.archers
    })
  }
};
</script>

<style scoped>
</style>