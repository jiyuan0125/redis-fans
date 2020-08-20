import React from 'react';
import { UseSessionHook } from '@src/hooks/useSession';
import { v4 as uuidv4 } from 'uuid';
import { UseGlobalHook } from '@src/hooks/useGlobal';
import {
  DataObject,
  ObjectDataType,
  Session,
  Tab,
  TabType,
  HashDataObject,
  StringDataObject,
  ZsetDataObject,
  ListDataObject,
  SetDataObject,
  HashValueType,
  ZsetValueType,
  SetValueType,
  ListValueType,
} from '@src/types';
import { RedisResult, UseRedisHook } from '@src/hooks/useRedis';
import _ from 'lodash';
import {
  DEFAULT_LRANGE_COUNT,
  DEFAULT_MATCH_STR,
  DEFAULT_HSCAN_COUNT,
  DEFAULT_SSCAN_COUNT,
  DEFAULT_ZSCAN_COUNT,
} from '@src/constants';

export interface UseService {
  getTabByObject: (object: DataObject) => void;
  setActiveTabId: (tabId: string) => void;
  addTab: (
    temporary: boolean,
    type: TabType,
    name: string,
    object?: DataObject
  ) => void;
  deleteTab: (tab: Tab) => void;
  deleteOtherTabs: (tab: Tab) => void;
  deleteTabsToTheRight: (tab: Tab) => void;
  clearTabs: () => void;
  addTerminalTab: (temporary: boolean) => void;
  addLuaEditorTab: (temporary: boolean) => void;
  addObjectTab: (temporary: boolean, object: DataObject) => void;
  updateTabTemporary: (tab: Tab, temporary: boolean) => void;
  getObjectByTab: (tab: Tab) => void;
  createObject: (params: {
    dataType: ObjectDataType;
    key: string;
    value: string;
    field?: string;
    score?: number;
  }) => void;
  loadServerInfo: () => void;
  loadServerConfig: () => void;
  loadObjects: () => void;
  deleteObject: (object: DataObject) => void;
  renameObjectKey: (object: DataObject, newKey: string) => void;
  expireObject: (object: DataObject, expire: number) => void;
  updateStringValue: (object: StringDataObject, value: string) => void;
  loadObject: (object: DataObject) => void;
  addHashField: (object: HashDataObject, field: string, value: string) => void;
  updateHashField: (
    object: HashDataObject,
    oldField: string,
    newField: string,
    value: string
  ) => void;
  updateHashValue: (
    object: HashDataObject,
    field: string,
    value: string
  ) => void;
  deleteHashField: (object: HashDataObject, field: string) => void;
  addListValue: (object: ListDataObject, value: string) => void;
  updateListValue: (
    object: ListDataObject,
    index: number,
    value: string
  ) => void;
  deleteListValue: (object: ListDataObject, index: number) => void;
  addSetValue: (object: SetDataObject, value: string) => void;
  updateSetValue: (
    object: SetDataObject,
    oldValue: string,
    newValue: string
  ) => void;
  deleteSetValue: (object: SetDataObject, value: string) => void;
  addZsetValue: (object: ZsetDataObject, score: number, value: string) => void;
  updateZsetValue: (
    object: ZsetDataObject,
    oldValue: string,
    score: number,
    newValue: string
  ) => void;
  deleteZsetValue: (object: ZsetDataObject, value: string) => void;
  selectDb: (value: string) => void;
  executeLua: (lua: string, numsOfKey: number, ...keyOrArgvs: any[]) => void;
  swapTab: (sourceIndex: number, targetIndex: number) => void;
  fetchListValues: (
    object: ListDataObject,
    start: number,
    stop: number
  ) => void;
  fetchHashValues: (
    object: HashDataObject,
    cursor: number,
    match: string,
    count: number
  ) => void;
  fetchSetValues: (
    object: SetDataObject,
    cursor: number,
    match: string,
    count: number
  ) => void;
  fetchZsetValues: (
    object: ZsetDataObject,
    cursor: number,
    match: string,
    count: number
  ) => void;
}

export interface UseServiceProps {
  session: Session;
  useGlobalHook: UseGlobalHook;
  useRedisHook: UseRedisHook;
  useSessionHook: UseSessionHook;
}

export const useService = (props: UseServiceProps) => {
  const {
    session,
    useGlobalHook: useGlobal,
    useRedisHook: useRedis,
    useSessionHook: useSession,
  } = props;
  const { showMessage } = useGlobal;
  const { updateSessionState } = useSession;
  const {
    redisLoadServerInfo,
    redisLoadServerConfig,
    redisLoadObjectDetail,
    redisLoadObjects,
    redisRenameObject,
    redisDeleteObject,
    redisExpireObject,
    redisUpdateObjectValue,
    redisCreateStringObject,
    redisCreateHashObject,
    redisCreateListObject,
    redisCreateSetObject,
    redisCreateZsetObject,
    redisAddHashField,
    redisUpdateHashField,
    redisUpdateHashValue,
    redisDeleteHashField,
    redisAddListValue,
    redisUpdateListValue,
    redisDeleteListValue,
    redisAddSetValue,
    redisUpdateSetValue,
    redisDeleteSetValue,
    redisAddZsetValue,
    redisUpdateZsetValue,
    redisDeleteZsetValue,
    redisSelectDb,
    redisExecuteLua,
    redisFetchListValues,
    redisFetchHashValues,
    redisFetchSetValues,
    redisFetchZsetValues,
  } = useRedis;

  /**
   * 当前激活的 session 的 tabs
   */
  const tabs = session.tabs;

  /**
   * 当前激活的 tab id
   */
  const activeTabId = session.activeTabId;

  /**
   * 当前选择的 db
   */
  const activeDb = session.activeDb;

  /**
   * ServerInfo
   */
  const serverInfo = session.serverInfo;

  /**
   * ServerConfig
   */
  const serverConfig = session.serverConfig;

  /**
   * 当前激活的 tab
   */
  const activeTab = tabs.find((t) => t.id === activeTabId);

  /**
   * 当前激活的 tab index
   */
  const activeTabIndex = session.tabs.findIndex(
    (tab) => tab.id === activeTabId
  );

  /**
   * 根据 object 获得 tab
   * @param object
   */
  const getTabByObject = React.useCallback(
    (object: DataObject) => {
      return tabs.find((t) => t.referenceId === object.id);
    },
    [tabs]
  );

  /**
   * 设置激活的 tab id
   * @param tabId tab id
   */
  const setActiveTabId = React.useCallback((tabId: string) => {
    updateSessionState((draft) => {
      const targetSession = draft.sessions.find((s) => s.id === session.id);
      if (!targetSession) return;
      targetSession.activeTabId = tabId;
    });
  }, []);

  const constructTab = (
    temporary: boolean,
    id: string,
    name: string,
    type: TabType,
    object?: DataObject
  ) => {
    return {
      temporary,
      id,
      name,
      type,
      referenceId: object?.id,
    } as Tab;
  };

  /**
   * 添加新 tab
   */
  const addTab = React.useCallback(
    (temporary: boolean, type: TabType, name: string, object?: DataObject) => {
      updateSessionState((draft) => {
        const targetSession = draft.sessions.find((s) => s.id === session.id);
        if (!targetSession) return;
        const id = uuidv4();
        let existsTemporaryTab = targetSession.tabs.find((t) => t.temporary);
        const newTab = constructTab(temporary, id, name, type, object);

        switch (type) {
          case 'object':
            if (!object) return;
            const existsTab = targetSession.tabs.find(
              (t) => t.referenceId === object.id
            );
            if (existsTab) {
              targetSession.activeTabId = existsTab.id;
              existsTab.temporary = temporary && existsTab.temporary;
            } else {
              if (existsTemporaryTab) {
                existsTemporaryTab.id = newTab.id;
                existsTemporaryTab.type = newTab.type;
                existsTemporaryTab.name = newTab.name;
                existsTemporaryTab.referenceId = newTab.referenceId;
                existsTemporaryTab.temporary = newTab.temporary;
                targetSession.activeTabId = existsTemporaryTab.id;
              } else {
                targetSession.tabs.push(newTab);
                targetSession.activeTabId = id;
              }
            }
            break;
          case 'terminal':
            //if (existsTemporaryTab) {
            //existsTemporaryTab.id = newTab.id;
            //existsTemporaryTab.type = newTab.type;
            //existsTemporaryTab.name = newTab.name;
            //existsTemporaryTab.temporary = newTab.temporary;
            //targetSession.activeTabId = existsTemporaryTab.id;
            //} else {
            targetSession.tabs.push(newTab);
            targetSession.activeTabId = id;
            //}
            break;
          case 'luaEditor':
            //if (existsTemporaryTab) {
            //existsTemporaryTab.id = newTab.id;
            //existsTemporaryTab.type = newTab.type;
            //existsTemporaryTab.name = newTab.name;
            //existsTemporaryTab.temporary = newTab.temporary;
            //targetSession.activeTabId = existsTemporaryTab.id;
            //} else {
            targetSession.tabs.push(newTab);
            targetSession.activeTabId = id;
            //}
            break;
          default:
            throw new Error(`Unsupported type: ${type}.`);
        }
      });
    },
    []
  );

  const updateTabTemporary = (tab: Tab, temporary: boolean) => {
    updateSessionState((draft) => {
      const targetSession = draft.sessions.find((s) => s.id === session.id);
      if (!targetSession) return;
      const existsTab = targetSession.tabs.find((t) => t.id === tab.id);
      if (existsTab) {
        existsTab.temporary = temporary;
      }
    });
  };

  /**
   * 删除 tab
   */
  const deleteTab = React.useCallback(
    (tab: Tab) => {
      updateSessionState((draft) => {
        let nextActiveTab = activeTab;
        if (activeTabId === tab.id) {
          nextActiveTab = tabs?.[activeTabIndex! + 1];
          if (!nextActiveTab) {
            nextActiveTab = tabs?.[activeTabIndex! - 1];
          }
        }
        const targetSession = draft.sessions.find((s) => s.id === session.id);
        if (!targetSession) return;
        if (nextActiveTab) {
          targetSession.activeTabId = nextActiveTab.id;
        }
        const index = targetSession.tabs.findIndex((t) => t.id === tab.id);
        if (index > -1) {
          targetSession!.tabs.splice(index, 1);
        }
      });
    },
    [activeTabId, activeTab, activeTabIndex]
  );

  /**
   * 删除其他 tabs
   * @param tab 要删除的 tab
   */
  const deleteOtherTabs = React.useCallback((tab: Tab) => {
    updateSessionState((draft) => {
      const targetSession = draft.sessions.find((s) => s.id === session.id);
      if (!targetSession) return;
      targetSession.tabs = [];
      targetSession.tabs.push(tab);
      targetSession.activeTabId = tab.id;
    });
  }, []);

  /**
   * 删除右侧的其他 tabs
   * @param tab 要删除的 tab
   */
  const deleteTabsToTheRight = React.useCallback(
    (tab: Tab) => {
      updateSessionState((draft) => {
        const targetSession = draft.sessions.find((s) => s.id === session.id);
        if (!targetSession) return;
        const index = targetSession.tabs.findIndex((t) => t.id === tab.id);

        if (activeTab) {
          let nextActiveTab = activeTab;
          const activeTabIndex = targetSession.tabs.findIndex(
            (t) => t.id === activeTab.id
          );
          if (activeTabIndex > index) {
            nextActiveTab = tab;
          }
          targetSession.activeTabId = nextActiveTab.id;
        }

        if (index > -1) {
          const countToDelete = targetSession.tabs.length - index - 1;
          targetSession.tabs.splice(index + 1, countToDelete);
        }
      });
    },
    [activeTab]
  );

  /**
   * 清除 tab
   */
  const clearTabs = React.useCallback(() => {
    updateSessionState((draft) => {
      const targetSession = draft.sessions.find((s) => s.id === session.id);
      if (!targetSession) return;
      targetSession.tabs = [];
    });
  }, []);

  /**
   * 添加 terminal tab
   */
  const addTerminalTab = React.useCallback(
    (temporary: boolean) => {
      const terminalName = `${session.connection.name}:${session.connection.port}`;
      //const existsTab = tabs.find((tab) => tab.name === terminalName);
      //if (!existsTab) {
      addTab(temporary, 'terminal', terminalName);
      //} else {
      //setActiveTabId(existsTab.id);
      //}
    },
    [addTab]
  );

  /**
   * 添加 luaEditor tab
   */
  const addLuaEditorTab = React.useCallback(
    (temporary: boolean) => {
      const terminalName = `${session.connection.name}:${session.connection.port}`;

      //if (!existsTab) {
      addTab(temporary, 'luaEditor', terminalName);
      //} else {
      //setActiveTabId(existsTab.id);
      //}
    },
    [addTab]
  );

  /**
   * 添加 object tab
   * @param object object
   */
  const addObjectTab = React.useCallback(
    (temporary: boolean, object: DataObject) => {
      addTab(temporary, 'object', object.key, object);
    },
    [addTab]
  );

  /**
   * 激活的 object
   */
  const activeObject = session.objects.find(
    (o) => o.id === activeTab?.referenceId
  );

  /**
   * 当前激活的 session 的所有 objects
   */
  const objects = session.objects ?? [];

  /**
   * 根据 tab 获得 object
   * @param tab tab
   */
  const getObjectByTab = React.useCallback(
    (tab: Tab) => {
      return objects.find((o) => o.id === tab.referenceId);
    },
    [objects]
  );

  /**
   * 新增 object
   */
  const createObject = React.useCallback(
    async (params: {
      dataType: ObjectDataType;
      key: string;
      value: string;
      field?: string;
      score?: number;
    }) => {
      let redisResult: RedisResult | undefined = undefined;
      switch (params.dataType) {
        case 'string':
          redisResult = await redisCreateStringObject(params.key, params.value);
          break;
        case 'hash':
          redisResult = await redisCreateHashObject(
            params.key,
            params.field!,
            params.value
          );
          break;
        case 'list':
          redisResult = await redisCreateListObject(params.key, params.value);
          break;
        case 'set':
          await redisCreateSetObject(params.key, params.value);
          break;
        case 'zset':
          redisResult = await redisCreateZsetObject(
            params.key,
            params.score!,
            params.value
          );
          break;
        default:
          showMessage('error', 'Unsupported object type.');
          break;
      }
      if (redisResult?.success) {
        // Ignore
      }
    },
    [
      redisCreateStringObject,
      redisCreateHashObject,
      redisCreateListObject,
      redisCreateSetObject,
      redisCreateZsetObject,
      showMessage,
    ]
  );

  /**
   * 加载服务器信息
   */
  const loadServerInfo = React.useCallback(async () => {
    const redisResult = await redisLoadServerInfo();
    if (redisResult.success) {
      updateSessionState((draft) => {
        const targetSession = draft.sessions.find((s) => s.id === session.id)!;
        targetSession.serverInfo = redisResult.result;
      });
    }
  }, [redisLoadServerInfo]);

  /**
   * 加载配置信息
   */
  const loadServerConfig = React.useCallback(async () => {
    const redisResult = await redisLoadServerConfig();
    if (redisResult.success) {
      updateSessionState((draft) => {
        const targetSession = draft.sessions.find((s) => s.id === session.id)!;
        const values = redisResult.result || ([] as string[]);
        for (let i = 0; i < values.length; i += 2) {
          const key = values[i];
          const value = values[i + 1];
          targetSession.serverConfig[key] = value;
        }
      });
    }
  }, [redisLoadServerConfig]);

  /**
   * 加载 object 列表
   */
  const loadObjects = React.useCallback(
    async (clean = false) => {
      const redisResult = await redisLoadObjects();
      if (redisResult.success) {
        const keys = redisResult.result as string[];
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          if (clean) {
            targetSession.tabs = [];
            targetSession.objects = [];
          }

          const originalKeys = targetSession.objects.map((o) => o.key);
          const keysToAdd = _.difference(keys, originalKeys);
          const keysToRemove = _.difference(originalKeys, keys);

          keysToAdd.forEach((key) => {
            targetSession.objects.push({
              id: uuidv4(),
              key,
            } as DataObject);
          });

          keysToRemove.forEach((key) => {
            const index = targetSession.objects.findIndex((o) => o.key === key);
            if (index > -1) {
              targetSession.objects.splice(index, 1);
            }
          });
        });

        // 刷新所有打开的object
        const objectTabs = tabs.filter((tab) => tab.type === 'object');
        await Promise.all(
          objectTabs.map((tab) => {
            const object = getObjectByTab(tab);
            return loadObject(object!);
          })
        );

        //showMessage('success', 'objects loaded');
      }
    },
    [redisLoadObjects, showMessage, tabs]
  );

  const deleteObjectFromObjectList = React.useCallback((object: DataObject) => {
    updateSessionState((draft) => {
      const targetSession = draft.sessions.find((s) => s.id === session.id);
      if (!targetSession) return;
      const index = targetSession.objects.findIndex((o) => o.id === object.id);
      if (index > -1) {
        targetSession!.objects.splice(index, 1);
      }
    });
  }, []);

  /**
   * 删除 object
   * @param object object
   */
  const deleteObject = React.useCallback(
    async (object: DataObject) => {
      const redisResult = await redisDeleteObject(object.key);
      if (redisResult.success) {
        const tab = getTabByObject(object);
        if (tab) {
          deleteTab(tab);
        }
        deleteObjectFromObjectList(object);
      }
    },
    [redisDeleteObject, deleteTab]
  );

  /**
   * 重命名 key
   * @param newKey new key
   */
  const renameObjectKey = React.useCallback(
    async (object: DataObject, newKey: string) => {
      const redisResult = await redisRenameObject(object.key, newKey);
      if (redisResult.success) {
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          targetSession.objects.find((o) => o.id === object.id)!.key = newKey;
        });
      }
    },
    [redisRenameObject]
  );

  /**
   * 更新 object expire
   * @param object
   * @param expire
   */
  const expireObject = React.useCallback(
    async (object: DataObject, expire: number) => {
      const redisResult = await redisExpireObject(object.key, expire);
      if (redisResult.success) {
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          targetSession.objects.find(
            (o) => o.id === object.id
          )!.expire = expire;
        });
      }
    },
    [redisExpireObject]
  );

  /**
   * 更新 string value
   */
  const updateStringValue = React.useCallback(
    async (object: StringDataObject, value: string) => {
      const redisResult = await redisUpdateObjectValue(object.key, value);
      if (redisResult.success) {
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          (targetSession.objects.find(
            (o) => o.id === object.id
          )! as StringDataObject).value = value;
        });

        showMessage('success', 'Updated successfully.');
      }
    },
    [redisUpdateObjectValue, showMessage]
  );

  /**
   * 获得 object 详细信息
   */
  const loadObject = React.useCallback(
    async (object: DataObject) => {
      const redisResult = await redisLoadObjectDetail(object);
      if (redisResult.success) {
        const { value, expire, type } = redisResult.result;
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          const targetObject = targetSession.objects.find(
            (o) => o.id === object.id
          );
          if (expire !== undefined) {
            targetObject!.expire = expire;
          }
          if (type !== undefined) {
            targetObject!.dataType = type;
            switch (type) {
              case 'string':
                (targetObject as StringDataObject).value = value;
                break;
              case 'list':
                (targetObject as ListDataObject).total = value.total;
                (targetObject as ListDataObject).lrangeStart = 0;
                (targetObject as ListDataObject).lrangeStop =
                  DEFAULT_LRANGE_COUNT - 1;
                const listEntries = [] as ListValueType[];
                for (let i = 0; i < value.result.length; i++) {
                  const entry = {
                    value: value.result[i],
                  };
                  listEntries.push(entry);
                }
                (targetObject as ListDataObject).values = listEntries;
                break;
              case 'hash':
                (targetObject as HashDataObject).total = value.total;
                (targetObject as HashDataObject).match = DEFAULT_MATCH_STR;
                (targetObject as HashDataObject).count = DEFAULT_HSCAN_COUNT;
                (targetObject as HashDataObject).lastCursor = parseInt(
                  value.result[0]
                );
                const hashEntries = [] as HashValueType[];
                for (let i = 0; i < value.result[1].length; i += 2) {
                  const entry = {
                    field: value.result[1][i],
                    value: value.result[1][i + 1],
                  };
                  hashEntries.push(entry);
                }
                (targetObject as HashDataObject).values = hashEntries;
                break;
              case 'set':
                (targetObject as SetDataObject).total = value.total;
                (targetObject as SetDataObject).match = DEFAULT_MATCH_STR;
                (targetObject as SetDataObject).count = DEFAULT_SSCAN_COUNT;
                (targetObject as SetDataObject).lastCursor = parseInt(
                  value.result[0]
                );
                const setEntries = [] as SetValueType[];
                for (let i = 0; i < value.result[1].length; i++) {
                  const entry = {
                    value: value.result[1][i],
                  };
                  setEntries.push(entry);
                }
                (targetObject as SetDataObject).values = setEntries;
                break;
              case 'zset':
                (targetObject as ZsetDataObject).total = value.total;
                (targetObject as ZsetDataObject).match = DEFAULT_MATCH_STR;
                (targetObject as ZsetDataObject).count = DEFAULT_ZSCAN_COUNT;
                (targetObject as ZsetDataObject).lastCursor = parseInt(
                  value.result[0]
                );
                const zsetEntries = [] as ZsetValueType[];
                for (let i = 0; i < value.result[1].length; i += 2) {
                  const entry = {
                    value: value.result[1][i] as string,
                    score: parseInt(value.result[1][i + 1]),
                  };
                  zsetEntries.push(entry);
                }
                (targetObject as ZsetDataObject).values = zsetEntries;
                break;
              default:
              // Ignore
            }
          }
        });

        //showMessage('success', 'value loaded');
      }
    },
    [redisLoadObjectDetail]
  );

  /**
   * 添加 hash field
   */
  const addHashField = React.useCallback(
    async (object: HashDataObject, field: string, value: string) => {
      const redisResult = await redisAddHashField(object.key, field, value);
      if (redisResult.success) {
        loadObject(object);
      }
    },
    [redisAddHashField, loadObject]
  );

  /**
   * 更新 hash field
   */
  const updateHashField = React.useCallback(
    async (
      object: HashDataObject,
      oldField: string,
      newField: string,
      value: string
    ) => {
      const redisResult = await redisUpdateHashField(
        object.key,
        oldField,
        newField,
        value
      );
      if (redisResult.success) {
        loadObject(object);
        showMessage('success', 'Updated successfully.');
      }
    },
    [redisUpdateHashField, loadObject]
  );

  /**
   * 更新 hash value
   */
  const updateHashValue = React.useCallback(
    async (object: HashDataObject, field: string, value: string) => {
      const redisResult = await redisUpdateHashValue(object.key, field, value);
      if (redisResult.success) {
        loadObject(object);
        showMessage('success', 'Updated successfully.');
      }
    },
    [redisUpdateHashField, loadObject]
  );

  /**
   * 删除 hash field
   */
  const deleteHashField = React.useCallback(
    async (object: HashDataObject, field: string) => {
      const fieldCount = Object.keys(object.values).length;
      const redisResult = await redisDeleteHashField(object.key, field);
      if (fieldCount <= 1) {
        const tab = getTabByObject(object);
        if (tab) {
          deleteTab(tab);
        }

        deleteObjectFromObjectList(object);
      } else {
        if (redisResult.success) {
          loadObject(object);
        }
      }
    },
    [redisDeleteHashField, getTabByObject, loadObject]
  );

  /**
   * 添加 list value
   */
  const addListValue = React.useCallback(
    async (object: ListDataObject, value: string) => {
      const redisResult = await redisAddListValue(object.key, value);
      if (redisResult.success) {
        loadObject(object);
      }
    },
    [redisAddListValue, loadObject]
  );

  /**
   * 更新 list value
   */
  const updateListValue = React.useCallback(
    async (object: ListDataObject, index: number, value: string) => {
      const redisResult = await redisUpdateListValue(object.key, index, value);
      if (redisResult.success) {
        loadObject(object);
        showMessage('success', 'Updated successfully.');
      }
    },
    []
  );

  /**
   * 删除 list value
   */
  const deleteListValue = React.useCallback(
    async (object: ListDataObject, index: number) => {
      const valueCount = object.values.length;
      const redisResult = await redisDeleteListValue(object.key, index);
      if (valueCount <= 1) {
        const tab = getTabByObject(object);
        if (tab) {
          deleteTab(tab);
        }

        deleteObjectFromObjectList(object);
      } else {
        if (redisResult.success) {
          loadObject(object);
        }
      }
    },
    [redisDeleteListValue, getTabByObject, loadObject]
  );

  /**
   * 添加 set value
   */
  const addSetValue = React.useCallback(
    async (object: SetDataObject, value: string) => {
      const redisResult = await redisAddSetValue(object.key, value);
      if (redisResult.success) {
        loadObject(object);
      }
    },
    [redisAddSetValue, loadObject]
  );

  /**
   * 更新 set value
   */
  const updateSetValue = React.useCallback(
    async (object: SetDataObject, oldValue: string, newValue: string) => {
      const redisResult = await redisUpdateSetValue(
        object.key,
        oldValue,
        newValue
      );
      if (redisResult.success) {
        loadObject(object);
        showMessage('success', 'Updated successfully.');
      }
    },
    [redisUpdateSetValue, loadObject]
  );

  /**
   * 删除 set value
   */
  const deleteSetValue = React.useCallback(
    async (object: SetDataObject, value: string) => {
      const valueCount = object.values.length;
      const redisResult = await redisDeleteSetValue(object.key, value);
      if (valueCount <= 1) {
        const tab = getTabByObject(object);
        if (tab) {
          deleteTab(tab);
        }

        deleteObjectFromObjectList(object);
      } else {
        if (redisResult.success) {
          loadObject(object);
        }
      }
    },
    [redisDeleteSetValue, getTabByObject, loadObject]
  );

  /**
   * 添加 zset value
   */
  const addZsetValue = React.useCallback(
    async (object: ZsetDataObject, score: number, value: string) => {
      const redisResult = await redisAddZsetValue(object.key, score, value);
      if (redisResult.success) {
        loadObject(object);
      }
    },
    [redisAddZsetValue, loadObject]
  );

  /**
   * 更新 set value
   */
  const updateZsetValue = React.useCallback(
    async (
      object: ZsetDataObject,
      oldValue: string,
      score: number,
      newValue: string
    ) => {
      const redisResult = await redisUpdateZsetValue(
        object.key,
        oldValue,
        score,
        newValue
      );
      if (redisResult.success) {
        loadObject(object);
        showMessage('success', 'Updated successfully.');
      }
    },
    [redisUpdateZsetValue, loadObject]
  );

  /**
   * 删除 set value
   */
  const deleteZsetValue = React.useCallback(
    async (object: ZsetDataObject, value: string) => {
      const valueCount = object.values.length;
      const redisResult = await redisDeleteZsetValue(object.key, value);
      if (valueCount <= 1) {
        const tab = getTabByObject(object);
        if (tab) {
          deleteTab(tab);
        }

        deleteObjectFromObjectList(object);
      } else {
        if (redisResult.success) {
          loadObject(object);
        }
      }
    },
    [redisDeleteZsetValue, getTabByObject, loadObject]
  );

  /**
   * 选择 db
   */
  const selectDb = React.useCallback(
    async (value: string) => {
      const redisResult = await redisSelectDb(value);
      if (redisResult.success) {
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          if (targetSession.activeDb !== value.toString()) {
            targetSession.activeDb = value;
          }
        });
      }
    },
    [redisSelectDb]
  );

  /**
   * 执行 Lua
   */
  const executeLua = React.useCallback(
    async (lua: string, numsOfKey: number, ...keyOrArgvs: any[]) => {
      const redisResult = await redisExecuteLua(lua, numsOfKey, ...keyOrArgvs);

      return redisResult;
    },
    [redisExecuteLua]
  );

  /**
   * 交换两个tab
   */
  const swapTab = React.useCallback(
    (sourceIndex: number, targetIndex: number) => {
      const bigIndex = Math.max(sourceIndex, targetIndex);
      const smallIndex = Math.min(sourceIndex, targetIndex);
      updateSessionState((draft) => {
        const targetSession = draft.sessions.find((s) => s.id === session.id);
        if (!targetSession) return;
        const tmp = targetSession.tabs.splice(bigIndex, 1);
        targetSession.tabs.splice(smallIndex, 0, tmp[0]);
      });
    },
    []
  );

  const fetchListValues = React.useCallback(
    async (object: ListDataObject, start: number, stop: number) => {
      const redisResult = await redisFetchListValues(object.key, start, stop);
      if (redisResult.success) {
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          const targetObject = targetSession.objects.find(
            (o) => o.id === object.id
          );
          if (targetObject) {
            (targetObject as ListDataObject).total = redisResult.result.total;
            (targetObject as ListDataObject).lrangeStart = start;
            (targetObject as ListDataObject).lrangeStop = stop;
            const listEntries = [] as ListValueType[];
            for (let i = 0; i < redisResult.result.result.length; i++) {
              const entry = {
                value: redisResult.result.result[i],
              };
              listEntries.push(entry);
            }
            (targetObject as ListDataObject).values = listEntries;
          }
        });
      }
    },
    [redisFetchListValues]
  );

  const fetchHashValues = React.useCallback(
    async (
      object: HashDataObject,
      cursor: number,
      match: string,
      count: number
    ) => {
      const redisResult = await redisFetchHashValues(
        object.key,
        cursor,
        match,
        count
      );
      if (redisResult.success) {
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          const targetObject = targetSession.objects.find(
            (o) => o.id === object.id
          );
          if (targetObject) {
            (targetObject as HashDataObject).total = redisResult.result.total;
            (targetObject as HashDataObject).match = match;
            (targetObject as HashDataObject).count = count;
            (targetObject as HashDataObject).lastCursor = parseInt(
              redisResult.result.result[0]
            );
            const hashEntries = [] as HashValueType[];
            for (let i = 0; i < redisResult.result.result[1].length; i += 2) {
              const entry = {
                field: redisResult.result.result[1][i],
                value: redisResult.result.result[1][i + 1],
              };
              hashEntries.push(entry);
            }
            (targetObject as HashDataObject).values = hashEntries;
          }
        });
      }
    },
    [redisFetchHashValues]
  );

  const fetchSetValues = React.useCallback(
    async (
      object: SetDataObject,
      cursor: number,
      match: string,
      count: number
    ) => {
      const redisResult = await redisFetchSetValues(
        object.key,
        cursor,
        match,
        count
      );
      if (redisResult.success) {
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          const targetObject = targetSession.objects.find(
            (o) => o.id === object.id
          );
          if (targetObject) {
            (targetObject as SetDataObject).total = redisResult.result.total;
            (targetObject as SetDataObject).match = match;
            (targetObject as SetDataObject).count = count;
            (targetObject as SetDataObject).lastCursor = parseInt(
              redisResult.result.result[0]
            );
            const setEntries = [] as SetValueType[];
            for (let i = 0; i < redisResult.result.result[1].length; i++) {
              const entry = {
                value: redisResult.result.result[1][i],
              };
              setEntries.push(entry);
            }
            (targetObject as SetDataObject).values = setEntries;
          }
        });
      }
    },
    [redisFetchSetValues]
  );

  const fetchZsetValues = React.useCallback(
    async (
      object: ZsetDataObject,
      cursor: number,
      match: string,
      count: number
    ) => {
      const redisResult = await redisFetchZsetValues(
        object.key,
        cursor,
        match,
        count
      );
      if (redisResult.success) {
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          const targetObject = targetSession.objects.find(
            (o) => o.id === object.id
          );
          if (targetObject) {
            (targetObject as ZsetDataObject).total = redisResult.result.total;
            (targetObject as ZsetDataObject).match = match;
            (targetObject as ZsetDataObject).count = count;
            (targetObject as ZsetDataObject).lastCursor = parseInt(
              redisResult.result.result[0]
            );
            const zsetEntries = [] as ZsetValueType[];
            for (let i = 0; i < redisResult.result.result[1].length; i += 2) {
              const entry = {
                value: redisResult.result.result[1][i] as string,
                score: parseInt(redisResult.result.result[1][i + 1]),
              };
              zsetEntries.push(entry);
            }
            (targetObject as ZsetDataObject).values = zsetEntries;
          }
        });
      }
    },
    [redisFetchZsetValues]
  );

  return {
    tabs,
    activeTabId,
    activeTab,
    activeTabIndex,
    activeDb,
    serverInfo,
    serverConfig,
    getTabByObject,
    setActiveTabId,
    addTab,
    deleteTab,
    deleteOtherTabs,
    deleteTabsToTheRight,
    clearTabs,
    addTerminalTab,
    addLuaEditorTab,
    addObjectTab,
    updateTabTemporary,
    activeObject,
    objects,
    getObjectByTab,
    createObject,
    loadServerInfo,
    loadServerConfig,
    loadObjects,
    deleteObject,
    renameObjectKey,
    expireObject,
    updateStringValue,
    loadObject,
    addHashField,
    updateHashField,
    updateHashValue,
    deleteHashField,
    addListValue,
    updateListValue,
    deleteListValue,
    addSetValue,
    updateSetValue,
    deleteSetValue,
    addZsetValue,
    updateZsetValue,
    deleteZsetValue,
    selectDb,
    executeLua,
    swapTab,
    fetchListValues,
    fetchHashValues,
    fetchSetValues,
    fetchZsetValues,
  };
};
