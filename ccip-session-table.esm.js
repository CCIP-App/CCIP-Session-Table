import { PropSync, Prop, Component, Vue } from 'vue-property-decorator';
import _ from 'lodash';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var CCIPSessionTable = /*@__PURE__*/(function (Vue) {
    function CCIPSessionTable() {
        Vue.apply(this, arguments);
        this.sessions = this.sessionData.sessions;
        this.mobileSessions = [];
        this.timeline = [];
        this.gridColString = '';
        this.gridRowString = '';
    }

    if ( Vue ) CCIPSessionTable.__proto__ = Vue;
    CCIPSessionTable.prototype = Object.create( Vue && Vue.prototype );
    CCIPSessionTable.prototype.constructor = CCIPSessionTable;
    CCIPSessionTable.prototype.created = function created () {
        this.preProcessSessionData();
    };
    CCIPSessionTable.prototype.preProcessSessionData = function preProcessSessionData () {
        this.processRoomData();
        this.processTimelineData();
        this.processMobileSession();
        this.measureTableGrid();
    };
    CCIPSessionTable.prototype.processRoomData = function processRoomData () {
        if (!this.rooms ||
            typeof this.rooms === 'undefined' ||
            this.rooms.length === 0) {
            this.rooms = _.map(this.sessionData.rooms, 'id');
        }
    };
    CCIPSessionTable.prototype.processTimelineData = function processTimelineData () {
        var sessionStartTimeCollection = _.map(this.sessionData.sessions, 'start');
        var sessionEndTimeCollection = _.map(this.sessionData.sessions, 'end');
        this.timeline = _.orderBy(_.uniq(_.map(_.concat(sessionStartTimeCollection, sessionEndTimeCollection), this.timeParser)));
    };
    CCIPSessionTable.prototype.processMobileSession = function processMobileSession () {
        var events = _.filter(this.sessions, ['type', 'Ev']);
        var sessions = _.concat(_.first(events), _.filter(this.sessions, function (session) { return session.type !== 'Ev'; }), _.last(events));
        var groupedSession = _.groupBy(sessions, 'start');
        var groupedSessionTime = Object.keys(groupedSession);
        var groupedSessionCollection = Object.values(groupedSession);
        this.mobileSessions = _.orderBy(_.map(groupedSessionTime, function (time, index) { return ({
            time: new Date(time),
            sessions: groupedSessionCollection[index]
        }); }), 'time');
    };
    CCIPSessionTable.prototype.processSessionRoom = function processSessionRoom (session) {
        var this$1 = this;

        // Broadcast Process
        if (session.broadcast && typeof session.broadcast !== 'undefined') {
            var broadcastSet = session.broadcast;
            if (!_.isEqual(this.sessionData.rooms, this.rooms)) {
                // Handle custom room index
                var differentRoomCompairGroup = _.groupBy(_.xorWith(this.mapRoom(_.map(this.sessionData.rooms, 'id')), this.mapRoom(this.rooms), _.isEqual), 'id');
                broadcastSet = _.map(session.broadcast, function (room) {
                    if (_.includes(Object.keys(differentRoomCompairGroup), room)) {
                        return this$1.rooms[differentRoomCompairGroup[room][0].index];
                    }
                    else {
                        return room;
                    }
                });
            }
            return {
                start: _.first(broadcastSet),
                end: _.last(broadcastSet) === _.last(this.rooms)
                    ? 'END'
                    : this.rooms[_.indexOf(this.rooms, _.last(broadcastSet)) + 1]
            };
        }
        else {
            return {
                start: session.room
            };
        }
    };
    CCIPSessionTable.prototype.measureTableGrid = function measureTableGrid () {
        this.gridColString = "[TIME] 60px [" + (_.join(this.rooms, '] 1fr [')) + "] 1fr [END]";
        this.gridRowString = "[HEAD] auto [T" + (_.join(this.timeline, '] auto [T')) + "] auto [TAIL]";
    };
    CCIPSessionTable.prototype.timeParser = function timeParser (datetime) {
        return new Date(datetime)
            .toLocaleTimeString('en-US', {
            timeZone: 'Asia/Taipei',
            hour12: false
        })
            .replace(/:/g, '');
    };
    CCIPSessionTable.prototype.getSpeaker = function getSpeaker (id) {
        return _.find(this.sessionData.speakers, ['id', id]);
    };
    CCIPSessionTable.prototype.getTag = function getTag (id) {
        return _.find(this.sessionData.tags, ['id', id]);
    };
    CCIPSessionTable.prototype.formatTime = function formatTime (time) {
        return ((time.slice(0, 2)) + ":" + (time.slice(2, 4)));
    };
    CCIPSessionTable.prototype.mapRoom = function mapRoom (rooms) {
        return _.map(rooms, function (room, index) { return ({ id: room, index: index }); });
    };
    CCIPSessionTable.prototype.popUp = function popUp (session) {
        if (session.type !== 'Ev') {
            this.childPopUpSession = session;
            this.childIsPopup = true;
        }
    };

    return CCIPSessionTable;
}(Vue));
__decorate([
    PropSync('isPopup', {
        default: false,
        required: false
    })
], CCIPSessionTable.prototype, "childIsPopup", void 0);
__decorate([
    PropSync('popUpSession', {
        default: {},
        required: false
    })
], CCIPSessionTable.prototype, "childPopUpSession", void 0);
__decorate([
    Prop({
        required: true
    })
], CCIPSessionTable.prototype, "sessionData", void 0);
__decorate([
    Prop({
        required: false
    })
], CCIPSessionTable.prototype, "rooms", void 0);
__decorate([
    Prop({
        default: false,
        required: false
    })
], CCIPSessionTable.prototype, "isMobile", void 0);
__decorate([
    Prop({
        default: '',
        required: false
    })
], CCIPSessionTable.prototype, "urlPrefix", void 0);
CCIPSessionTable = __decorate([
    Component
], CCIPSessionTable);
var script = CCIPSessionTable;

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "ccip-app" }, [
    !_vm.isMobile
      ? _c(
          "div",
          {
            staticClass: "ccip-app ccip-session-table general",
            style: {
              "grid-template-columns": _vm.gridColString,
              "grid-template-rows": _vm.gridRowString
            }
          },
          [
            _vm._l(_vm.timeline, function(time) {
              return _c(
                "div",
                {
                  key: "time-" + time,
                  staticClass: "ccip-app ccip-session-block time-block",
                  style: {
                    "grid-column-start": "TIME",
                    "grid-row-start": "T" + time
                  }
                },
                [_c("p", [_vm._v(_vm._s(_vm.formatTime(time)))])]
              )
            }),
            _vm._v(" "),
            _vm._l(_vm.rooms, function(room) {
              return _c(
                "div",
                {
                  key: "room-" + room,
                  staticClass: "ccip-app ccip-session-block room-block",
                  style: {
                    "grid-column-start": "" + room,
                    "grid-row-start": "HEAD"
                  }
                },
                [_c("p", [_vm._v(_vm._s(room))])]
              )
            }),
            _vm._v(" "),
            _vm._l(_vm.sessions, function(session) {
              return _c(
                "div",
                {
                  key: "session-" + session.id,
                  staticClass: "ccip-app ccip-session-block session-block",
                  class: { clickable: session.type !== "Ev" },
                  style: {
                    "grid-column-start": _vm.processSessionRoom(session).start,
                    "grid-column-end": _vm.processSessionRoom(session).end,
                    "grid-row-start": "T" + _vm.timeParser(session.start),
                    "grid-row-end": "T" + _vm.timeParser(session.end)
                  },
                  on: {
                    click: function($event) {
                      return _vm.popUp(session)
                    }
                  }
                },
                [
                  _vm.urlPrefix
                    ? _c(
                        "a",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: false,
                              expression: "false"
                            }
                          ],
                          attrs: {
                            href: _vm.urlPrefix + "/" + session.id,
                            alt: session.zh.title
                          }
                        },
                        [
                          _vm._v(
                            "\n        " + _vm._s(session.zh.title) + "\n      "
                          )
                        ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "p",
                    { staticClass: "ccip-app ccip-session-tags" },
                    _vm._l(session.tags, function(tag) {
                      return _c(
                        "span",
                        {
                          key: "tag-" + tag,
                          staticClass: "ccip-app ccip-session-tag"
                        },
                        [
                          _vm._v(
                            "\n          " +
                              _vm._s(_vm.getTag(tag).zh.name) +
                              "\n        "
                          )
                        ]
                      )
                    }),
                    0
                  ),
                  _vm._v(" "),
                  _c("h2", { staticClass: "ccip-app ccip-session-title" }, [
                    _vm._v(_vm._s(session.zh.title))
                  ]),
                  _vm._v(" "),
                  _c(
                    "p",
                    { staticClass: "ccip-app ccip-session-speakers" },
                    _vm._l(session.speakers, function(speaker) {
                      return _c(
                        "span",
                        {
                          key: "speaker-" + speaker,
                          staticClass: "ccip-app ccip-session-speaker"
                        },
                        [
                          _vm._v(
                            "\n          " +
                              _vm._s(_vm.getSpeaker(speaker).zh.name) +
                              "\n        "
                          )
                        ]
                      )
                    }),
                    0
                  )
                ]
              )
            })
          ],
          2
        )
      : _c(
          "div",
          { staticClass: "ccip-app ccip-session-table mobile" },
          _vm._l(_vm.mobileSessions, function(group) {
            return _c(
              "div",
              {
                key: "session-group-" + group.time,
                staticClass: "ccip-app ccip-session-time-group"
              },
              [
                _c(
                  "div",
                  { staticClass: "ccip-app ccip-session-time-group head" },
                  [
                    _c(
                      "p",
                      { staticClass: "ccip-app ccip-session-time-group time" },
                      [
                        _vm._v(
                          "\n          " +
                            _vm._s(_vm.formatTime(_vm.timeParser(group.time))) +
                            "\n        "
                        )
                      ]
                    )
                  ]
                ),
                _vm._v(" "),
                _vm._l(group.sessions, function(session) {
                  return _c(
                    "div",
                    {
                      key: "session-" + session.id,
                      staticClass:
                        "ccip-app ccip-session-time-group session-block",
                      class: { clickable: session.type !== "Ev" },
                      on: {
                        click: function($event) {
                          return _vm.popUp(session)
                        }
                      }
                    },
                    [
                      _vm.urlPrefix
                        ? _c(
                            "a",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: false,
                                  expression: "false"
                                }
                              ],
                              attrs: {
                                href: _vm.urlPrefix + "/" + session.id,
                                alt: session.zh.title
                              }
                            },
                            [
                              _vm._v(
                                "\n          " +
                                  _vm._s(session.zh.title) +
                                  "\n        "
                              )
                            ]
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _c(
                        "p",
                        { staticClass: "ccip-app ccip-session-tags" },
                        _vm._l(session.tags, function(tag) {
                          return _c(
                            "span",
                            {
                              key: "tag-" + tag,
                              staticClass: "ccip-app ccip-session-tag"
                            },
                            [
                              _vm._v(
                                "\n            " +
                                  _vm._s(_vm.getTag(tag).zh.name) +
                                  "\n          "
                              )
                            ]
                          )
                        }),
                        0
                      ),
                      _vm._v(" "),
                      _c("h2", { staticClass: "ccip-app ccip-session-title" }, [
                        _vm._v(_vm._s(session.zh.title))
                      ]),
                      _vm._v(" "),
                      _c(
                        "p",
                        { staticClass: "ccip-app ccip-session-speakers" },
                        _vm._l(session.speakers, function(speaker) {
                          return _c(
                            "span",
                            {
                              key: "speaker-" + speaker,
                              staticClass: "ccip-app ccip-session-speaker"
                            },
                            [
                              _vm._v(
                                "\n            " +
                                  _vm._s(_vm.getSpeaker(speaker).zh.name) +
                                  "\n          "
                              )
                            ]
                          )
                        }),
                        0
                      ),
                      _vm._v(" "),
                      _c("p", { staticClass: "ccip-app ccip-session-time" }, [
                        _vm._v(
                          "\n          " +
                            _vm._s(
                              (new Date(session.end).getTime() -
                                new Date(session.start).getTime()) /
                                1000 /
                                60
                            ) +
                            "\n          min\n        "
                        )
                      ]),
                      _vm._v(" "),
                      _c("p", { staticClass: "ccip-app ccip-session-room" }, [
                        _vm._v(_vm._s(session.room))
                      ])
                    ]
                  )
                })
              ],
              2
            )
          }),
          0
        )
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-736a4b7a_0", { source: ".ccip-app.ccip-session-table[data-v-736a4b7a] {\n  position: relative;\n}\n.ccip-app.ccip-session-table.general[data-v-736a4b7a] {\n  display: grid;\n}\n.ccip-app.ccip-session-title[data-v-736a4b7a] {\n  white-space: pre-wrap;\n}\n\n/*# sourceMappingURL=SessionTable.vue.map */", map: {"version":3,"sources":["SessionTable.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;AACpB;AACA;EACE,aAAa;AACf;AACA;EACE,qBAAqB;AACvB;;AAEA,2CAA2C","file":"SessionTable.vue","sourcesContent":[".ccip-app.ccip-session-table {\n  position: relative;\n}\n.ccip-app.ccip-session-table.general {\n  display: grid;\n}\n.ccip-app.ccip-session-title {\n  white-space: pre-wrap;\n}\n\n/*# sourceMappingURL=SessionTable.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-736a4b7a";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

function install(Vue) {
  if (install.installed) { return; }
  install.installed = true;
  Vue.component('SessionTable', __vue_component__);
}

var plugin = {
  install: install
};

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default __vue_component__;
export { install };
