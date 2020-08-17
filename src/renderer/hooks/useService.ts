import React from 'react';
import { UseSessionHook } from '@src/hooks/useSession';
import { v4 as uuidv4 } from 'uuid';
import { UseGlobalHook } from '@src/hooks/useGlobal';
import { DataObject, ObjectDataType, Session, Tab, TabType } from '@src/types';
import { RedisResult, UseRedisHook } from '@src/hooks/useRedis';
import _ from 'lodash';

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
  updateObjectValue: (object: DataObject, value: string) => void;
  loadObject: (object: DataObject) => void;
  addHashField: (object: DataObject, field: string, value: string) => void;
  updateHashField: (
    object: DataObject,
    oldField: string,
    newField: string,
    value: string
  ) => void;
  updateHashValue: (object: DataObject, field: string, value: string) => void;
  deleteHashField: (object: DataObject, field: string) => void;
  addListValue: (object: DataObject, value: string) => void;
  updateListValue: (object: DataObject, index: number, value: string) => void;
  deleteListValue: (object: DataObject, index: number) => void;
  addSetValue: (object: DataObject, value: string) => void;
  updateSetValue: (
    object: DataObject,
    oldValue: string,
    newValue: string
  ) => void;
  deleteSetValue: (object: DataObject, value: string) => void;
  addZsetValue: (object: DataObject, score: number, value: string) => void;
  updateZsetValue: (
    object: DataObject,
    oldValue: string,
    score: number,
    newValue: string
  ) => void;
  deleteZsetValue: (object: DataObject, value: string) => void;
  selectDb: (value: string) => void;
  executeLua: (lua: string, numsOfKey: number, ...keyOrArgvs: any[]) => void;
  swapTab: (sourceIndex: number, targetIndex: number) => void;
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
            if (existsTemporaryTab) {
              existsTemporaryTab.id = newTab.id;
              existsTemporaryTab.type = newTab.type;
              existsTemporaryTab.name = newTab.name;
              existsTemporaryTab.temporary = newTab.temporary;
              targetSession.activeTabId = existsTemporaryTab.id;
            } else {
              targetSession.tabs.push(newTab);
              targetSession.activeTabId = id;
            }
            break;
          case 'luaEditor':
            if (existsTemporaryTab) {
              existsTemporaryTab.id = newTab.id;
              existsTemporaryTab.type = newTab.type;
              existsTemporaryTab.name = newTab.name;
              existsTemporaryTab.temporary = newTab.temporary;
              targetSession.activeTabId = existsTemporaryTab.id;
            } else {
              targetSession.tabs.push(newTab);
              targetSession.activeTabId = id;
            }
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
    [activeTab]
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
          redisResult = await redisCreateSetObject(params.key, params.value);
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
        //showMessage('error', 'create object error');
        //} else {
        // await loadObjects();
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
   * 更新 object value
   */
  const updateObjectValue = React.useCallback(
    async (object: DataObject, value: string) => {
      const redisResult = await redisUpdateObjectValue(object.key, value);
      if (redisResult.success) {
        updateSessionState((draft) => {
          const targetSession = draft.sessions.find((s) => s.id === session.id);
          if (!targetSession) return;
          targetSession.objects.find((o) => o.id === object.id)!.value = value;
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
          if (type !== undefined) {
            targetObject!.dataType = type;
          }
          if (value !== undefined) {
            targetObject!.value = value;
          }
          if (expire !== undefined) {
            targetObject!.expire = expire;
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
    async (object: DataObject, field: string, value: string) => {
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
      object: DataObject,
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
      }
    },
    [redisUpdateHashField, loadObject]
  );

  /**
   * 更新 hash value
   */
  const updateHashValue = React.useCallback(
    async (object: DataObject, field: string, value: string) => {
      const redisResult = await redisUpdateHashValue(object.key, field, value);
      if (redisResult.success) {
        loadObject(object);
      }
    },
    [redisUpdateHashField, loadObject]
  );

  /**
   * 删除 hash field
   */
  const deleteHashField = React.useCallback(
    async (object: DataObject, field: string) => {
      const fieldCount = Object.keys(object.value).length;
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
    async (object: DataObject, value: string) => {
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
    async (object: DataObject, index: number, value: string) => {
      const redisResult = await redisUpdateListValue(object.key, index, value);
      if (!redisResult.success) {
        loadObject(object);
      }
    },
    []
  );

  /**
   * 删除 list value
   */
  const deleteListValue = React.useCallback(
    async (object: DataObject, index: number) => {
      const valueCount = object.value.length;
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
    async (object: DataObject, value: string) => {
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
    async (object: DataObject, oldValue: string, newValue: string) => {
      const redisResult = await redisUpdateSetValue(
        object.key,
        oldValue,
        newValue
      );
      if (redisResult.success) {
        loadObject(object);
      }
    },
    [redisUpdateSetValue, loadObject]
  );

  /**
   * 删除 set value
   */
  const deleteSetValue = React.useCallback(
    async (object: DataObject, value: string) => {
      const valueCount = object.value.length;
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
    async (object: DataObject, score: number, value: string) => {
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
      object: DataObject,
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
      }
    },
    [redisUpdateZsetValue, loadObject]
  );

  /**
   * 删除 set value
   */
  const deleteZsetValue = React.useCallback(
    async (object: DataObject, value: string) => {
      const valueCount = object.value.length;
      const redisResult = await redisDeleteZsetValue(object.key, value);
      if (valueCount <= 2) {
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

  /**
   * 更新Object 在树状结构里的开闭状态
   */
  const updateObjectOpenness = React.useCallback(
    (object: DataObject, isOpen: boolean) => {
      updateSessionState((draft) => {
        const targetSession = draft.sessions.find((s) => s.id === session.id);
        if (!targetSession) return;
        const targetObject = targetSession.objects.find(
          (o) => o.id === object.id
        );
        if (targetObject) {
          targetObject.isOpenByDefault = isOpen;
        }
      });
    },
    []
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
    updateObjectValue,
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
    updateObjectOpenness,
  };
};
