<template>
  <div class="ccip-app">
    <div
      v-if="!isMobile"
      class="ccip-app ccip-session-table general"
      :style="{
        'grid-template-columns': gridColString,
        'grid-template-rows': gridRowString
      }"
    >
      <div
        v-for="time in timeline"
        :key="`time-${time}`"
        :style="{
          'grid-column-start': 'TIME',
          'grid-row-start': `T${time}`
        }"
        class="ccip-app ccip-session-block time-block"
      >
        <p>{{ formatTime(time) }}</p>
      </div>
      <div
        v-for="room in rooms"
        :key="`room-${room}`"
        :style="{
          'grid-column-start': `${room}`,
          'grid-row-start': 'HEAD'
        }"
        class="ccip-app ccip-session-block room-block"
      >
        <p>{{ room }}</p>
      </div>
      <div
        v-for="session in sessions"
        :key="`session-${session.id}`"
        :style="{
          'grid-column-start': processSessionRoom(session).start,
          'grid-column-end': processSessionRoom(session).end,
          'grid-row-start': `T${timeParser(session.start)}`,
          'grid-row-end': `T${timeParser(session.end)}`
        }"
        :class="{ clickable: session.type !== 'Ev' }"
        class="ccip-app ccip-session-block session-block"
        @click="popUp(session)"
      >
        <!-- SEO Friendly a href element -->
        <a
          v-if="urlPrefix"
          v-show="false"
          :href="`${urlPrefix}/${session.id}`"
          :alt="session.zh.title"
        >
          {{ session.zh.title }}
        </a>
        <p class="ccip-app ccip-session-tags">
          <span
            v-for="tag in session.tags"
            :key="`tag-${tag}`"
            class="ccip-app ccip-session-tag"
          >
            {{ getTag(tag).zh.name }}
          </span>
        </p>
        <h2 class="ccip-app ccip-session-title">{{ session.zh.title }}</h2>
        <p class="ccip-app ccip-session-speakers">
          <span
            v-for="speaker in session.speakers"
            :key="`speaker-${speaker}`"
            class="ccip-app ccip-session-speaker"
          >
            {{ getSpeaker(speaker).zh.name }}
          </span>
        </p>
      </div>
    </div>
    <div v-else class="ccip-app ccip-session-table mobile">
      <div
        v-for="group in mobileSessions"
        :key="`session-group-${group.time}`"
        class="ccip-app ccip-session-time-group"
      >
        <div class="ccip-app ccip-session-time-group head">
          <p class="ccip-app ccip-session-time-group time">
            {{ formatTime(timeParser(group.time)) }}
          </p>
        </div>
        <div
          v-for="session in group.sessions"
          :key="`session-${session.id}`"
          :class="{ clickable: session.type !== 'Ev' }"
          class="ccip-app ccip-session-time-group session-block"
          @click="popUp(session)"
        >
          <!-- SEO Friendly a href element -->
          <a
            v-if="urlPrefix"
            v-show="false"
            :href="`${urlPrefix}/${session.id}`"
            :alt="session.zh.title"
          >
            {{ session.zh.title }}
          </a>
          <p class="ccip-app ccip-session-tags">
            <span
              v-for="tag in session.tags"
              :key="`tag-${tag}`"
              class="ccip-app ccip-session-tag"
            >
              {{ getTag(tag).zh.name }}
            </span>
          </p>
          <h2 class="ccip-app ccip-session-title">{{ session.zh.title }}</h2>
          <p class="ccip-app ccip-session-speakers">
            <span
              v-for="speaker in session.speakers"
              :key="`speaker-${speaker}`"
              class="ccip-app ccip-session-speaker"
            >
              {{ getSpeaker(speaker).zh.name }}
            </span>
          </p>
          <p class="ccip-app ccip-session-time">
            {{
              (new Date(session.end).getTime() -
                new Date(session.start).getTime()) /
                1000 /
                60
            }}
            min
          </p>
          <p class="ccip-app ccip-session-room">{{ session.room }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';

import {
  IRoom,
  ISessionData,
  ISession,
  ITag,
  ISpeaker,
  IMobileSession
} from './types/session';

@Component
export default class CCIPSessionTable extends Vue {
  @PropSync('isPopup', {
    default: false,
    required: false
  })
  private childIsPopup!: boolean;

  @PropSync('popUpSession', {
    default: {},
    required: false
  })
  private childPopUpSession!: ISession;

  @Prop({
    required: true
  })
  private sessionData!: ISessionData;

  @Prop({
    required: false
  })
  private rooms!: IRoom['id'][];

  @Prop({
    default: false,
    required: false
  })
  private isMobile!: boolean;

  @Prop({
    default: '',
    required: false
  })
  private urlPrefix!: string;

  private sessions: ISession[] = this.sessionData.sessions;
  private mobileSessions: IMobileSession[] = [];
  private timeline: string[] = [];
  private gridColString: string = '';
  private gridRowString: string = '';

  public created() {
    this.preProcessSessionData();
  }

  private preProcessSessionData(): void {
    this.processRoomData();
    this.processTimelineData();
    this.processMobileSession();
    this.measureTableGrid();
  }

  private processRoomData(): void {
    if (
      !this.rooms ||
      typeof this.rooms === 'undefined' ||
      this.rooms.length === 0
    ) {
      this.rooms = _.map(this.sessionData.rooms, 'id');
    }
  }

  private processTimelineData(): void {
    const sessionStartTimeCollection: Date[] = _.map(
      this.sessionData.sessions,
      'start'
    );
    const sessionEndTimeCollection: Date[] = _.map(
      this.sessionData.sessions,
      'end'
    );

    this.timeline = _.orderBy(
      _.uniq(
        _.map(
          _.concat(sessionStartTimeCollection, sessionEndTimeCollection),
          this.timeParser
        )
      )
    );
  }

  private processMobileSession(): void {
    const events = _.filter(this.sessions, ['type', 'Ev']);
    const sessions = _.concat(
      _.first(events) as ISession,
      _.filter(this.sessions, session => session.type !== 'Ev'),
      _.last(events) as ISession
    );
    const groupedSession = _.groupBy(sessions, 'start');
    const groupedSessionTime = Object.keys(groupedSession);
    const groupedSessionCollection = Object.values(groupedSession);

    this.mobileSessions = _.orderBy(
      _.map(groupedSessionTime, (time, index) => ({
        time: new Date(time),
        sessions: groupedSessionCollection[index]
      })),
      'time'
    );
  }

  private processSessionRoom(
    session: ISession
  ): { start: IRoom['id']; end?: IRoom['id'] } {
    // Broadcast Process
    if (session.broadcast && typeof session.broadcast !== 'undefined') {
      let broadcastSet: IRoom['id'][] = session.broadcast;
      if (!_.isEqual(this.sessionData.rooms, this.rooms)) {
        // Handle custom room index
        const differentRoomCompairGroup = _.groupBy(
          _.xorWith(
            this.mapRoom(_.map(this.sessionData.rooms, 'id')),
            this.mapRoom(this.rooms),
            _.isEqual
          ),
          'id'
        );

        broadcastSet = _.map(session.broadcast, room => {
          if (_.includes(Object.keys(differentRoomCompairGroup), room)) {
            return this.rooms[differentRoomCompairGroup[room][0].index];
          } else {
            return room;
          }
        });
      }

      return {
        start: _.first(broadcastSet) as IRoom['id'],
        end:
          _.last(broadcastSet) === _.last(this.rooms)
            ? 'END'
            : this.rooms[_.indexOf(this.rooms, _.last(broadcastSet)) + 1]
      };
    } else {
      return {
        start: session.room
      };
    }
  }

  private measureTableGrid(): void {
    this.gridColString = `[TIME] 60px [${_.join(
      this.rooms,
      '] 1fr ['
    )}] 1fr [END]`;

    this.gridRowString = `[HEAD] auto [T${_.join(
      this.timeline,
      '] auto [T'
    )}] auto [TAIL]`;
  }

  private timeParser(datetime: Date | string): string {
    return new Date(datetime)
      .toLocaleTimeString('en-US', {
        timeZone: 'Asia/Taipei',
        hour12: false
      })
      .replace(/:/g, '');
  }

  private getSpeaker(id: ISpeaker['id']): ISpeaker {
    return _.find(this.sessionData.speakers, ['id', id]) as ISpeaker;
  }

  private getTag(id: ITag['id']): ITag {
    return _.find(this.sessionData.tags, ['id', id]) as ITag;
  }

  private formatTime(time: string): string {
    return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
  }

  private mapRoom(
    rooms: IRoom['id'][]
  ): Array<{ id: IRoom['id']; index: number }> {
    return _.map(rooms, (room, index) => ({ id: room, index }));
  }

  private popUp(session: ISession): void {
    if (session.type !== 'Ev') {
      this.childPopUpSession = session;
      this.childIsPopup = true;
    }
  }
}
</script>

<style lang="scss" scoped>
@import './scss/main.scss';
</style>
