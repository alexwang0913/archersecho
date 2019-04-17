<template>
  <div>
    <vx-card title="My Team">
      <vs-button icon="add" @click="$router.push({name: 'add-team'})">Add team</vs-button>

      <vs-table :data="myTeamList" class="mt-4">
        <template slot="thead">
          <vs-th>Name</vs-th>
          <vs-th>Members</vs-th>
          <vs-th>Created At</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{tr.name}}</vs-td>
            <vs-td>
              <vs-chip v-for="(member, index) in tr.members" :key="index">
                <vs-avatar/>
                {{member.id.userId}}
              </vs-chip>
            </vs-td>
            <vs-td>{{tr.createdAt.replace("T", " ").split(".")[0]}}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import teamApi from "../../api/team";
import { getFromStorage } from "../../utils";
export default {
  data() {
    return {
      myTeamList: [],
      userId: getFromStorage("user").id
    };
  },
  mounted() {
    this.getMyTeamList();
  },
  methods: {
    remove(item) {
      this.members.splice(this.members.indexOf(item), 1);
    },
    async getMyTeamList() {
      this.myTeamList = await teamApi.getTeamList(this.userId);
      console.log(this.myTeamList);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>