<template>
  <div class="ccip ccip-session-table"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { IRoom, ISessionData } from './types/session';

@Component
export default class CCIPSessionTable extends Vue {
  @Prop({
    required: true
  })
  private roomList!: IRoom['id'][];

  @Prop({
    default: false,
    required: false
  })
  private isPopup!: boolean;

  @Prop({
    required: true
  })
  private sessionData!: ISessionData;
}
</script>

<style lang="scss" scoped>
@import './scss/main.scss';
</style>
